import {
  CompiledQuery,
  DatabaseConnection,
  Driver,
  Kysely,
  QueryResult,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";
import { format as formatSql } from "sql-formatter";
import { parse, format, relative } from "path";
import MigraineError from "./utils/error";
import React from "react";
import { Box, Text } from "ink";
import SyntaxHighlight from "ink-syntax-highlight";

export class PrinterDriver implements Driver {
  statementCollector: (statement: string) => void;

  constructor(statementCollector: (statement: string) => void) {
    this.statementCollector = statementCollector;
  }

  async init(): Promise<void> {
    // Nothing to do here.
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new DummyConnection(this.statementCollector);
  }

  async beginTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async commitTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async rollbackTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async releaseConnection(): Promise<void> {
    // Nothing to do here.
  }

  async destroy(): Promise<void> {
    // Nothing to do here.
  }
}

class DummyConnection implements DatabaseConnection {
  statementCollector: (statement: string) => void;

  constructor(statementCollector: (statement: string) => void) {
    this.statementCollector = statementCollector;
  }

  async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
    this.statementCollector(compiledQuery.sql);

    return {
      rows: [],
    };
  }

  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    // Nothing to do here.
  }
}

export type SQLGenerationResult = {
  sql: string;
  sourceFile: string;
  outputFilename: string;
};

const generateSql = async (filename: string): Promise<SQLGenerationResult> => {
  const source = await import(filename);
  if (!source.up)
    throw new MigraineError(
      (
        <Text>
          No function named up exported from migration file{" "}
          <Text underline>{filename}</Text>
        </Text>
      ),
      `No function named up exported from migration file ${filename}.`
    );

  const lines: string[] = [];

  const db = new Kysely<any>({
    dialect: {
      createAdapter() {
        return new SqliteAdapter();
      },
      createDriver() {
        return new PrinterDriver((line) => lines.push(`${line};`));
      },
      createIntrospector(db: Kysely<any>) {
        return new SqliteIntrospector(db);
      },
      createQueryCompiler() {
        return new SqliteQueryCompiler();
      },
    },
  });

  const proxy = new Proxy(db, {
    get(target, prop) {
      if (prop === "getExecutor") {
        return db.getExecutor.bind(db);
      }

      if (prop == "schema") {
        return db.schema;
      }

      throw new MigraineError(
        (
          <>
            <Box>
              <Text>
                Migraine doesn&apos;t yet support the{" "}
                <Text bold>Kysely.{String(prop)}</Text> module. If you want to
                run arbitrary code you can use the <Text bold>sql</Text>{" "}
                template tag. Example:{"\n"}
              </Text>
            </Box>
            <SyntaxHighlight
              code={`import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql\`YOUR SQL CODE HERE\`.execute(db);
}`}
              language="typescript"
            />
          </>
        ),
        `Migraine doesn\'t yet support the Kysely.${String(
          prop
        )} module. Please only use the Kysely.schema module in migrations. If you want to run arbitrary code you can use the sql template tag: sql\`select * from person\`.execute(db)`
      );
    },
  });

  try {
    await source.up(proxy);
  } catch (e: any) {
    if (e instanceof MigraineError) throw e;

    throw new MigraineError(
      (
        <Box>
          <Text>
            Unexpected error occurred while processing{" "}
            <Text underline>{filename}</Text>
            {"\n"}
            {e.message}
          </Text>
        </Box>
      ),
      `Unexpected error occurred while processing ${filename}.\n${String(e)}`
    );
  }

  const parsedPath = parse(filename);
  const outputFilename = format({
    name: parsedPath.name,
    ext: ".sql",
  });

  const sql = `-- ${outputFilename} generated on ${new Date().toISOString()} using migraine 💊
-- Changes should be made to the source file: ${relative(
    process.cwd(),
    filename
  )}

${formatSql(lines.join("\n"), {
  language: "sqlite",
  linesBetweenQueries: 2,
  keywordCase: "upper",
})}
`;

  return {
    sql,
    sourceFile: filename,
    outputFilename,
  };
};

export default generateSql;

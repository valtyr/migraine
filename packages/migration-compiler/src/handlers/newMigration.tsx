import { join, parse, relative } from "path";
import React from "react";
import { getWranglerConfig } from "../utils/config";
import MigraineError from "../utils/error";
import { ensureIsDirectory, normalizePath } from "../utils/path";
import { Box, render, Text } from "ink";
import { readdir, writeFile } from "fs/promises";
import prompts from "prompts";

const defaultMigration = `import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Write your up migration here
  throw new Error('Up migration not yet implemented');
}

export async function down(db: Kysely<any>): Promise<void> {
  // Write your down migration here
  throw new Error('Down migration not yet implemented');
}
`;

const attemptToPrettify = async (sourceCode: string) => {
  try {
    const prettier = await import("prettier");
    const config = prettier.resolveConfig(process.cwd());

    return prettier.format(sourceCode, {
      ...(config || {}),
      parser: "typescript",
    });
  } catch {
    return sourceCode;
  }
};

const newMigrationHandler = async (input: {
  sourceDirectory?: string | null;
  message?: string | null;
}) => {
  const config = await getWranglerConfig();

  const sourceDirectory = normalizePath(
    input.sourceDirectory || config.migraine.source_folder || "src/migrations"
  );

  if (!(await ensureIsDirectory(sourceDirectory))) {
    throw new MigraineError(
      (
        <Text>
          Source directory {relative(process.cwd(), sourceDirectory)} does not
          exist
        </Text>
      ),
      `Source directory ${relative(
        process.cwd(),
        sourceDirectory
      )} does not exist`
    );
  }

  const sourceFiles = await readdir(sourceDirectory, { withFileTypes: true });

  let serialLength: number | null = null;
  let serialSet = new Set<number>();

  const migrationFiles = sourceFiles.flatMap((value) => {
    if (!value.isFile() || !/\.ts|\.js^/i.test(value.name)) return [];

    const name = parse(value.name).name;

    const parts = name.split("_");
    const serial = Number(parts[0]);

    if (isNaN(serial)) {
      throw new MigraineError(
        (
          <Text>
            Migration source filename <Text underline>{value.name}</Text> is
            invalid since it doesn&apos;t start with a serial number. Please fix
            this issue before creating a new migration.
          </Text>
        ),
        `Migration source filename ${value.name} is invalid since it doesn't start with a serial number. Please fix this issue before creating a new migration.`
      );
    }

    if (serialLength == null) serialLength = parts[0].length;
    if (serialLength !== parts[0].length) {
      throw new MigraineError(
        (
          <Text>
            The serial number prefixes on your migration filenames are
            inconsistently long. Please fix this issue before creating a new
            migration.
          </Text>
        ),
        `The serial number prefixes on your migration filenames are inconsistently long. Please fix this issue before creating a new migration.`
      );
    }
    if (serialSet.has(serial)) {
      throw new MigraineError(
        (
          <Text>
            Migraine encountered two or more migrations with the same serial
            number <Text underline>{serial}</Text>. Please fix ths issue before
            creating a new migration.
          </Text>
        ),
        `Migraine encountered two or more migrations with the same serial number ${serial}. Please fix this issue before creating a new migration.`
      );
    }

    serialSet.add(serial);

    return {
      valid: true,
      path: join(sourceDirectory, value.name),
      name,
      file: value.name,
      serial,
    };
  });

  const newMigrationNumber =
    Math.max(...migrationFiles.map((m) => m.serial), -1) + 1;
  const newMigrationPrefix = String(newMigrationNumber).padStart(
    serialLength || 5,
    "0"
  );

  const message =
    input.message ||
    ((
      await prompts({
        type: "text",
        name: "message",
        message: "Migration message:",
        warn: (prev) => {
          return "test";
        },
      })
    ).message as string);

  const sanitized = message
    .substring(0, 100)
    .replaceAll(/[^a-z-.\s]/gi, "")
    .replaceAll(" ", "_");
  const prefixed = `${newMigrationPrefix}_${sanitized}.ts`;

  await writeFile(
    join(sourceDirectory, prefixed),
    await attemptToPrettify(defaultMigration),
    { encoding: "utf-8" }
  );

  render(
    <Box
      borderColor="green"
      borderStyle="round"
      flexDirection="column"
      paddingX={1}
    >
      <Box>
        <Text underline bold color="greenBright">
          Success!
        </Text>
      </Box>
      <Box>
        <Text>
          Created new migration file{" "}
          <Text underline>
            {relative(process.cwd(), join(sourceDirectory, prefixed))}
          </Text>
          {"\n"}Open it up in your editor of choice! 🧠
        </Text>
      </Box>
    </Box>
  );
};

export default newMigrationHandler;

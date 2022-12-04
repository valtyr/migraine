import * as Parsinator from "./parsinator";

type ParsedType<T extends (...args: any) => any> =
  ReturnType<T> extends Generator<any, infer R, any> ? R : never;

const whitespace = Parsinator.regex(/^\s+/);
const whitespaceMaybe = Parsinator.maybe(whitespace);

const doubleQuotedString = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str('"');
  const value = yield* Parsinator.until(Parsinator.str('"'));
  return value;
});

const singleQuotedString = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str("'");
  const value = yield* Parsinator.until(Parsinator.str("'"));
  return value;
});

const unquotedString = Parsinator.regex(/^[^\s\.\(-]+/);

const anyString = Parsinator.choice([
  doubleQuotedString,
  singleQuotedString,
  unquotedString,
]);

const tableNameWithoutSchema = Parsinator.fromGenerator<{
  schema: string | null;
  name: string;
}>(function* () {
  const name = yield* anyString;
  return { schema: null, name };
});

const tableNameWithSchema = Parsinator.fromGenerator<{
  schema: string | null;
  name: string;
}>(function* () {
  const schema = yield* anyString;
  yield* whitespaceMaybe;
  yield* Parsinator.str(".");
  yield* whitespaceMaybe;
  const name = yield* anyString;
  return { schema: schema, name };
});

const tableName = Parsinator.choice([
  tableNameWithSchema,
  tableNameWithoutSchema,
]);

const columnDefinition = Parsinator.fromGenerator(function* () {
  const name = yield* anyString;

  const rest = (yield* Parsinator.until(Parsinator.regex(/,|\)/i))).trim();

  return { name, rest };
});

const trailingColumnDefinition = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str(",");
  yield* whitespaceMaybe;

  const def = yield* columnDefinition;

  yield* whitespaceMaybe;

  return def;
});

const constraintName = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;
  yield* Parsinator.regex(/^constraint/i);
  yield* whitespace;
  const name = yield* anyString;
  yield* whitespace;
  return name;
});

const conflictClause = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;

  yield* Parsinator.regex(/^on\s+conflict\s+/i);

  const resolution = (yield* Parsinator.regex(
    /^(rollback|abort|fail|ignore|replace)/i
  )).toLowerCase() as "rollback" | "abort" | "fail" | "ignore" | "replace";

  yield* whitespaceMaybe;

  return resolution;
});

const primaryKeyColumnConstraint = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;
  yield* Parsinator.regex(/^primary\s+key/i);
  yield* whitespace;

  const dir = ((yield* Parsinator.maybe(
    Parsinator.regex(/^(asc|desc)/i)
  ))?.toLowerCase() || null) as "asc" | "desc" | null;

  if (dir) {
    yield* whitespace;
  }

  const onConflict = yield* Parsinator.maybe(conflictClause);

  const autoincrement = !!(yield* Parsinator.maybe(
    Parsinator.regex(/^autoincrement/i)
  ));

  return {
    type: "PrimaryKey" as const,
    dir,
    onConflict,
    autoincrement,
  };
});

const notNullColumnConstraint = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;
  yield* Parsinator.regex(/^not\s+null/i);
  yield* whitespace;

  const onConflict = yield* Parsinator.maybe(conflictClause);

  return {
    type: "NotNull" as const,
    onConflict,
  };
});

const collationName = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^collate/i);
  yield* whitespace;
  const name = yield* anyString;
  yield* whitespaceMaybe;
  return name;
});

const indexedColumnName = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;

  const column = yield* anyString;

  yield* whitespace;

  const collation = yield* Parsinator.maybe(collationName);

  const dir = ((yield* Parsinator.maybe(
    Parsinator.regex(/^(asc|desc)/i)
  ))?.toLowerCase() || null) as "asc" | "desc" | null;

  if (dir) {
    yield* whitespace;
  }

  return { type: "IndexedColumn" as const, column, collation, dir };
});

const indexedColumnExpr = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;

  // TODO: Implement expression
});

const notNullConstraint = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;
  yield* Parsinator.regex(/^not\s+null/i);
  yield* whitespace;

  const onConflict = yield* Parsinator.maybe(conflictClause);

  return {
    type: "NotNull" as const,
    onConflict,
  };
});

const tableConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str(",");
  yield* whitespaceMaybe;

  const name = yield* Parsinator.maybe(constraintName);
  yield* whitespaceMaybe;

  // const constraint:
  //   | ParsedType<typeof primaryKeyConstraint>
  //   | ParsedType<typeof notNullConstraint> = yield* Parsinator.choice<any>([
  //   primaryKeyConstraint,
  //   notNullConstraint,
  // ]);

  // return { name, constraint };
  return { name };
});

const columnDefinitionsAndTableConstraints = Parsinator.fromGenerator(
  function* () {
    yield* whitespaceMaybe;

    const firstColumnDefinition = yield* columnDefinition;

    yield* whitespaceMaybe;

    const restOfColumnDefinitions = yield* Parsinator.many(
      trailingColumnDefinition
    );

    yield* whitespaceMaybe;

    const constraints = yield* Parsinator.many(tableConstraint);

    yield* whitespaceMaybe;

    return {
      columnDefinitions: [firstColumnDefinition, ...restOfColumnDefinitions],
      constraints,
    };
  }
);

const createTableStatement = Parsinator.fromGenerator(function* () {
  yield* whitespaceMaybe;

  yield* Parsinator.regex(/^create/i);
  yield* whitespace;

  const temporary = !!(yield* Parsinator.maybe(
    Parsinator.choice([
      Parsinator.regex(/^temporary\s+/i),
      Parsinator.regex(/^temp\s+/i),
    ])
  ));

  yield* Parsinator.regex(/^table/i);
  yield* whitespace;

  const ifNotExists = !!(yield* Parsinator.maybe(
    Parsinator.regex(/^if\s+not\s+exists\s+/i)
  ));

  const { schema, name } = yield* tableName;

  yield* whitespaceMaybe;

  const { columnDefinitions, constraints } = yield* Parsinator.surround(
    Parsinator.str("("),
    columnDefinitionsAndTableConstraints,
    Parsinator.str(")")
  );

  return {
    schema,
    name,
    temporary,
    ifNotExists,
    columnDefinitions,
    constraints,
  };
});

export const parseCreateTableStatement = (schema: string) =>
  Parsinator.run(createTableStatement, schema);

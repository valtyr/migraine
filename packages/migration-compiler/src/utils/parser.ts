import {
  parse,
  mustEnd,
  invert,
  lookAhead,
  ParseResult,
  ParseGenerator,
  has,
} from "yieldparser";

type ParseFunctionResult<T extends (...args: any) => any> =
  ReturnType<T> extends ParseGenerator<infer E> ? E : never;

const whitespace = /^\s+/;
const whitespaceMaybe = /^\s*/;
const unquotedString = /^[^\s\.-]+/;

export function* SingleQuotedString(): ParseGenerator<string> {
  let name = "";

  yield "'";

  while (!(yield has("'"))) {
    const [char]: [string] = yield /^./i;
    name += char;
  }

  return name;
}

export function* QuotedString(): ParseGenerator<string> {
  let name = "";

  yield '"';

  while (!(yield has('"'))) {
    const [char]: [string] = yield /^./i;
    name += char;
  }

  return name;
}

export function* UnquotedString(): ParseGenerator<string> {
  const [s]: [string] = yield unquotedString;
  return s;
}

export function* SQLiteString(): ParseGenerator<string> {
  return yield [QuotedString, SingleQuotedString, UnquotedString];
}

export function* TableNameWithoutSchema(): ParseGenerator<{
  schema: string | null;
  name: string;
}> {
  const name = yield SQLiteString;
  return { schema: null, name };
}

export function* TableNameWithSchema(): ParseGenerator<{
  schema: string | null;
  name: string;
}> {
  const schema = yield SQLiteString;
  yield whitespaceMaybe;
  yield ".";
  yield whitespaceMaybe;
  const name = yield SQLiteString;

  return { schema, name };
}

export function* TableName(): ParseGenerator<{
  schema: string | null;
  name: string;
}> {
  return yield [TableNameWithSchema, TableNameWithoutSchema];
}

export function* ColumnType(): ParseGenerator<{
  typename: string;
  numericArgument1: number;
  numericArgument2: number;
}> {}

export function* ColumnDefinitions(): ParseGenerator<{}> {
  const name = yield SQLiteString;
  yield whitespace;

  const type = yield ColumnType;
}

export function* TableConstraints(): ParseGenerator<{}> {}

export function* ColumnDefinitionsAndTableConstraints(): ParseGenerator {
  yield "(";
  yield whitespaceMaybe;

  yield ColumnDefinitions;

  // yield whitespaceMaybe;

  // yield TableConstraints;

  yield whitespaceMaybe;
  yield ")";

  return {};
}

export function* CreateTableStatement(): ParseGenerator<{
  type: "CREATE_TABLE";
  temporary: boolean;
  ifNotExists: boolean;
  schema: string | null;
  name: string;
}> {
  yield /^create/i;
  yield whitespace;

  const parameters = {
    temporary: false,
    ifNotExists: false,
  };

  if ((yield has(/^temporary\s+/i)) || (yield has(/^temp\s+/i))) {
    parameters.temporary = true;
  }

  yield /^table/i;
  yield whitespace;

  if (yield has(/^if\s+not\s+exists\s+/i)) {
    parameters.ifNotExists = true;
  }

  const { schema, name } = yield TableName;

  yield whitespaceMaybe;

  const { columns, tableConstraints } =
    yield ColumnDefinitionsAndTableConstraints;

  return { type: "TABLE", ...parameters, schema, name };
}

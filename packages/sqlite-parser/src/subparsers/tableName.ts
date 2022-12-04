import * as Parsinator from "../parsinator";
import { stringLiteral } from "./stringLiteral";

const tableNameWithoutSchema = Parsinator.fromGenerator<{
  schema: string | null;
  name: string;
}>(function* () {
  const name = yield* stringLiteral;
  return { schema: null, name };
});

const tableNameWithSchema = Parsinator.fromGenerator<{
  schema: string | null;
  name: string;
}>(function* () {
  const schema = yield* stringLiteral;
  yield* Parsinator.regex(/^\s*/);
  yield* Parsinator.str(".");
  yield* Parsinator.regex(/^\s*/);
  const name = yield* stringLiteral;
  return { schema: schema, name };
});

export const tableName = Parsinator.choice([
  tableNameWithSchema,
  tableNameWithoutSchema,
]);

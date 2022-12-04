import * as Parsinator from "../parsinator";

export const doubleQuotedString = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str('"');
  const value = yield* Parsinator.until(Parsinator.str('"'));
  yield* Parsinator.str('"');
  return value;
});

export const singleQuotedString = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str("'");
  const value = yield* Parsinator.until(Parsinator.str("'"));
  yield* Parsinator.str("'");
  return value;
});

export const unquotedString = Parsinator.regex(/^[^\s\.\(\)\,\"-]+/);

export const stringLiteral = Parsinator.choice([
  doubleQuotedString,
  singleQuotedString,
  unquotedString,
]);

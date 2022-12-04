import * as Parsinator from "../parsinator";

const trueBooleanLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^true/i);
  return { type: "boolean" as const, value: true };
});
const falseBooleanLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^false/i);
  return { type: "boolean" as const, value: false };
});

export const booleanLiteral = Parsinator.choice([
  trueBooleanLiteral,
  falseBooleanLiteral,
]);

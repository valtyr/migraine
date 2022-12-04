import * as Parsinator from "../parsinator";

const cStyleComment = Parsinator.fromGenerator(function* () {
  const comment = yield* Parsinator.between(
    Parsinator.str("/*"),
    Parsinator.choice([Parsinator.end, Parsinator.str("*/")])
  );
  return { type: "comment" as const, value: comment };
});

const sqliteStyleComment = Parsinator.fromGenerator(function* () {
  const comment = yield* Parsinator.between(
    Parsinator.str("--"),
    Parsinator.choice([Parsinator.end, Parsinator.regex(/^(\n|\r\n)/)])
  );
  return { type: "comment" as const, value: comment };
});

export const comment = Parsinator.choice([cStyleComment, sqliteStyleComment]);

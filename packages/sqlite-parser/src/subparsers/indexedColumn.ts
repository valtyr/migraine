import * as Parsinator from "../parsinator";
import { direction } from "./direction";
import { stringLiteral } from "./stringLiteral";
import { whitespaceComment } from "./whitespaceCommentMaybe";

export const indexedColumn = Parsinator.fromGenerator(function* () {
  const columnName = yield* stringLiteral;

  const collationName = yield* Parsinator.maybe(
    Parsinator.fromGenerator(function* () {
      yield* whitespaceComment;
      yield* Parsinator.regex(/^collate/i);
      yield* whitespaceComment;
      return yield* stringLiteral;
    })
  );

  const dir = yield* Parsinator.maybe(direction);

  return {
    type: "indexedColumn" as const,
    columnName,
    collationName,
    dir,
  };
});

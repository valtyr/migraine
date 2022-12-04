import * as Parsinator from "../parsinator";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

export const conflictClause = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^on/i);

  yield* whitespaceCommentMaybe;

  yield* Parsinator.regex(/^conflict/i);

  yield* whitespaceCommentMaybe;

  const resolution = (yield* Parsinator.regex(
    /^(rollback|abort|fail|ignore|replace)/i
  )).toLowerCase() as "rollback" | "abort" | "fail" | "ignore" | "replace";

  return resolution;
});

export const conflictClauseMaybe = Parsinator.maybe(
  Parsinator.fromGenerator(function* () {
    yield* whitespaceComment;
    const onConflict = yield* conflictClause;
    return onConflict;
  })
);

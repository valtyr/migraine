import * as Parsinator from "../parsinator";
import { stringLiteral } from "./stringLiteral";
import { whitespaceComment } from "./whitespaceCommentMaybe";

export const constraintName = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^constraint/i);
  yield* whitespaceComment;
  const name = yield* stringLiteral;
  return name;
});

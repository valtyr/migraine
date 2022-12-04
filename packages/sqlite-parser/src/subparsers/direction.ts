import * as Parsinator from "../parsinator";
import { whitespaceComment } from "./whitespaceCommentMaybe";

export const direction = Parsinator.fromGenerator(function* () {
  yield* whitespaceComment;
  return (yield* Parsinator.regex(
    /^(asc|desc)/i
  )).toLowerCase() as "asc" | "desc";
});

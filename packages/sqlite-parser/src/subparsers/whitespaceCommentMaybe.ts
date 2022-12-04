import * as Parsinator from "../parsinator";
import { comment } from "./comment";

export const whitespaceCommentMaybe = Parsinator.fromGenerator(function* () {
  yield* Parsinator.many(
    Parsinator.choice<
      | {
          type: string;
          value: string;
        }
      | string
    >([comment, Parsinator.regex(/^\s/)])
  );
});

export const whitespaceComment = Parsinator.fromGenerator(function* () {
  yield* Parsinator.many1(
    Parsinator.choice<
      | {
          type: string;
          value: string;
        }
      | string
    >([comment, Parsinator.regex(/^\s/)])
  );
});

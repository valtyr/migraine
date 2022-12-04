import * as Parsinator from "./parsinator";
import { createIndexStatement } from "./subparsers/createIndexStatement";
import { createTableStatement } from "./subparsers/createTableStatement";
import { whitespaceCommentMaybe } from "./subparsers/whitespaceCommentMaybe";
import { InferredResult } from "./util";

const file = Parsinator.fromGenerator(function* () {
  yield* whitespaceCommentMaybe;

  const statements = yield* Parsinator.sepBy(
    Parsinator.str(";"),
    Parsinator.choice<
      | InferredResult<typeof createTableStatement>
      | InferredResult<typeof createIndexStatement>
    >([createTableStatement, createIndexStatement])
  );

  yield* Parsinator.maybe(Parsinator.str(";"));
  yield* whitespaceCommentMaybe;

  yield* Parsinator.end();

  return { type: "file" as const, statements };
});

export const parseFile = (schema: string) => Parsinator.run(file, schema);

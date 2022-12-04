import * as Parsinator from "../parsinator";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

const withoutRowId = Parsinator.fromGenerator<["withoutRowId", true]>(
  function* () {
    yield* Parsinator.regex(/^without/i);
    yield* whitespaceComment;
    yield* Parsinator.regex(/^rowid/i);
    return ["withoutRowId", true];
  }
);

const strict = Parsinator.fromGenerator<["strict", true]>(function* () {
  yield* Parsinator.regex(/^strict/i);
  return ["strict", true];
});

export const tableOptions = Parsinator.fromGenerator<{
  strict: true | null;
  withoutRowId: true | null;
}>(function* () {
  const entries = yield* Parsinator.sepBy1(
    Parsinator.sequence<any>([
      whitespaceCommentMaybe,
      Parsinator.str(","),
      whitespaceCommentMaybe,
    ]),
    Parsinator.choice<["withoutRowId", true] | ["strict", true]>([
      withoutRowId,
      strict,
    ])
  );

  const object = Object.fromEntries(entries);

  return {
    strict: object.strict || null,
    withoutRowId: object.withoutRowId || null,
  };
});

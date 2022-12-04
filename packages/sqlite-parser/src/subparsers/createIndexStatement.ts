import * as Parsinator from "../parsinator";
import { indexedColumn } from "./indexedColumn";
import { stringLiteral } from "./stringLiteral";
import { tableName } from "./tableName";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

export const createIndexStatement = Parsinator.fromGenerator(function* () {
  yield* whitespaceCommentMaybe;

  yield* Parsinator.regex(/^create/i);
  yield* whitespaceComment;

  const unique = !!(yield* Parsinator.maybe(
    Parsinator.sequence<any>([Parsinator.regex(/^unique/i), whitespaceComment])
  ));

  yield* Parsinator.regex(/^index/i);
  yield* whitespaceComment;

  const ifNotExists = !!(yield* Parsinator.maybe(
    Parsinator.sequence<any>([
      Parsinator.regex(/^if/i),
      whitespaceComment,
      Parsinator.regex(/^not/i),
      whitespaceComment,
      Parsinator.regex(/^exists/i),
      whitespaceComment,
    ])
  ));

  const { schema, name } = yield* tableName;

  yield* whitespaceCommentMaybe;

  yield* Parsinator.regex(/^on/i);
  yield* whitespaceComment;

  const table = yield* stringLiteral;

  yield* whitespaceCommentMaybe;

  const indexedColumns = yield* Parsinator.maybe(
    Parsinator.surround(
      Parsinator.sequence<any>([Parsinator.str("("), whitespaceCommentMaybe]),
      Parsinator.sepBy1(
        Parsinator.sequence<any>([
          whitespaceCommentMaybe,
          Parsinator.str(","),
          whitespaceCommentMaybe,
        ]),
        indexedColumn
      ),
      Parsinator.sequence<any>([whitespaceCommentMaybe, Parsinator.str(")")])
    )
  );

  yield* whitespaceCommentMaybe;

  // TODO:
  // MISSING
  //   - Where clause (waiting for expr)
  // https://www.sqlite.org/lang_createindex.html

  return {
    type: "createIndex",
    schema,
    name,
    unique,
    ifNotExists,
    tableName: table,
    indexedColumns,
  };
});

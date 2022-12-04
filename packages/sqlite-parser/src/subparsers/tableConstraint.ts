import * as Parsinator from "../parsinator";
import { InferredResult } from "../util";
import { conflictClauseMaybe } from "./conflictClause";
import { constraintName } from "./constraintName";
import { foreignKeyClause } from "./foreignKeyClause";
import { indexedColumn } from "./indexedColumn";
import { stringLiteral } from "./stringLiteral";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

export const primaryKeyTableConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^primary/i);
  yield* whitespaceComment;
  yield* Parsinator.regex(/^key/i);
  yield* whitespaceComment;

  const indexedColumns = yield* Parsinator.surround(
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
  );

  const onConflict = yield* conflictClauseMaybe;

  return {
    type: "tableConstraint" as const,
    subtype: "primaryKey" as const,
    onConflict,
    indexedColumns,
  };
});

export const uniqueColumnTableConstraint = Parsinator.fromGenerator(
  function* () {
    yield* Parsinator.regex(/^unique/i);
    yield* whitespaceCommentMaybe;

    const indexedColumns = yield* Parsinator.surround(
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
    );

    const onConflict = yield* conflictClauseMaybe;

    return {
      type: "tableConstraint" as const,
      subtype: "unique" as const,
      indexedColumns,
      onConflict,
    };
  }
);

export const foreignKeyTableConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^foreign/i);
  yield* whitespaceComment;
  yield* Parsinator.regex(/^key/i);
  yield* whitespaceComment;

  const columnNames = yield* Parsinator.surround(
    Parsinator.sequence<any>([Parsinator.str("("), whitespaceCommentMaybe]),
    Parsinator.sepBy1(
      Parsinator.sequence<any>([
        whitespaceCommentMaybe,
        Parsinator.str(","),
        whitespaceCommentMaybe,
      ]),
      stringLiteral
    ),
    Parsinator.sequence<any>([whitespaceCommentMaybe, Parsinator.str(")")])
  );
  yield* whitespaceCommentMaybe;

  const foreignKey = yield* foreignKeyClause;

  return {
    type: "tableConstraint" as const,
    subtype: "foreignKey" as const,
    columnNames,
    foreignKeyClause: foreignKey,
  };
});

export const tableConstraint = Parsinator.fromGenerator(function* () {
  const name = yield* Parsinator.maybe(
    Parsinator.fromGenerator(function* () {
      const nameInner = yield* constraintName;
      yield* whitespaceComment;
      return nameInner;
    })
  );

  const constraint = yield* Parsinator.choice<
    | InferredResult<typeof primaryKeyTableConstraint>
    | InferredResult<typeof uniqueColumnTableConstraint>
    | InferredResult<typeof foreignKeyTableConstraint>
  >([
    primaryKeyTableConstraint,
    uniqueColumnTableConstraint,
    foreignKeyTableConstraint,
  ]);

  return { ...constraint, name };
});

// TODO:
// MISSING
//   - Check constraint (waiting for expr)
// https://www.sqlite.org/syntax/table-constraint.html

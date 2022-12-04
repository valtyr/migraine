import * as Parsinator from "../parsinator";
import { InferredResult } from "../util";
import { conflictClause, conflictClauseMaybe } from "./conflictClause";
import { constraintName } from "./constraintName";
import { direction } from "./direction";
import { foreignKeyClause } from "./foreignKeyClause";
import { literalValue } from "./literalValue";
import { signedNumber } from "./signedNumber";
import { stringLiteral } from "./stringLiteral";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

export const primaryKeyColumnConstraint = Parsinator.fromGenerator(
  function* () {
    yield* Parsinator.regex(/^primary/i);
    yield* whitespaceComment;
    yield* Parsinator.regex(/^key/i);

    const dir = yield* Parsinator.maybe(direction);
    const onConflict = yield* conflictClauseMaybe;

    const autoincrement = !!(yield* Parsinator.maybe(
      Parsinator.fromGenerator(function* () {
        yield* whitespaceComment;
        return yield* Parsinator.regex(/^autoincrement/i);
      })
    ));

    return {
      type: "columnConstraint" as const,
      subtype: "primaryKey" as const,
      dir,
      onConflict,
      autoincrement,
    };
  }
);

export const notNullColumnConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^not/i);
  yield* whitespaceComment;
  yield* Parsinator.regex(/^null/i);

  const onConflict = yield* conflictClauseMaybe;

  return {
    type: "columnConstraint" as const,
    subtype: "notNull" as const,
    onConflict,
  };
});

export const uniqueColumnConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^unique/i);

  const onConflict = yield* conflictClauseMaybe;

  return {
    type: "columnConstraint" as const,
    subtype: "unique" as const,
    onConflict,
  };
});

export const defaultColumnConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^default/i);
  yield* whitespaceComment;

  // missing expr
  const value = yield* Parsinator.choice([literalValue, signedNumber]);

  return {
    type: "columnConstraint" as const,
    subtype: "default" as const,
    value,
  };
});

export const collateConstraint = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^collate/i);
  yield* whitespaceComment;

  const collationName = yield* stringLiteral;

  return {
    type: "columnConstraint" as const,
    subtype: "collate" as const,
    collationName,
  };
});

export const foreignKeyConstraint = Parsinator.fromGenerator(function* () {
  const foreignKey = yield* foreignKeyClause;

  return {
    type: "columnConstraint" as const,
    subtype: "foreignKey" as const,
    foreignKeyClause: foreignKey,
  };
});

export const columnConstraint = Parsinator.fromGenerator(function* () {
  const name = yield* Parsinator.maybe(
    Parsinator.fromGenerator(function* () {
      const nameInner = yield* constraintName;
      yield* whitespaceComment;
      return nameInner;
    })
  );

  const constraint = yield* Parsinator.choice<
    | InferredResult<typeof primaryKeyColumnConstraint>
    | InferredResult<typeof notNullColumnConstraint>
    | InferredResult<typeof uniqueColumnConstraint>
    | InferredResult<typeof defaultColumnConstraint>
    | InferredResult<typeof collateConstraint>
    | InferredResult<typeof foreignKeyConstraint>
  >([
    defaultColumnConstraint,
    primaryKeyColumnConstraint,
    notNullColumnConstraint,
    uniqueColumnConstraint,
    collateConstraint,
    foreignKeyConstraint,
  ]);

  return { ...constraint, name };
});

// TODO:
// MISSING
//   - Check constraint (waiting for expr)
//   - Generated always (waiting for expr)
// https://www.sqlite.org/syntax/column-constraint.html

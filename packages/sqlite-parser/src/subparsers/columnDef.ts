import * as Parsinator from "../parsinator";
import { InferredResult } from "../util";
import { columnConstraint } from "./columnConstraint";
import { stringLiteral } from "./stringLiteral";
import { typeName } from "./typeName";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

export const columnDefNameAndType = Parsinator.fromGenerator(function* () {
  const columnName = yield* stringLiteral;

  yield* whitespaceComment;

  const type = yield* typeName;

  return {
    type: "columnDef" as const,
    name: columnName,
    columnType: type,
    columnConstraints: null,
  };
});

export const columnDefNameAndConstraints = Parsinator.fromGenerator(
  function* () {
    const columnName = yield* stringLiteral;

    yield* whitespaceComment;

    const columnConstraints = yield* Parsinator.sepBy1(
      whitespaceComment,
      columnConstraint
    );

    return {
      type: "columnDef" as const,
      name: columnName,
      columnType: null,
      columnConstraints,
    };
  }
);

export const columnDefNameTypeAndConstraints = Parsinator.fromGenerator(
  function* () {
    const columnName = yield* stringLiteral;

    yield* whitespaceComment;

    const type = yield* typeName;

    yield* whitespaceComment;

    const columnConstraints = yield* Parsinator.sepBy1(
      whitespaceComment,
      columnConstraint
    );

    return {
      type: "columnDef" as const,
      name: columnName,
      columnType: type,
      columnConstraints,
    };
  }
);

export const columnDefNameOnly = Parsinator.fromGenerator(function* () {
  const columnName = yield* stringLiteral;

  return {
    type: "columnDef" as const,
    name: columnName,
    columnType: null,
    columnConstraints: null,
  };
});

export const columnDef = Parsinator.choice<
  | InferredResult<typeof columnDefNameTypeAndConstraints>
  | InferredResult<typeof columnDefNameAndConstraints>
  | InferredResult<typeof columnDefNameAndType>
  | InferredResult<typeof columnDefNameOnly>
>([
  columnDefNameTypeAndConstraints,
  columnDefNameAndConstraints,
  columnDefNameAndType,
  columnDefNameOnly,
]);

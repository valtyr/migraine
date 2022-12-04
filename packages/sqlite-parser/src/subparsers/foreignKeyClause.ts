import * as Parsinator from "../parsinator";
import { indexedColumn } from "./indexedColumn";
import { stringLiteral } from "./stringLiteral";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

type ActionType =
  | "setNull"
  | "setDefault"
  | "cascade"
  | "restrict"
  | "noAction";

const setNullAction = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^set/i);
  yield* whitespaceCommentMaybe;
  yield* Parsinator.regex(/^null/i);

  return "setNull" as const;
});

const setDefaultAction = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^set/i);
  yield* whitespaceCommentMaybe;
  yield* Parsinator.regex(/^default/i);

  return "setDefault" as const;
});

const cascadeAction = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^cascade/i);

  return "cascade" as const;
});

const restrictAction = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^restrict/i);

  return "restrict" as const;
});

const noAction = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^no/i);
  yield* whitespaceCommentMaybe;
  yield* Parsinator.regex(/^action/i);

  return "noAction" as const;
});

export const onDeleteClause = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^on/i);
  yield* whitespaceCommentMaybe;
  yield* Parsinator.regex(/^delete/i);
  yield* whitespaceCommentMaybe;

  const action = yield* Parsinator.choice([
    setNullAction,
    setDefaultAction,
    cascadeAction,
    restrictAction,
    noAction,
  ]);

  return ["onDelete" as const, action] as ["onDelete", ActionType];
});

export const onUpdateClause = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^on/i);
  yield* whitespaceCommentMaybe;
  yield* Parsinator.regex(/^update/i);
  yield* whitespaceCommentMaybe;

  const action = yield* Parsinator.choice([
    setNullAction,
    setDefaultAction,
    cascadeAction,
    restrictAction,
    noAction,
  ]);

  return ["onUpdate", action] as ["onUpdate", ActionType];
});

export const foreignKeyClause = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^references/i);

  yield* whitespaceCommentMaybe;

  const tableName = yield* stringLiteral;

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

  const eventActions = yield* Parsinator.sepBy(
    whitespaceComment,
    Parsinator.choice<
      | ["onUpdate", ActionType | undefined]
      | ["onDelete", ActionType | undefined]
    >([onDeleteClause, onUpdateClause])
  );

  const { onUpdate, onDelete } = Object.fromEntries(eventActions);

  // TODO:
  // Missing match clause and deferrable clause
  // https://www.sqlite.org/syntax/foreign-key-clause.html

  return {
    type: "foreignKeyClause" as const,
    tableName,
    indexedColumns,
    onUpdate: onUpdate || null,
    onDelete: onDelete || null,
  };
});

import { runToEnd } from "../parsinator";
import { columnConstraint } from "./columnConstraint";

test("column constraint primary key", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint test1 primary key asc on conflict fail autoincrement"
  );
  expect(parsed).toEqual({
    name: "test1",
    type: "columnConstraint",
    subtype: "primaryKey",
    dir: "asc",
    onConflict: "fail",
    autoincrement: true,
  });
});

test("column constraint primary key desc", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint test1 primary key desc on conflict fail autoincrement"
  );
  expect(parsed).toEqual({
    name: "test1",
    type: "columnConstraint",
    subtype: "primaryKey",
    dir: "desc",
    onConflict: "fail",
    autoincrement: true,
  });
});

test("column constraint primary key null dir", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint test1 primary key on conflict fail autoincrement"
  );
  expect(parsed).toEqual({
    name: "test1",
    type: "columnConstraint",
    subtype: "primaryKey",
    dir: null,
    onConflict: "fail",
    autoincrement: true,
  });
});

test("column constraint not null", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint test2 not null on conflict ignore"
  );
  expect(parsed).toEqual({
    name: "test2",
    type: "columnConstraint",
    subtype: "notNull",
    onConflict: "ignore",
  });
});

test("column constraint unique", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint test3 unique on conflict abort"
  );
  expect(parsed).toEqual({
    name: "test3",
    type: "columnConstraint",
    subtype: "unique",
    onConflict: "abort",
  });
});

test("column constraint default number", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint 'long and boring name' default -1"
  );
  expect(parsed).toEqual({
    name: "long and boring name",
    type: "columnConstraint",
    subtype: "default",
    value: {
      type: "number",
      format: "decimal",
      base: -1,
      exponent: null,
    },
  });
});

test("column constraint default string", () => {
  const parsed = runToEnd(
    columnConstraint,
    "constraint 'long and boring name 2' default 'hullo'"
  );
  expect(parsed).toEqual({
    name: "long and boring name 2",
    type: "columnConstraint",
    subtype: "default",
    value: {
      type: "string",
      value: "hullo",
    },
  });
});

test("column constraint collate", () => {
  const parsed = runToEnd(columnConstraint, "collate blablabla");
  expect(parsed).toEqual({
    name: null,
    type: "columnConstraint",
    subtype: "collate",
    collationName: "blablabla",
  });
});

test("column constraint foreign key clause", () => {
  const parsed = runToEnd(
    columnConstraint,
    "references 'user' ('id', 'name') on delete cascade on update set default"
  );
  expect(parsed).toEqual({
    name: null,
    type: "columnConstraint",
    subtype: "foreignKey",
    foreignKeyClause: {
      type: "foreignKeyClause",
      tableName: "user",
      indexedColumns: [
        {
          collationName: null,
          columnName: "id",
          dir: null,
          type: "indexedColumn",
        },
        {
          collationName: null,
          columnName: "name",
          dir: null,
          type: "indexedColumn",
        },
      ],
      onDelete: "cascade",
      onUpdate: "setDefault",
    },
  });
});

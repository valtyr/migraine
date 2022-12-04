import { runToEnd } from "../parsinator";
import { tableConstraint } from "./tableConstraint";

test("table constraint primary key", () => {
  const parsed = runToEnd(
    tableConstraint,
    "constraint name primary key (id,name) on conflict abort"
  );
  expect(parsed).toEqual({
    name: "name",
    type: "tableConstraint",
    subtype: "primaryKey",
    onConflict: "abort",
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
  });
});

test("table constraint unique", () => {
  const parsed = runToEnd(
    tableConstraint,
    "constraint name unique (id,name) on conflict fail"
  );
  expect(parsed).toEqual({
    name: "name",
    type: "tableConstraint",
    subtype: "unique",
    onConflict: "fail",
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
  });
});

test("table constraint unique", () => {
  const parsed = runToEnd(
    tableConstraint,
    "constraint name foreign key (id,name) references user(id, name) on delete cascade on update set default"
  );
  expect(parsed).toEqual({
    name: "name",
    type: "tableConstraint",
    subtype: "foreignKey",
    columnNames: ["id", "name"],
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

test("table constraint primary key with id (real world)", () => {
  const parsed = runToEnd(
    tableConstraint,
    'CONSTRAINT "Device_pkey" PRIMARY KEY ("id")'
  );
  expect(parsed).toEqual({
    name: "Device_pkey",
    type: "tableConstraint",
    subtype: "primaryKey",
    onConflict: null,
    indexedColumns: [
      {
        collationName: null,
        columnName: "id",
        dir: null,
        type: "indexedColumn",
      },
    ],
  });
});

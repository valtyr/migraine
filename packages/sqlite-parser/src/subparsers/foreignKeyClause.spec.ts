import { runToEnd } from "../parsinator";
import {
  foreignKeyClause,
  onDeleteClause,
  onUpdateClause,
} from "./foreignKeyClause";

test("table single column", () => {
  const parsed = runToEnd(foreignKeyClause, "REFERENCES test (name)");
  expect(parsed).toEqual({
    type: "foreignKeyClause",
    tableName: "test",
    indexedColumns: [
      {
        collationName: null,
        columnName: "name",
        dir: null,
        type: "indexedColumn",
      },
    ],
    onDelete: null,
    onUpdate: null,
  });
});

test("table multiple columns", () => {
  const parsed = runToEnd(foreignKeyClause, "REFERENCES test (name, me)");
  expect(parsed).toEqual({
    type: "foreignKeyClause",
    tableName: "test",
    indexedColumns: [
      {
        collationName: null,
        columnName: "name",
        dir: null,
        type: "indexedColumn",
      },
      {
        collationName: null,
        columnName: "me",
        dir: null,
        type: "indexedColumn",
      },
    ],
    onDelete: null,
    onUpdate: null,
  });
});

test("test with quotes", () => {
  const parsed = runToEnd(foreignKeyClause, 'REFERENCES "User"("id")');
  expect(parsed).toEqual({
    type: "foreignKeyClause",
    tableName: "User",
    indexedColumns: [
      {
        collationName: null,
        columnName: "id",
        dir: null,
        type: "indexedColumn",
      },
    ],
    onDelete: null,
    onUpdate: null,
  });
});

test("table with onDelete", () => {
  const parsed = runToEnd(
    foreignKeyClause,
    'REFERENCES "User"("id") ON DELETE RESTRICT'
  );
  expect(parsed).toEqual({
    type: "foreignKeyClause",
    tableName: "User",
    indexedColumns: [
      {
        collationName: null,
        columnName: "id",
        dir: null,
        type: "indexedColumn",
      },
    ],
    onDelete: "restrict",
    onUpdate: null,
  });
});

test("table with onUpdate and onDelete", () => {
  const parsed = runToEnd(
    foreignKeyClause,
    'REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE'
  );
  expect(parsed).toEqual({
    type: "foreignKeyClause",
    tableName: "User",
    indexedColumns: [
      {
        collationName: null,
        columnName: "id",
        dir: null,
        type: "indexedColumn",
      },
    ],
    onDelete: "restrict",
    onUpdate: "cascade",
  });
});

test("onUpdate clause", () => {
  const parsed = runToEnd(onUpdateClause, "ON UPDATE SET NULL");
  expect(parsed).toEqual(["onUpdate", "setNull"]);
});

test("onDelete clause", () => {
  const parsed = runToEnd(onDeleteClause, "ON DELETE CASCADE");
  expect(parsed).toEqual(["onDelete", "cascade"]);
});

test("onDelete set default clause", () => {
  const parsed = runToEnd(onDeleteClause, "ON DELETE set default");
  expect(parsed).toEqual(["onDelete", "setDefault"]);
});

test("onUpdate restrict clause", () => {
  const parsed = runToEnd(onUpdateClause, "ON Update restrict");
  expect(parsed).toEqual(["onUpdate", "restrict"]);
});

test("onDelete no action clause", () => {
  const parsed = runToEnd(onDeleteClause, "ON delete no Action");
  expect(parsed).toEqual(["onDelete", "noAction"]);
});

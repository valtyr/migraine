import { runToEnd } from "../parsinator";
import { createIndexStatement } from "./createIndexStatement";

test("create table simple", () => {
  const parsed = runToEnd(
    createIndexStatement,
    "create unique index indx_email on emp (email)"
  );
  expect(parsed).toEqual({
    type: "createIndex",
    unique: true,
    tableName: "emp",
    schema: null,
    indexedColumns: [
      {
        collationName: null,
        columnName: "email",
        dir: null,
        type: "indexedColumn",
      },
    ],
    ifNotExists: false,
    name: "indx_email",
  });
});

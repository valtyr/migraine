import { runToEnd } from "../parsinator";
import { indexedColumn } from "./indexedColumn";

test("indexed column with collation and dir", () => {
  const parsed = runToEnd(indexedColumn, "id collate test asc");
  expect(parsed).toEqual({
    collationName: "test",
    columnName: "id",
    dir: "asc",
    type: "indexedColumn",
  });
});

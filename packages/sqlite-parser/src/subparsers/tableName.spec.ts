import { runToEnd } from "../parsinator";
import { tableName } from "./tableName";

test("table name without schema", () => {
  const parsed = runToEnd(tableName, "test");
  expect(parsed).toEqual({ schema: null, name: "test" });
});

test("table name with schema", () => {
  const parsed = runToEnd(tableName, "test.lol");
  expect(parsed).toEqual({ schema: "test", name: "lol" });
});

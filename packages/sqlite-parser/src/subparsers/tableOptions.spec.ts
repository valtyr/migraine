import { runToEnd } from "../parsinator";
import { tableOptions } from "./tableOptions";

test("one", () => {
  const parsed = runToEnd(tableOptions, "without rowid");
  expect(parsed).toEqual({ withoutRowId: true, strict: null });
});

test("both", () => {
  const parsed = runToEnd(tableOptions, "without rowid, strict");
  expect(parsed).toEqual({ withoutRowId: true, strict: true });
});

test("the other", () => {
  const parsed = runToEnd(tableOptions, "strict");
  expect(parsed).toEqual({ withoutRowId: null, strict: true });
});

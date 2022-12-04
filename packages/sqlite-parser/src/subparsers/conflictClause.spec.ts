import { runToEnd } from "../parsinator";
import { conflictClause } from "./conflictClause";

test("conflict clause rollback", () => {
  const parsed = runToEnd(conflictClause, "on conflict rollback");
  expect(parsed).toEqual("rollback");
});

test("conflict clause abort", () => {
  const parsed = runToEnd(conflictClause, "on conflict abort");
  expect(parsed).toEqual("abort");
});

test("conflict clause fail", () => {
  const parsed = runToEnd(conflictClause, "on conflict fail");
  expect(parsed).toEqual("fail");
});

test("conflict clause ignore", () => {
  const parsed = runToEnd(conflictClause, "on conflict ignore");
  expect(parsed).toEqual("ignore");
});

test("conflict clause replace", () => {
  const parsed = runToEnd(conflictClause, "on conflict replace");
  expect(parsed).toEqual("replace");
});

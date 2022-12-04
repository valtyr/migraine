import { runToEnd } from "../parsinator";
import { constraintName } from "./constraintName";

test("constraint name", () => {
  const parsed = runToEnd(
    constraintName,
    "constraint 'valtýrs test constraint 1000'"
  );
  expect(parsed).toEqual("valtýrs test constraint 1000");
});

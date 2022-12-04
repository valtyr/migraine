import { booleanLiteral } from "./booleanLiteral";
import { runToEnd } from "../parsinator";

test("booleanLiteral true", () => {
  const parsed = runToEnd(booleanLiteral, "TRUE");
  expect(parsed).toEqual({
    type: "boolean",
    value: true,
  });
});

test("booleanLiteral false", () => {
  const parsed = runToEnd(booleanLiteral, "FALSE");
  expect(parsed).toEqual({
    type: "boolean",
    value: false,
  });
});

import { runToEnd } from "../parsinator";
import { literalValue } from "./literalValue";

test("literalValue numeric", () => {
  const parsed = runToEnd(literalValue, "0.344");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.344,
    exponent: null,
  });
});

test("literalValue string", () => {
  const parsed = runToEnd(literalValue, "'hello!'");
  expect(parsed).toEqual({
    type: "string",
    value: "hello!",
  });
});

test("literalValue string", () => {
  const parsed = runToEnd(literalValue, "'hello!'");
  expect(parsed).toEqual({
    type: "string",
    value: "hello!",
  });
});

test("literalValue null", () => {
  const parsed = runToEnd(literalValue, "null");
  expect(parsed).toEqual({
    type: "null",
  });
});

test("literalValue boolean true", () => {
  const parsed = runToEnd(literalValue, "true");
  expect(parsed).toEqual({
    type: "boolean",
    value: true,
  });
});

test("literalValue boolean false", () => {
  const parsed = runToEnd(literalValue, "false");
  expect(parsed).toEqual({
    type: "boolean",
    value: false,
  });
});

test("literalValue current time", () => {
  const parsed = runToEnd(literalValue, "current_time");
  expect(parsed).toEqual({
    type: "currentTime",
  });
});

test("literalValue current date", () => {
  const parsed = runToEnd(literalValue, "current_date");
  expect(parsed).toEqual({
    type: "currentDate",
  });
});

test("literalValue current timestamp", () => {
  const parsed = runToEnd(literalValue, "current_timestamp");
  expect(parsed).toEqual({
    type: "currentTimestamp",
  });
});

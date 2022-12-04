import { stringLiteral } from "./stringLiteral";
import { runToEnd } from "../parsinator";

test("Quoted", () => {
  const parsed = runToEnd(stringLiteral, '"Hello"');
  expect(parsed).toEqual("Hello");
});

test("Unquoted", () => {
  const parsed = runToEnd(stringLiteral, "Hello");
  expect(parsed).toEqual("Hello");
});

test("Single quoted", () => {
  const parsed = runToEnd(stringLiteral, "'Hello'");
  expect(parsed).toEqual("Hello");
});

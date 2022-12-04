import {
  numericLiteralDecimalVariationOne,
  numericLiteralDecimalVariationTwo,
  numericLiteralHex,
} from "./numericLiteral";
import { runToEnd } from "../parsinator";

test("numericLiteralDecimalVariationOne", () => {
  const parsed = runToEnd(numericLiteralDecimalVariationOne, "0.344");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.344,
    exponent: null,
  });
});

test("numericLiteralDecimalVariationOne with exponent", () => {
  const parsed = runToEnd(numericLiteralDecimalVariationOne, "0.3e4");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 4,
  });
});

test("numericLiteralDecimalVariationTwo", () => {
  const parsed = runToEnd(numericLiteralDecimalVariationTwo, ".3");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: null,
  });
});

test("numericLiteralDecimalVariationTwo with exponent", () => {
  const parsed = runToEnd(numericLiteralDecimalVariationTwo, ".3E20");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 20,
  });
});

test("numericLiteralHexadecimal basic", () => {
  const parsed = runToEnd(numericLiteralHex, "0xFF");
  expect(parsed).toEqual({
    type: "number",
    format: "hexadecimal",
    base: 255,
    exponent: null,
  });
});

test("numericLiteralHexadecimal twos complement overflow", () => {
  const parsed = runToEnd(numericLiteralHex, "0x8000000000000000");
  expect(parsed).toEqual({
    type: "number",
    format: "hexadecimal",
    base: -9223372036854775808,
    exponent: null,
  });
});

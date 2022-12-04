import { signedNumber } from "./signedNumber";
import { runToEnd } from "../parsinator";

test("negative numericLiteralDecimalVariationOne", () => {
  const parsed = runToEnd(signedNumber, "-0.344");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: -0.344,
    exponent: null,
  });
});

test("negative numericLiteralDecimalVariationOne with exponent", () => {
  const parsed = runToEnd(signedNumber, "-0.3e4");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: -0.3,
    exponent: 4,
  });
});

test("negative numericLiteralDecimalVariationTwo", () => {
  const parsed = runToEnd(signedNumber, "-.3");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: -0.3,
    exponent: null,
  });
});

test("negative numericLiteralDecimalVariationTwo with exponent", () => {
  const parsed = runToEnd(signedNumber, "-.3E20");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: -0.3,
    exponent: 20,
  });
});

test("negative numericLiteralHexadecimal basic", () => {
  const parsed = runToEnd(signedNumber, "-0xFF");
  expect(parsed).toEqual({
    type: "number",
    format: "hexadecimal",
    base: -255,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationOne", () => {
  const parsed = runToEnd(signedNumber, "+0.344");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.344,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationOne with exponent", () => {
  const parsed = runToEnd(signedNumber, "+0.3e4");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 4,
  });
});

test("positive numericLiteralDecimalVariationTwo", () => {
  const parsed = runToEnd(signedNumber, "+.3");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationTwo with exponent", () => {
  const parsed = runToEnd(signedNumber, "+.3E20");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 20,
  });
});

test("positive numericLiteralHexadecimal basic", () => {
  const parsed = runToEnd(signedNumber, "+0xFF");
  expect(parsed).toEqual({
    type: "number",
    format: "hexadecimal",
    base: 255,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationOne with no sign", () => {
  const parsed = runToEnd(signedNumber, "0.344");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.344,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationOne with exponent with no sign", () => {
  const parsed = runToEnd(signedNumber, "0.3e4");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 4,
  });
});

test("positive numericLiteralDecimalVariationTwo with no sign", () => {
  const parsed = runToEnd(signedNumber, ".3");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: null,
  });
});

test("positive numericLiteralDecimalVariationTwo with exponent with no sign", () => {
  const parsed = runToEnd(signedNumber, ".3E20");
  expect(parsed).toEqual({
    type: "number",
    format: "decimal",
    base: 0.3,
    exponent: 20,
  });
});

test("positive numericLiteralHexadecimal basic with no sign", () => {
  const parsed = runToEnd(signedNumber, "0xFF");
  expect(parsed).toEqual({
    type: "number",
    format: "hexadecimal",
    base: 255,
    exponent: null,
  });
});

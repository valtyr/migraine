import * as Parsinator from "../parsinator";

const exponent = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regexMatch(/e/i);
  const number = yield* Parsinator.regex(/(\+|-)?[0-9]+/i);

  return Number(number);
});

export const numericLiteralDecimalVariationOne = Parsinator.fromGenerator(
  function* () {
    const number = yield* Parsinator.regex(/[0-9]+(\.[0-9]+)?/);

    return {
      type: "number" as const,
      format: "decimal" as const,
      base: Number(number),
      exponent: yield* Parsinator.maybe(exponent),
    };
  }
);

export const numericLiteralDecimalVariationTwo = Parsinator.fromGenerator(
  function* () {
    const number = yield* Parsinator.regex(/\.[0-9]+/);

    return {
      type: "number" as const,
      format: "decimal" as const,
      base: Number(number),
      exponent: yield* Parsinator.maybe(exponent),
    };
  }
);

export const numericLiteralHex = Parsinator.fromGenerator(function* () {
  const number = yield* Parsinator.regex(/0x[0-9A-F]+/i);

  // Get proper 64 bit signed int behavior as defined in
  // https://www.sqlite.org/lang_expr.html section 3

  const arrayBuffer = new ArrayBuffer(8);
  const view = new DataView(arrayBuffer);
  view.setBigUint64(0, BigInt(number));

  return {
    type: "number" as const,
    format: "hexadecimal" as const,
    base: Number(view.getBigInt64(0)),
    exponent: null,
  };
});

export const numericLiteral = Parsinator.choice<{
  type: "number";
  format: "decimal" | "hexadecimal";
  base: number;
  exponent: number | null;
}>([
  numericLiteralHex,
  numericLiteralDecimalVariationOne,
  numericLiteralDecimalVariationTwo,
]);

import * as Parsinator from "../parsinator";
import { numericLiteral } from "./numericLiteral";

export const signedNumber = Parsinator.fromGenerator(function* () {
  const sign =
    (yield* Parsinator.maybe(
      Parsinator.choice([Parsinator.str("+"), Parsinator.str("-")])
    )) || "+";
  const number = yield* numericLiteral;

  const multiplicand = sign === "+" ? 1 : -1;

  return {
    ...number,
    base: number.base * multiplicand,
  };
});

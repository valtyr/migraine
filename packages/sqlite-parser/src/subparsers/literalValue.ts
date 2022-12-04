import * as Parsinator from "../parsinator";
import { InferredResult } from "../util";
import { booleanLiteral } from "./booleanLiteral";
import { numericLiteral } from "./numericLiteral";
import { stringLiteral } from "./stringLiteral";

const stringLiteralValue = Parsinator.fromGenerator(function* () {
  const value = yield* stringLiteral;
  return { type: "string" as const, value };
});

const nullLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^null/i);
  return { type: "null" as const };
});

const currentDateLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^current_date/i);
  return { type: "currentDate" as const };
});

const currentTimeLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^current_time/i);
  return { type: "currentTime" as const };
});

const currentTimestampLiteral = Parsinator.fromGenerator(function* () {
  yield* Parsinator.regex(/^current_timestamp/i);
  return { type: "currentTimestamp" as const };
});

// TODO:
// Missing blob

export const literalValue = Parsinator.choice<
  | InferredResult<typeof stringLiteralValue>
  | InferredResult<typeof numericLiteral>
  | InferredResult<typeof booleanLiteral>
  | InferredResult<typeof nullLiteral>
  | InferredResult<typeof currentDateLiteral>
  | InferredResult<typeof currentTimeLiteral>
  | InferredResult<typeof currentTimestampLiteral>
>([
  numericLiteral,
  booleanLiteral,
  nullLiteral,
  currentDateLiteral,
  currentTimestampLiteral,
  currentTimeLiteral,
  stringLiteralValue,
]);

import * as Parsinator from "../parsinator";
import { signedNumber } from "./signedNumber";
import { unquotedString } from "./stringLiteral";
import { whitespaceCommentMaybe } from "./whitespaceCommentMaybe";

const secondArgument = Parsinator.fromGenerator(function* () {
  yield* Parsinator.str(",");

  yield* whitespaceCommentMaybe;

  return yield* signedNumber;
});

const typeArguments = Parsinator.fromGenerator(function* () {
  yield* whitespaceCommentMaybe;

  yield* Parsinator.str("(");

  yield* whitespaceCommentMaybe;

  const first = yield* signedNumber;

  yield* whitespaceCommentMaybe;

  const second = yield* Parsinator.maybe(secondArgument);

  yield* whitespaceCommentMaybe;

  yield* Parsinator.str(")");

  return { first, second };
});

export const typeName = Parsinator.fromGenerator(function* () {
  const name = yield* unquotedString;

  const args = yield* Parsinator.maybe(typeArguments);

  return {
    type: "typename" as const,
    name,
    args,
  };
});

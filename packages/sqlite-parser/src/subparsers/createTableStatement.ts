import * as Parsinator from "../parsinator";
import { InferredResult } from "../util";
import { columnDef } from "./columnDef";
import { constraintName } from "./constraintName";
import { tableConstraint } from "./tableConstraint";
import { tableName } from "./tableName";
import { tableOptions } from "./tableOptions";
import {
  whitespaceComment,
  whitespaceCommentMaybe,
} from "./whitespaceCommentMaybe";

// export const columnDefinitionsAndTableConstraints = Parsinator.fromGenerator(
//   function* () {
//     const columnDefinitions = yield* Parsinator.sepBy1(
//       Parsinator.sequence<any>([
//         whitespaceCommentMaybe,
//         Parsinator.str(","),
//         whitespaceCommentMaybe,
//       ]),
//       columnDef
//     );

//     yield* whitespaceCommentMaybe;

//     let tableConstraints = yield* Parsinator.maybe(
//       Parsinator.fromGenerator(function* () {
//         yield* Parsinator.str(",");
//         yield* whitespaceCommentMaybe;

//         const constraints = yield* Parsinator.sepBy1(
//           Parsinator.sequence<any>([
//             whitespaceCommentMaybe,
//             Parsinator.str(","),
//             whitespaceCommentMaybe,
//           ]),
//           tableConstraint
//         );

//         return constraints;
//       })
//     );

//     return { columnDefinitions, tableConstraints };
//   }
// );

export const columnDefinitionsAndTableConstraints = Parsinator.fromGenerator(
  function* () {
    yield* whitespaceCommentMaybe;

    const items = yield* Parsinator.sepBy1(
      Parsinator.sequence<any>([
        whitespaceCommentMaybe,
        Parsinator.str(","),
        whitespaceCommentMaybe,
      ]),
      Parsinator.choice<
        | InferredResult<typeof tableConstraint>
        | InferredResult<typeof columnDef>
      >([tableConstraint, columnDef])
    );

    const columnDefinitions = items.filter(
      (i): i is InferredResult<typeof columnDef> => i.type === "columnDef"
    );
    const tableConstraints = items.filter(
      (i): i is InferredResult<typeof tableConstraint> =>
        i.type === "tableConstraint"
    );

    // yield* whitespaceCommentMaybe;

    // let tableConstraints = yield* Parsinator.maybe(
    //   Parsinator.fromGenerator(function* () {
    //     yield* Parsinator.str(",");
    //     yield* whitespaceCommentMaybe;

    //     const constraints = yield* Parsinator.sepBy1(
    //       Parsinator.sequence<any>([
    //         whitespaceCommentMaybe,
    //         Parsinator.str(","),
    //         whitespaceCommentMaybe,
    //       ]),
    //       tableConstraint
    //     );

    //     return constraints;
    //   })
    // );

    return { columnDefinitions, tableConstraints };
  }
);

export const createTableStatement = Parsinator.fromGenerator(function* () {
  yield* whitespaceCommentMaybe;

  yield* Parsinator.regex(/^create/i);
  yield* whitespaceComment;

  const temporary = !!(yield* Parsinator.maybe(
    Parsinator.choice([
      Parsinator.regex(/^temporary/i),
      Parsinator.regex(/^temp/i),
    ])
  ));

  if (temporary) {
    yield* whitespaceComment;
  }

  yield* Parsinator.regex(/^table/i);
  yield* whitespaceComment;

  const ifNotExists = !!(yield* Parsinator.maybe(
    Parsinator.sequence<any>([
      Parsinator.regex(/^if/i),
      whitespaceComment,
      Parsinator.regex(/^not/i),
      whitespaceComment,
      Parsinator.regex(/^exists/i),
      whitespaceComment,
    ])
  ));

  const { schema, name } = yield* tableName;

  yield* whitespaceCommentMaybe;

  // AS clause missing... doesn't really make sense for schema parsing, at least for now...

  const { columnDefinitions, tableConstraints } = yield* Parsinator.surround(
    Parsinator.sequence<any>([Parsinator.str("("), whitespaceCommentMaybe]),
    columnDefinitionsAndTableConstraints,
    Parsinator.sequence<any>([whitespaceCommentMaybe, Parsinator.str(")")])
  );

  // const { columnDefinitions, tableConstraints } =
  //   yield* columnDefinitionsAndTableConstraints;

  yield* whitespaceCommentMaybe;

  const tableOptionsClause = yield* Parsinator.maybe(tableOptions);

  yield* whitespaceCommentMaybe;

  return {
    type: "createTable",
    schema,
    name,
    temporary,
    ifNotExists,
    columnDefinitions,
    tableConstraints,
    tableOptions: tableOptionsClause,
  };
});

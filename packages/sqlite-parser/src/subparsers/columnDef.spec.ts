import { runToEnd } from "../parsinator";
import {
  columnDef,
  columnDefNameAndConstraints,
  columnDefNameTypeAndConstraints,
} from "./columnDef";

test("just name", () => {
  const parsed = runToEnd(columnDef, "id");
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: null,
    columnConstraints: null,
  });
});

test("just name and type", () => {
  const parsed = runToEnd(columnDef, "id int");
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: {
      args: null,
      name: "int",
      type: "typename",
    },
    columnConstraints: null,
  });
});

test("just name and constraint", () => {
  const parsed = runToEnd(columnDef, "id not null");
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: null,
    columnConstraints: [
      {
        name: null,
        onConflict: null,
        subtype: "notNull",
        type: "columnConstraint",
      },
    ],
  });
});

test("name type and constraint - combined parser", () => {
  const parsed = runToEnd(columnDef, "id datetime default 1.0");
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: {
      args: null,
      name: "datetime",
      type: "typename",
    },
    columnConstraints: [
      {
        name: null,
        subtype: "default",
        type: "columnConstraint",
        value: {
          base: 1,
          exponent: null,
          format: "decimal",
          type: "number",
        },
      },
    ],
  });
});

test("name type and constraint - single parser", () => {
  const parsed = runToEnd(
    columnDefNameTypeAndConstraints,
    "id TIMESTAMP(3) default current_date"
  );
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: {
      type: "typename",
      args: {
        first: {
          base: 3,
          exponent: null,
          format: "decimal",
          type: "number",
        },
        second: null,
      },
      name: "TIMESTAMP",
    },
    columnConstraints: [
      {
        name: null,
        subtype: "default",
        type: "columnConstraint",
        value: {
          type: "currentDate",
        },
      },
    ],
  });
});

test("name type and multiple constraints (real life example)", () => {
  const parsed = runToEnd(
    columnDef,
    '"lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP'
  );
  expect(parsed).toEqual({
    type: "columnDef",
    name: "lastActive",
    columnType: {
      args: {
        first: { type: "number", base: 3, exponent: null, format: "decimal" },
        second: null,
      },
      name: "TIMESTAMP",
      type: "typename",
    },
    columnConstraints: [
      {
        name: null,
        subtype: "notNull",
        onConflict: null,
        type: "columnConstraint",
      },
      {
        name: null,
        subtype: "default",
        type: "columnConstraint",
        value: {
          type: "currentTimestamp",
        },
      },
    ],
  });
});

test("weird spacing", () => {
  const parsed = runToEnd(columnDef, '"id" TEXT NOT NULL');
  expect(parsed).toEqual({
    type: "columnDef",
    name: "id",
    columnType: {
      args: null,
      name: "TEXT",
      type: "typename",
    },
    columnConstraints: [
      {
        name: null,
        subtype: "notNull",
        onConflict: null,
        type: "columnConstraint",
      },
    ],
  });
});

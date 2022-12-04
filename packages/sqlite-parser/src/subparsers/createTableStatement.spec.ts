import { runToEnd } from "../parsinator";
import { sql } from "../util";
import {
  columnDefinitionsAndTableConstraints,
  createTableStatement,
} from "./createTableStatement";

test("create table simple", () => {
  const parsed = runToEnd(
    createTableStatement,
    "create temp table user (id int primary key autoincrement, name string not null, pronouns string default 'they/them') strict"
  );
  expect(parsed).toEqual({
    type: "createTable",
    columnDefinitions: [
      {
        type: "columnDef",
        name: "id",
        columnType: { args: null, name: "int", type: "typename" },
        columnConstraints: [
          {
            autoincrement: true,
            dir: null,
            name: null,
            onConflict: null,
            subtype: "primaryKey",
            type: "columnConstraint",
          },
        ],
      },
      {
        type: "columnDef",
        name: "name",
        columnType: { args: null, name: "string", type: "typename" },
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
      },
      {
        type: "columnDef",
        name: "pronouns",
        columnType: { args: null, name: "string", type: "typename" },
        columnConstraints: [
          {
            name: null,
            subtype: "default",
            type: "columnConstraint",
            value: { type: "string", value: "they/them" },
          },
        ],
      },
    ],
    ifNotExists: false,
    name: "user",
    schema: null,
    tableConstraints: [],
    tableOptions: { strict: true, withoutRowId: null },
    temporary: true,
  });
});

test("create table simple", () => {
  const parsed = runToEnd(
    createTableStatement,
    "create temp table user (id int primary key autoincrement, name string not null, pronouns string default 'they/them') strict"
  );
  expect(parsed).toEqual({
    type: "createTable",
    columnDefinitions: [
      {
        type: "columnDef",
        name: "id",
        columnType: { args: null, name: "int", type: "typename" },
        columnConstraints: [
          {
            autoincrement: true,
            dir: null,
            name: null,
            onConflict: null,
            subtype: "primaryKey",
            type: "columnConstraint",
          },
        ],
      },
      {
        type: "columnDef",
        name: "name",
        columnType: { args: null, name: "string", type: "typename" },
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
      },
      {
        type: "columnDef",
        name: "pronouns",
        columnType: { args: null, name: "string", type: "typename" },
        columnConstraints: [
          {
            name: null,
            subtype: "default",
            type: "columnConstraint",
            value: { type: "string", value: "they/them" },
          },
        ],
      },
    ],
    ifNotExists: false,
    name: "user",
    schema: null,
    tableConstraints: [],
    tableOptions: { strict: true, withoutRowId: null },
    temporary: true,
  });
});

test("create table complex", () => {
  const parsed = runToEnd(
    createTableStatement,
    sql`CREATE TABLE "Device" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "os" TEXT NOT NULL,
      "deviceType" TEXT NOT NULL,
      "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "pushToken" TEXT,
      "shouldBeNotified" BOOLEAN NOT NULL DEFAULT true,
      CONSTRAINT "Device_pkey" PRIMARY KEY ("id"))`
  );
  expect(parsed).toEqual({
    columnDefinitions: [
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
        columnType: { args: null, name: "TEXT", type: "typename" },
        name: "id",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
        columnType: { args: null, name: "TEXT", type: "typename" },
        name: "userId",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
        columnType: { args: null, name: "TEXT", type: "typename" },
        name: "os",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
        ],
        columnType: { args: null, name: "TEXT", type: "typename" },
        name: "deviceType",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
          {
            name: null,
            subtype: "default",
            type: "columnConstraint",
            value: { type: "currentTimestamp" },
          },
        ],
        columnType: {
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
          type: "typename",
        },
        name: "lastActive",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
          {
            name: null,
            subtype: "default",
            type: "columnConstraint",
            value: { type: "currentTimestamp" },
          },
        ],
        columnType: {
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
          type: "typename",
        },
        name: "addedAt",
        type: "columnDef",
      },
      {
        columnConstraints: null,
        columnType: { args: null, name: "TEXT", type: "typename" },
        name: "pushToken",
        type: "columnDef",
      },
      {
        columnConstraints: [
          {
            name: null,
            onConflict: null,
            subtype: "notNull",
            type: "columnConstraint",
          },
          {
            name: null,
            subtype: "default",
            type: "columnConstraint",
            value: { type: "boolean", value: true },
          },
        ],
        columnType: { args: null, name: "BOOLEAN", type: "typename" },
        name: "shouldBeNotified",
        type: "columnDef",
      },
    ],
    ifNotExists: false,
    name: "Device",
    schema: null,
    tableConstraints: [
      {
        indexedColumns: [
          {
            collationName: null,
            columnName: "id",
            dir: null,
            type: "indexedColumn",
          },
        ],
        name: "Device_pkey",
        onConflict: null,
        subtype: "primaryKey",
        type: "tableConstraint",
      },
    ],
    tableOptions: null,
    temporary: false,
    type: "createTable",
  });
});

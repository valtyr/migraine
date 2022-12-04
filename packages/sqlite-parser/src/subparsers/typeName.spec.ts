import { runToEnd } from "../parsinator";
import { typeName } from "./typeName";

test("typename without arguments", () => {
  const parsed = runToEnd(typeName, "DATETIME");
  expect(parsed).toEqual({ type: "typename", name: "DATETIME", args: null });
});

test("typename with single argument", () => {
  const parsed = runToEnd(typeName, "INT(+1.0)");
  expect(parsed).toEqual({
    type: "typename",
    name: "INT",
    args: {
      first: { type: "number", base: 1, format: "decimal", exponent: null },
      second: null,
    },
  });
});

test("typename with two arguments", () => {
  const parsed = runToEnd(typeName, "INT(+1.0, -0xF)");
  expect(parsed).toEqual({
    type: "typename",
    name: "INT",
    args: {
      first: { type: "number", base: 1, format: "decimal", exponent: null },
      second: {
        type: "number",
        base: -15,
        format: "hexadecimal",
        exponent: null,
      },
    },
  });
});

test("typename with stupid comments and spaces", () => {
  const parsed = runToEnd(
    typeName,
    "INT /* some comment */ ( /* some comment */   +1.0,  /* some comment */  -0xF /* some comment */)"
  );
  expect(parsed).toEqual({
    type: "typename",
    name: "INT",
    args: {
      first: { type: "number", base: 1, format: "decimal", exponent: null },
      second: {
        type: "number",
        base: -15,
        format: "hexadecimal",
        exponent: null,
      },
    },
  });
});

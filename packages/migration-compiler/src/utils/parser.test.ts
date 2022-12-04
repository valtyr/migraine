import { parse } from "yieldparser";
import { CreateTableStatement } from "./parser";

describe("CreateTableStatement", () => {
  test("One", () => {
    const test = parse("Create temp table", CreateTableStatement());
  });
});

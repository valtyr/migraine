import { comment } from "./comment";
import { runToEnd } from "../parsinator";

test("sqlite style comment", () => {
  const parsed = runToEnd(comment, "--test this is a comment\n");
  expect(parsed).toEqual({
    type: "comment",
    value: "test this is a comment",
  });
});

test("c style comment", () => {
  const parsed = runToEnd(comment, "/* test this is a comment */");
  expect(parsed).toEqual({
    type: "comment",
    value: " test this is a comment ",
  });
});

test("c style comment eof", () => {
  const parsed = runToEnd(comment, "/* test this is a comment ");
  expect(parsed).toEqual({
    type: "comment",
    value: " test this is a comment ",
  });
});

test("c style comment multiline", () => {
  const parsed = runToEnd(comment, "/* test this \n is a \n comment */");
  expect(parsed).toEqual({
    type: "comment",
    value: " test this \n is a \n comment ",
  });
});

test("sqlite style comment eof", () => {
  const parsed = runToEnd(comment, "--test this is a comment");
  expect(parsed).toEqual({
    type: "comment",
    value: "test this is a comment",
  });
});

import parser from "./index";

test("Parse something!", () => {
  // Parse something!
  parser.feed("foo\n");

  // parser.results is an array of possible parsings.
  expect(parser.results).toStrictEqual([[[[["foo"], "\n"]]]]);
});

import nearley from "nearley";
import grammar from "./grammar";

describe("Basic Parsing", () => {
  const baseTest = "foo\n";
  var parser = null;

  beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(baseTest);
  });

  it("should be unambiguous", () => {
    expect(parser.results).toHaveLength(1);
  });

  it("parses correctly", () => {
    expect(parser.results[0]).toStrictEqual([[[["foo"], "\n"]]]);
  });
});

import nearley from "nearley";
import date_string_grammar from "./grammars/date_string_parser.js";

// Create a Parser object from our grammar.
function parse_date(string) {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(date_string_grammar)
  );
  parser.feed(string);
  let results = parser.results[0];
  results.debug_string = "v.0.1.1";
  return results;
}

export { parse_date };

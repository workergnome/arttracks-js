import nearley from "nearley";
import date_string_grammar from "./grammars/date_string_parser.js";

// Create a Parser object from our grammar.
function parse_date(string) {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(date_string_grammar)
  );
  let results = null;
  try {
    parser.feed(string);
    results = parser.results[0];
  } catch (e) {
    results = {
      error: {
        name: e.name,
        message: e.message,
        offset: e.offset,
        token: e.token
      }
    };
  }
  if (results) {
    results.debug_string = "v.0.1.1";
  }
  return results;
}

export { parse_date };

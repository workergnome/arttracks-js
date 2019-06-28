import nearley from "nearley";
import date_string_grammar from "./grammars/date_string_parser.js";
import DateHelpers from "./date_helpers.js";

// Create a Parser object from our grammar.
function parse_date(string) {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(date_string_grammar)
  );
  let results = null;
  try {
    parser.feed(string);
    const base_results = parser.results[0];
    if (base_results) {
      results = {
        edtf: base_results,
        iso8061: DateHelpers.createIsoDates(base_results)
      };
    }
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
    results.meta = {};
    results.meta.version = "v.0.1.2";
  }
  return results;
}

export { parse_date };

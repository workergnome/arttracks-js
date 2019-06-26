import nearley from "nearley";
import date_grammar from "./parsers/date_parser.js";

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(date_grammar));

exports = parser;

parser.feed("July 1, 2018");
console.log(parser.results);

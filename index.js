import * as nearley from "nearley";
import * as grammar from "./grammar";

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

module.exports = parser;

import nearley from "nearley";
import grammar from "./grammar";

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

exports = parser;

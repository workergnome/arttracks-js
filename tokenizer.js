import moo from "moo";

let lexer = moo.compile({
  WS: /[ \t]+/,
  comma: ",",
  period: ".",
  number: { match: /0|[1-9][0-9]*/, value: s => Number(s) },
  string: /[\p{Alphabetic}-]+/u,
  lparen: "(",
  rparen: ")",
  qmark: "?",
  NL: { match: /\n/, lineBreaks: true }
});

export default lexer;

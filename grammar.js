// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "date", "symbols": ["decade"], "postprocess": id},
    {"name": "date", "symbols": ["year"], "postprocess": id},
    {"name": "decade$ebnf$1$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade$ebnf$1", "symbols": ["decade$ebnf$1$string$1"], "postprocess": id},
    {"name": "decade$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "decade$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "decade$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade", "symbols": ["decade$ebnf$1", "decade_year", "_", "decade$ebnf$2", "decade$ebnf$3"], "postprocess":  (d) => ({
        decade:      d[1],  
        era:       d[3], 
        certainty: d[4] !== "?", all: d})  },
    {"name": "year$ebnf$1", "symbols": ["era"], "postprocess": id},
    {"name": "year$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "year$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "year$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "year", "symbols": ["year_year", "_", "year$ebnf$1", "year$ebnf$2"], "postprocess":  (d) => ({
        year:      d[0][0].v,  
        era:       d[2], 
        certainty: d[3] !== "?"}) 
                                                },
    {"name": "decade_year$string$1", "symbols": [{"literal":"0"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade_year", "symbols": ["int", "decade_year$string$1"], "postprocess": (d) => (d[0].v + "0")},
    {"name": "year_year", "symbols": ["int"]},
    {"name": "era$subexpression$1", "symbols": [/[cC]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era", "symbols": ["era$subexpression$1"], "postprocess": id},
    {"name": "era$subexpression$2", "symbols": [/[bB]/, /[cC]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era", "symbols": ["era$subexpression$2"], "postprocess": id},
    {"name": "era$subexpression$3", "symbols": [/[bB]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era", "symbols": ["era$subexpression$3"], "postprocess": id},
    {"name": "era$subexpression$4", "symbols": [/[aA]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era", "symbols": ["era$subexpression$4"], "postprocess": id},
    {"name": "certainty", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": (d)=> ({v:d[0].join("")})},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null}
]
  , ParserStart: ""
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

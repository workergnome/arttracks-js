// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

/**
 * Given a era string, convert it to canonical form: either CE or BCE.
 * Will by default assume untagged dates are CE.  It will also assume that a
 * minus sign means "BCE".
 *   
 * @param  {?string} era An era string
 * @return {string}      A normalized era string
 */
function normalizeEra(era) {
  if (!era) {
    return "CE";
  }
  else if (era == "-") {
    return "BCE"
  }
  return era ? era.toUpperCase().replace(/BC$/, "BCE").replace("AD", "CE"): "";
}

/**
 * Given a century number, convert it into the numerical representation of the 
 * first year of that century.  
 * 
 * For example, for the fifteenth century CE, this will convert 15 into 1400.
 * For the second century BCE, it would convert 2 into 200.
 * 
 * @param  {number} century The ordinal number of the century
 * @param  {string} era     Either "CE" or "BCE"
 * @return {number}         The first year of that century
 */
function normalizeCentury(century, era) {
  if (era === "CE") {
    return (century - 1)*100;
  } else {
    return century*100;
  }
}

/**
 * Given a year, return a normalized year.  
 * 
 * Currently a no-op, but called out in case we 
 * need to process them at some point.
 * 
 * @param  {number} d The year value
 * @return {number}   The year value
 */
function normalizeYear(d) {
  if (typeof d != "number") {
    throw `Year is not a number: "${d}" is a ${typeof d}`
  }
  return d
}

/**
 * Given a month value, return a the number of the month (1-12).
 *
 * It can accept numbers, month names, or month abbreviations.
 * 
 * @param  {(?string|?number)} d The month value
 * @return {?number}              The numeric value of the month or null
 */
function normalizeMonth(d) {
  if (typeof(d) === "number") {
    return d
  }
  if (typeof(d) === "string") {
    switch(d.substring(0,3).toLowerCase()) {
      case "jan": return 1; 
      case "feb": return 2; 
      case "mar": return 3; 
      case "apr": return 4; 
      case "may": return 5; 
      case "jun": return 6; 
      case "jul": return 7; 
      case "aug": return 8; 
      case "sep": return 9; 
      case "oct": return 10;
      case "nov": return 11;
      case "dec": return 12;
    } 
  }
  return null
}


function constructCentury(d) {
  let era = normalizeEra(d[4]);
  let century = normalizeCentury(d[1], era);
  return {
    century: century,
    era: era,
    certainty: d[5] !== "?"
  };
}

function constructDecade(d) {
  return {
    decade: Number(d[1]),
    era: normalizeEra(d[2]),
    certainty: d[3] !== "?"
  };
}

function constructYear(d) {
  return {
    year: normalizeYear(d[0]),
    era: normalizeEra(d[1]),
    certainty: d[2] !== "?"
  };
}

function constructMonth(d) {
  console.log(d);
  return {
    month: normalizeMonth(d[0][0]),
    year: normalizeYear(d[3][0][0]),
    era: normalizeEra(d[3][0][1]),
    certainty: d[4] !== "?"
  };
}

function constructDay(d) {
  return {
    day: d[2],
    month: normalizeMonth(d[0][0]),
    year: normalizeYear(d[5]),
    era: normalizeEra(d[6]),
    certainty: d[7] !== "?"
  };
}

function constructEuroDate(d) {
  return {
    day: d[0],
    month: normalizeMonth(d[2][0]),
    year: normalizeYear(d[4]),
    era: normalizeEra(d[5]),
    certainty: d[6] !== "?"
  };
}

function constructSlashDate(d) {
  return {
    day: d[2],
    month: normalizeMonth(d[0]),
    year: normalizeYear(d[4]),
    era: normalizeEra(d[5]),
    certainty: d[6] !== "?",
    all: d
  };
}

function constructIsoDate(d) {
  return {
    day: d[5],
    month: normalizeMonth(d[3]),
    year: normalizeYear(d[1]),
    era: normalizeEra(d[0]),
    certainty: d[6] !== "?",
    all: d
  }
}

function constructDacsDate(d) {
  //console.log(d)
  let val = {
    month: normalizeMonth(d[2][0]),
    year: normalizeYear(d[0]),
    era: "CE",//normalizeEra(d[0]),
    certainty: d[5] !== "?",
    all: d
  }
  if (d[3] && d[3][1]) {
    val.day = d[3][1];
  }
  return val;
}

function addCirca(d) {
  let val = d[1];
  val.approximate = !!d[0];
  return val;
}

function constructEraYear(d) {
  console.log("HHHH")
  console.log(d);
  return d[0];
}

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "date$ebnf$1", "symbols": ["circa"], "postprocess": id},
    {"name": "date$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "date", "symbols": ["date$ebnf$1", "base_date"], "postprocess": addCirca},
    {"name": "base_date", "symbols": ["imprecise_date"], "postprocess": id},
    {"name": "base_date", "symbols": ["precise_date"], "postprocess": id},
    {"name": "imprecise_date", "symbols": ["century"], "postprocess": id},
    {"name": "imprecise_date", "symbols": ["decade"], "postprocess": id},
    {"name": "imprecise_date", "symbols": ["year"], "postprocess": id},
    {"name": "imprecise_date", "symbols": ["month"], "postprocess": id},
    {"name": "precise_date", "symbols": ["day"], "postprocess": id},
    {"name": "precise_date", "symbols": ["euroday"], "postprocess": id},
    {"name": "precise_date", "symbols": ["slashdate"], "postprocess": id},
    {"name": "precise_date", "symbols": ["isodate"], "postprocess": id},
    {"name": "precise_date", "symbols": ["dacs_date"], "postprocess": id},
    {"name": "century$ebnf$1", "symbols": ["the"], "postprocess": id},
    {"name": "century$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "century$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "century$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century", "symbols": ["century$ebnf$1", "century_number", "__", "century_word", "century$ebnf$2", "century$ebnf$3"], "postprocess": constructCentury},
    {"name": "decade$ebnf$1", "symbols": ["the"], "postprocess": id},
    {"name": "decade$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "decade$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "decade$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decade", "symbols": ["decade$ebnf$1", "decade_number", "decade$ebnf$2", "decade$ebnf$3"], "postprocess": constructDecade},
    {"name": "year$ebnf$1", "symbols": ["era"], "postprocess": id},
    {"name": "year$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "year$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "year$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "year", "symbols": ["year_number", "year$ebnf$1", "year$ebnf$2"], "postprocess": constructYear},
    {"name": "month$ebnf$1", "symbols": ["comma"], "postprocess": id},
    {"name": "month$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "month$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "month$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "month", "symbols": ["month_name", "month$ebnf$1", "__", "year_era", "month$ebnf$2"], "postprocess": constructMonth},
    {"name": "day$ebnf$1", "symbols": ["comma"], "postprocess": id},
    {"name": "day$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "day$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "day$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "day$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "day$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "day", "symbols": ["month_name", "__", "day_with_ordinal", "day$ebnf$1", "__", "year_number", "day$ebnf$2", "day$ebnf$3"], "postprocess": constructDay},
    {"name": "euroday$ebnf$1", "symbols": ["era"], "postprocess": id},
    {"name": "euroday$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "euroday$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "euroday$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "euroday", "symbols": ["day_with_ordinal", "__", "month_name", "__", "year_number", "euroday$ebnf$1", "euroday$ebnf$2"], "postprocess": constructEuroDate},
    {"name": "slashdate$ebnf$1", "symbols": ["era"], "postprocess": id},
    {"name": "slashdate$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "slashdate$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "slashdate$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "slashdate", "symbols": ["month_number", {"literal":"/"}, "day_number", {"literal":"/"}, "year_number", "slashdate$ebnf$1", "slashdate$ebnf$2"], "postprocess": constructSlashDate},
    {"name": "isodate$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "isodate$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "isodate$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "isodate$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "isodate", "symbols": ["isodate$ebnf$1", "year_number", {"literal":"-"}, "month_number", {"literal":"-"}, "day_number", "isodate$ebnf$2"], "postprocess": constructIsoDate},
    {"name": "dacs_date$ebnf$1$subexpression$1", "symbols": ["__", "day_number"]},
    {"name": "dacs_date$ebnf$1", "symbols": ["dacs_date$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "dacs_date$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dacs_date$ebnf$2", "symbols": ["certainty"], "postprocess": id},
    {"name": "dacs_date$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dacs_date", "symbols": ["four_digit_year", "__", "month_name", "dacs_date$ebnf$1", "dacs_date$ebnf$2"], "postprocess": constructDacsDate},
    {"name": "century_number$ebnf$1", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "century_number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century_number$ebnf$2", "symbols": ["ordinal_suffix"], "postprocess": id},
    {"name": "century_number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century_number", "symbols": [/[0-9]/, "century_number$ebnf$1", "century_number$ebnf$2"], "postprocess": (d) => Number([d[0],d[1]].join(""))},
    {"name": "decade_number$string$1", "symbols": [{"literal":"0"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade_number", "symbols": ["int", "decade_number$string$1"], "postprocess": (d) => (d[0].v + "0")},
    {"name": "four_digit_year", "symbols": ["four_int"], "postprocess": id},
    {"name": "month_name", "symbols": ["month_names"]},
    {"name": "month_name$subexpression$1$ebnf$1", "symbols": [{"literal":"."}], "postprocess": id},
    {"name": "month_name$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "month_name$subexpression$1", "symbols": ["month_abbrev", "month_name$subexpression$1$ebnf$1"], "postprocess": id},
    {"name": "month_name", "symbols": ["month_name$subexpression$1"]},
    {"name": "month_number$subexpression$1", "symbols": [/[0-9]/]},
    {"name": "month_number$subexpression$1", "symbols": [{"literal":"1"}, /[0-2]/]},
    {"name": "month_number$subexpression$1", "symbols": [{"literal":"0"}, /[1-9]/]},
    {"name": "month_number", "symbols": ["month_number$subexpression$1"], "postprocess": (d) => Number(d[0].join(""))},
    {"name": "day_number$ebnf$1", "symbols": [/[0-3]/], "postprocess": id},
    {"name": "day_number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "day_number", "symbols": ["day_number$ebnf$1", /[0-9]/], "postprocess": (d) => Number(d.join(""))},
    {"name": "day_with_ordinal$ebnf$1", "symbols": ["ordinal_suffix"], "postprocess": id},
    {"name": "day_with_ordinal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "day_with_ordinal", "symbols": ["day_number", "day_with_ordinal$ebnf$1"], "postprocess": id},
    {"name": "century_word$string$1", "symbols": [{"literal":"C"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "century_word", "symbols": ["century_word$string$1"]},
    {"name": "century_word$string$2", "symbols": [{"literal":"c"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "century_word", "symbols": ["century_word$string$2"], "postprocess": (d) => null},
    {"name": "ordinal_suffix$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ordinal_suffix", "symbols": ["ordinal_suffix$string$1"]},
    {"name": "ordinal_suffix$string$2", "symbols": [{"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ordinal_suffix", "symbols": ["ordinal_suffix$string$2"]},
    {"name": "ordinal_suffix$string$3", "symbols": [{"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ordinal_suffix", "symbols": ["ordinal_suffix$string$3"]},
    {"name": "ordinal_suffix$string$4", "symbols": [{"literal":"r"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ordinal_suffix", "symbols": ["ordinal_suffix$string$4"], "postprocess": (d) => null},
    {"name": "era", "symbols": ["_", "era_names"], "postprocess": d => d[1]},
    {"name": "year_era$subexpression$1$ebnf$1", "symbols": ["era"], "postprocess": id},
    {"name": "year_era$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "year_era$subexpression$1", "symbols": ["year_number", "year_era$subexpression$1$ebnf$1"]},
    {"name": "year_era", "symbols": ["year_era$subexpression$1"]},
    {"name": "year_era$subexpression$2", "symbols": ["low_year_number", "era"]},
    {"name": "year_era", "symbols": ["year_era$subexpression$2"], "postprocess": (d) => {console.log(d); return d; }},
    {"name": "low_year_number$subexpression$1", "symbols": ["two_int"]},
    {"name": "low_year_number$subexpression$1", "symbols": ["one_int"]},
    {"name": "low_year_number", "symbols": ["low_year_number$subexpression$1"], "postprocess": (d) => Number(d[0][0])},
    {"name": "year_number$subexpression$1", "symbols": ["four_int"]},
    {"name": "year_number$subexpression$1", "symbols": ["three_int"]},
    {"name": "year_number$subexpression$1", "symbols": ["high_two_int"]},
    {"name": "year_number", "symbols": ["year_number$subexpression$1"], "postprocess": (d) => Number(d[0][0])},
    {"name": "four_int", "symbols": [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/], "postprocess": (d) => Number(d.join(""))},
    {"name": "three_int", "symbols": [/[0-9]/, /[0-9]/, /[0-9]/], "postprocess": (d) => Number(d.join(""))},
    {"name": "high_two_int$subexpression$1$subexpression$1", "symbols": [{"literal":"3"}, /[2-9]/]},
    {"name": "high_two_int$subexpression$1", "symbols": ["high_two_int$subexpression$1$subexpression$1"]},
    {"name": "high_two_int$subexpression$1$subexpression$2", "symbols": [/[4-9]/, /[0-9]/]},
    {"name": "high_two_int$subexpression$1", "symbols": ["high_two_int$subexpression$1$subexpression$2"]},
    {"name": "high_two_int", "symbols": ["high_two_int$subexpression$1"], "postprocess": (d) =>  Number(d[0][0].join(""))},
    {"name": "low_two_int$subexpression$1$subexpression$1", "symbols": [/[0-2]/, /[0-9]/]},
    {"name": "low_two_int$subexpression$1", "symbols": ["low_two_int$subexpression$1$subexpression$1"]},
    {"name": "low_two_int$subexpression$1$subexpression$2$string$1", "symbols": [{"literal":"3"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "low_two_int$subexpression$1$subexpression$2", "symbols": ["low_two_int$subexpression$1$subexpression$2$string$1"]},
    {"name": "low_two_int$subexpression$1$subexpression$2$string$2", "symbols": [{"literal":"3"}, {"literal":"1"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "low_two_int$subexpression$1$subexpression$2", "symbols": ["low_two_int$subexpression$1$subexpression$2$string$2"]},
    {"name": "low_two_int$subexpression$1", "symbols": ["low_two_int$subexpression$1$subexpression$2"]},
    {"name": "low_two_int", "symbols": ["low_two_int$subexpression$1"], "postprocess": (d) =>  Number(d[0][0].join(""))},
    {"name": "two_int", "symbols": [/[0-9]/, /[0-9]/], "postprocess": (d) => d.join("")},
    {"name": "one_int", "symbols": [/[0-9]/]},
    {"name": "the$subexpression$1$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "the$subexpression$1", "symbols": ["the$subexpression$1$string$1"]},
    {"name": "the$subexpression$1$string$2", "symbols": [{"literal":"T"}, {"literal":"h"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "the$subexpression$1", "symbols": ["the$subexpression$1$string$2"]},
    {"name": "the", "symbols": ["the$subexpression$1", "__"], "postprocess": null},
    {"name": "circa$subexpression$1$string$1", "symbols": [{"literal":"c"}, {"literal":"i"}, {"literal":"r"}, {"literal":"c"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$1"]},
    {"name": "circa$subexpression$1$string$2", "symbols": [{"literal":"C"}, {"literal":"i"}, {"literal":"r"}, {"literal":"c"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$2"]},
    {"name": "circa$subexpression$1$string$3", "symbols": [{"literal":"c"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$3"]},
    {"name": "circa$subexpression$1$string$4", "symbols": [{"literal":"C"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$4"]},
    {"name": "circa$subexpression$1$string$5", "symbols": [{"literal":"C"}, {"literal":"a"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$5"]},
    {"name": "circa$subexpression$1$string$6", "symbols": [{"literal":"c"}, {"literal":"a"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$6"]},
    {"name": "circa$subexpression$1$string$7", "symbols": [{"literal":"c"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$7"]},
    {"name": "circa$subexpression$1$string$8", "symbols": [{"literal":"C"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$8"]},
    {"name": "circa$subexpression$1$string$9", "symbols": [{"literal":"c"}, {"literal":"c"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$9"]},
    {"name": "circa$subexpression$1$string$10", "symbols": [{"literal":"C"}, {"literal":"c"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$10"]},
    {"name": "circa$subexpression$1$string$11", "symbols": [{"literal":"c"}, {"literal":"c"}, {"literal":"a"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$11"]},
    {"name": "circa$subexpression$1$string$12", "symbols": [{"literal":"C"}, {"literal":"c"}, {"literal":"a"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$12"]},
    {"name": "circa$subexpression$1$string$13", "symbols": [{"literal":"a"}, {"literal":"p"}, {"literal":"p"}, {"literal":"r"}, {"literal":"o"}, {"literal":"x"}, {"literal":"i"}, {"literal":"m"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"l"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$13"]},
    {"name": "circa$subexpression$1$string$14", "symbols": [{"literal":"A"}, {"literal":"p"}, {"literal":"p"}, {"literal":"r"}, {"literal":"o"}, {"literal":"x"}, {"literal":"i"}, {"literal":"m"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"l"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$14"]},
    {"name": "circa$subexpression$1$string$15", "symbols": [{"literal":"a"}, {"literal":"p"}, {"literal":"p"}, {"literal":"r"}, {"literal":"o"}, {"literal":"x"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$15"]},
    {"name": "circa$subexpression$1$string$16", "symbols": [{"literal":"A"}, {"literal":"p"}, {"literal":"p"}, {"literal":"r"}, {"literal":"o"}, {"literal":"x"}, {"literal":"."}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "circa$subexpression$1", "symbols": ["circa$subexpression$1$string$16"]},
    {"name": "circa", "symbols": ["circa$subexpression$1", "__"], "postprocess": id},
    {"name": "certainty", "symbols": [{"literal":"?"}], "postprocess": id},
    {"name": "comma", "symbols": [{"literal":","}], "postprocess": null},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": (d) => ({v:d[0].join("")})},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null}},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null}},
    {"name": "era_names$subexpression$1", "symbols": [/[cC]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era_names", "symbols": ["era_names$subexpression$1"], "postprocess": id},
    {"name": "era_names$subexpression$2", "symbols": [/[bB]/, /[cC]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era_names", "symbols": ["era_names$subexpression$2"], "postprocess": id},
    {"name": "era_names$subexpression$3", "symbols": [/[bB]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era_names", "symbols": ["era_names$subexpression$3"], "postprocess": id},
    {"name": "era_names$subexpression$4", "symbols": [/[aA]/, /[dD]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "era_names", "symbols": ["era_names$subexpression$4"], "postprocess": id},
    {"name": "month_abbrev$subexpression$1", "symbols": [/[jJ]/, /[aA]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$1"], "postprocess": id},
    {"name": "month_abbrev$subexpression$2", "symbols": [/[fF]/, /[eE]/, /[bB]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$2"], "postprocess": id},
    {"name": "month_abbrev$subexpression$3", "symbols": [/[mM]/, /[aA]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$3"], "postprocess": id},
    {"name": "month_abbrev$subexpression$4", "symbols": [/[aA]/, /[pP]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$4"], "postprocess": id},
    {"name": "month_abbrev$subexpression$5", "symbols": [/[jJ]/, /[uU]/, /[nN]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$5"], "postprocess": id},
    {"name": "month_abbrev$subexpression$6", "symbols": [/[jJ]/, /[uU]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$6"], "postprocess": id},
    {"name": "month_abbrev$subexpression$7", "symbols": [/[aA]/, /[uU]/, /[gG]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$7"], "postprocess": id},
    {"name": "month_abbrev$subexpression$8", "symbols": [/[sS]/, /[eE]/, /[pP]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$8"], "postprocess": id},
    {"name": "month_abbrev$subexpression$9", "symbols": [/[sS]/, /[eE]/, /[pP]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$9"], "postprocess": id},
    {"name": "month_abbrev$subexpression$10", "symbols": [/[oO]/, /[cC]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$10"], "postprocess": id},
    {"name": "month_abbrev$subexpression$11", "symbols": [/[nN]/, /[oO]/, /[vV]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$11"], "postprocess": id},
    {"name": "month_abbrev$subexpression$12", "symbols": [/[dD]/, /[eE]/, /[cC]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_abbrev", "symbols": ["month_abbrev$subexpression$12"], "postprocess": id},
    {"name": "month_names$subexpression$1", "symbols": [/[jJ]/, /[aA]/, /[nN]/, /[uU]/, /[aA]/, /[rR]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$1"], "postprocess": id},
    {"name": "month_names$subexpression$2", "symbols": [/[fF]/, /[eE]/, /[bB]/, /[rR]/, /[uU]/, /[aA]/, /[rR]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$2"], "postprocess": id},
    {"name": "month_names$subexpression$3", "symbols": [/[fF]/, /[eE]/, /[bB]/, /[uU]/, /[aA]/, /[rR]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$3"], "postprocess": id},
    {"name": "month_names$subexpression$4", "symbols": [/[mM]/, /[aA]/, /[rR]/, /[cC]/, /[hH]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$4"], "postprocess": id},
    {"name": "month_names$subexpression$5", "symbols": [/[aA]/, /[pP]/, /[rR]/, /[iI]/, /[lL]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$5"], "postprocess": id},
    {"name": "month_names$subexpression$6", "symbols": [/[mM]/, /[aA]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$6"], "postprocess": id},
    {"name": "month_names$subexpression$7", "symbols": [/[jJ]/, /[uU]/, /[nN]/, /[eE]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$7"], "postprocess": id},
    {"name": "month_names$subexpression$8", "symbols": [/[jJ]/, /[uU]/, /[lL]/, /[yY]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$8"], "postprocess": id},
    {"name": "month_names$subexpression$9", "symbols": [/[aA]/, /[uU]/, /[gG]/, /[uU]/, /[sS]/, /[tT]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$9"], "postprocess": id},
    {"name": "month_names$subexpression$10", "symbols": [/[sS]/, /[eE]/, /[pP]/, /[tT]/, /[eE]/, /[mM]/, /[bB]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$10"], "postprocess": id},
    {"name": "month_names$subexpression$11", "symbols": [/[oO]/, /[cC]/, /[tT]/, /[oO]/, /[bB]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$11"], "postprocess": id},
    {"name": "month_names$subexpression$12", "symbols": [/[nN]/, /[oO]/, /[vV]/, /[eE]/, /[mM]/, /[bB]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$12"], "postprocess": id},
    {"name": "month_names$subexpression$13", "symbols": [/[dD]/, /[eE]/, /[cC]/, /[eE]/, /[mM]/, /[bB]/, /[eE]/, /[rR]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "month_names", "symbols": ["month_names$subexpression$13"], "postprocess": id}
]
  , ParserStart: "date"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

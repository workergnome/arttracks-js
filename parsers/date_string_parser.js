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
function normalizeYear(d) {
  return d
}

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
    era: normalizeEra(d[3]),
    certainty: d[4] !== "?"
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
  return {
    month: normalizeMonth(d[0][0]),
    year: normalizeYear(d[3]),
    era: normalizeEra(d[4]),
    certainty: d[5] !== "?"
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


function edtf(d) {
  let day = String(d.day).padStart(2,"0");
  let month = String(d.month).padStart(2,"0");
  let year = String(d.year).padStart(4,"0");
  let decade = String(d.decade).replace(/0$/, "X").padStart(4,"0")
  let century = String(d.century).replace(/00$/, "XX").padStart(4,"0")
  let era = d.era == "CE" ? "" : "-"
  let certainty = d.certainty ? "" : "?"

  if(d.day) {
    return `${era}${year}-${month}-${day}${certainty}`;
  }
  else if  (d.month) {
    return `${era}${year}-${month}-XX${certainty}`;
  }
  else if  (d.year) {
    return `${era}${year}-XX-XX${certainty}`;
  }
  else if  (d.decade) {
    return `${era}${decade}-XX-XX${certainty}`;
  }
  else if  (d.century) {
    return `${era}${century}-XX-XX${certainty}`;
  }
}


function formatOnDate(d) {
  return {
    botb: edtf(d[2]),
    eotb: edtf(d[2]),
    bote: edtf(d[2]),
    eote: edtf(d[2])
  };
}

function formatDatePhrase(d) {
  let merged_dates = {}
  for (let part of d[0][0]) {
    Object.assign(merged_dates,part)
  }
  return merged_dates;
}

function processStartDate(d) {
  if(d[0].day) {
    return {
      botb: edtf(d[0]), 
      eotb: edtf(d[0]),
      bote: edtf(d[0]), 
      eote: edtf(d[0])
    }
  } 
  return {
    botb: edtf(d[0]),
    eotb: edtf(d[0])
  }
}

var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "date", "symbols": ["century"], "postprocess": id},
    {"name": "date", "symbols": ["decade"], "postprocess": id},
    {"name": "date", "symbols": ["year"], "postprocess": id},
    {"name": "date", "symbols": ["month"], "postprocess": id},
    {"name": "date", "symbols": ["precise_date"], "postprocess": id},
    {"name": "precise_date", "symbols": ["day"], "postprocess": id},
    {"name": "precise_date", "symbols": ["euroday"], "postprocess": id},
    {"name": "precise_date", "symbols": ["slashdate"], "postprocess": id},
    {"name": "precise_date", "symbols": ["isodate"], "postprocess": id},
    {"name": "century$ebnf$1$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "century$ebnf$1", "symbols": ["century$ebnf$1$string$1"], "postprocess": id},
    {"name": "century$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "century$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "century$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century", "symbols": ["century$ebnf$1", "century_number", "__", "century_word", "century$ebnf$2", "century$ebnf$3"], "postprocess": constructCentury},
    {"name": "decade$ebnf$1$string$1", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade$ebnf$1", "symbols": ["decade$ebnf$1$string$1"], "postprocess": id},
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
    {"name": "month$ebnf$2", "symbols": ["era"], "postprocess": id},
    {"name": "month$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "month$ebnf$3", "symbols": ["certainty"], "postprocess": id},
    {"name": "month$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "month", "symbols": ["month_name", "month$ebnf$1", "__", "year_number", "month$ebnf$2", "month$ebnf$3"], "postprocess": constructMonth},
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
    {"name": "century_number$ebnf$1", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "century_number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century_number$ebnf$2", "symbols": ["ordinal_suffix"], "postprocess": id},
    {"name": "century_number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "century_number", "symbols": [/[0-9]/, "century_number$ebnf$1", "century_number$ebnf$2"], "postprocess": (d) => Number([d[0],d[1]].join(""))},
    {"name": "decade_number$string$1", "symbols": [{"literal":"0"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "decade_number", "symbols": ["int", "decade_number$string$1"], "postprocess": (d) => (d[0].v + "0")},
    {"name": "year_number", "symbols": ["int"], "postprocess": (d) => Number(d[0].v)},
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
    {"name": "month_names", "symbols": ["month_names$subexpression$13"], "postprocess": id},
    {"name": "date_string", "symbols": ["date_phrase"], "postprocess": id},
    {"name": "date_string", "symbols": ["on_date"], "postprocess": id},
    {"name": "date_string", "symbols": ["no_date"], "postprocess": id},
    {"name": "date_phrase$subexpression$1", "symbols": ["start_clause"]},
    {"name": "date_phrase$subexpression$1", "symbols": ["end_clause"]},
    {"name": "date_phrase$subexpression$1$subexpression$1", "symbols": ["start_clause", "end_clause"], "postprocess": (d) => [d[0][0],d[1][0]]},
    {"name": "date_phrase$subexpression$1", "symbols": ["date_phrase$subexpression$1$subexpression$1"]},
    {"name": "date_phrase", "symbols": ["date_phrase$subexpression$1"], "postprocess": formatDatePhrase},
    {"name": "on_date$string$1", "symbols": [{"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "on_date", "symbols": ["on_date$string$1", "__", "precise_date"], "postprocess": formatOnDate},
    {"name": "no_date$subexpression$1$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":" "}, {"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "no_date$subexpression$1", "symbols": ["no_date$subexpression$1$string$1"]},
    {"name": "no_date$subexpression$1", "symbols": []},
    {"name": "no_date", "symbols": ["no_date$subexpression$1"], "postprocess": (d) => null},
    {"name": "start_clause", "symbols": ["in_date"]},
    {"name": "start_clause", "symbols": ["between_begin"]},
    {"name": "start_clause", "symbols": ["by_date"]},
    {"name": "start_clause", "symbols": ["after_date"]},
    {"name": "start_clause", "symbols": ["just_a_start_date"]},
    {"name": "end_clause$subexpression$1", "symbols": ["between_end"]},
    {"name": "end_clause$subexpression$1", "symbols": ["at_least_date"]},
    {"name": "end_clause$subexpression$1", "symbols": ["before_date"]},
    {"name": "end_clause$subexpression$1", "symbols": ["just_an_end_date"]},
    {"name": "end_clause", "symbols": ["until", "end_clause$subexpression$1"], "postprocess": (d) => d[1]},
    {"name": "just_a_start_date", "symbols": ["date"], "postprocess": processStartDate},
    {"name": "just_an_end_date", "symbols": ["date"], "postprocess": (d) => ({bote: edtf(d[0]), eote: edtf(d[0])})},
    {"name": "in_date", "symbols": ["throughout", "date"], "postprocess": (d) => ({eotb: edtf(d[1]), bote: edtf(d[1])})},
    {"name": "by_date", "symbols": ["by", "date"], "postprocess": (d) => ({eotb: edtf(d[1])})},
    {"name": "after_date$ebnf$1", "symbols": ["sometime"], "postprocess": id},
    {"name": "after_date$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "after_date", "symbols": ["after_date$ebnf$1", "after", "date"], "postprocess": (d) => ({botb: edtf(d[2])})},
    {"name": "between_begin", "symbols": ["between", "date", "and", "date"], "postprocess": (d) => ({botb: edtf(d[1]),eotb: edtf(d[3])})},
    {"name": "between_end", "symbols": ["between", "date", "and", "date"], "postprocess": (d) => ({bote: edtf(d[1]),eote: edtf(d[3])})},
    {"name": "before_date", "symbols": ["before_phrase", "date"], "postprocess": (d) => ({eote: edtf(d[1])})},
    {"name": "at_least_date", "symbols": ["at_least", "date"], "postprocess": (d) => ({bote: edtf(d[1])})},
    {"name": "throughout$subexpression$1$subexpression$1$subexpression$1", "symbols": [{"literal":"T"}]},
    {"name": "throughout$subexpression$1$subexpression$1$subexpression$1", "symbols": [{"literal":"t"}]},
    {"name": "throughout$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"h"}, {"literal":"r"}, {"literal":"o"}, {"literal":"u"}, {"literal":"g"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "throughout$subexpression$1$subexpression$1", "symbols": ["throughout$subexpression$1$subexpression$1$subexpression$1", "throughout$subexpression$1$subexpression$1$string$1"]},
    {"name": "throughout$subexpression$1", "symbols": ["throughout$subexpression$1$subexpression$1"]},
    {"name": "throughout$subexpression$1$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "throughout$subexpression$1", "symbols": ["throughout$subexpression$1$string$1"]},
    {"name": "throughout$subexpression$1$string$2", "symbols": [{"literal":"I"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "throughout$subexpression$1", "symbols": ["throughout$subexpression$1$string$2"]},
    {"name": "throughout", "symbols": ["throughout$subexpression$1", "__"], "postprocess": null},
    {"name": "after$subexpression$1", "symbols": [{"literal":"A"}]},
    {"name": "after$subexpression$1", "symbols": [{"literal":"a"}]},
    {"name": "after$string$1", "symbols": [{"literal":"f"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "after", "symbols": ["after$subexpression$1", "after$string$1", "__"], "postprocess": null},
    {"name": "sometime$subexpression$1", "symbols": [{"literal":"s"}]},
    {"name": "sometime$subexpression$1", "symbols": [{"literal":"S"}]},
    {"name": "sometime$string$1", "symbols": [{"literal":"o"}, {"literal":"m"}, {"literal":"e"}, {"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sometime", "symbols": ["sometime$subexpression$1", "sometime$string$1", "__"], "postprocess": null},
    {"name": "between$ebnf$1", "symbols": ["sometime"], "postprocess": id},
    {"name": "between$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "between$subexpression$1", "symbols": [{"literal":"B"}]},
    {"name": "between$subexpression$1", "symbols": [{"literal":"b"}]},
    {"name": "between$string$1", "symbols": [{"literal":"e"}, {"literal":"t"}, {"literal":"w"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "between", "symbols": ["between$ebnf$1", "between$subexpression$1", "between$string$1", "__"], "postprocess": null},
    {"name": "by$subexpression$1$string$1", "symbols": [{"literal":"b"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "by$subexpression$1", "symbols": ["by$subexpression$1$string$1"]},
    {"name": "by$subexpression$1$string$2", "symbols": [{"literal":"B"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "by$subexpression$1", "symbols": ["by$subexpression$1$string$2"]},
    {"name": "by", "symbols": ["by$subexpression$1", "__"], "postprocess": null},
    {"name": "and$subexpression$1$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "and$subexpression$1", "symbols": ["and$subexpression$1$string$1"]},
    {"name": "and$subexpression$1", "symbols": [{"literal":"&"}]},
    {"name": "and", "symbols": ["__", "and$subexpression$1", "__"], "postprocess": null},
    {"name": "until$subexpression$1", "symbols": [{"literal":"U"}]},
    {"name": "until$subexpression$1", "symbols": [{"literal":"u"}]},
    {"name": "until$string$1", "symbols": [{"literal":"n"}, {"literal":"t"}, {"literal":"i"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "until", "symbols": ["_", "until$subexpression$1", "until$string$1", "__"], "postprocess": null},
    {"name": "no_later_than$subexpression$1$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":" "}, {"literal":"l"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}, {"literal":" "}, {"literal":"t"}, {"literal":"h"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "no_later_than$subexpression$1", "symbols": ["no_later_than$subexpression$1$string$1"]},
    {"name": "no_later_than", "symbols": ["no_later_than$subexpression$1", "__"], "postprocess": null},
    {"name": "before$subexpression$1$string$1", "symbols": [{"literal":"b"}, {"literal":"e"}, {"literal":"f"}, {"literal":"o"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "before$subexpression$1", "symbols": ["before$subexpression$1$string$1"]},
    {"name": "before", "symbols": ["before$subexpression$1", "__"], "postprocess": null},
    {"name": "before_phrase$ebnf$1", "symbols": ["sometime"], "postprocess": id},
    {"name": "before_phrase$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "before_phrase$subexpression$1", "symbols": ["no_later_than"]},
    {"name": "before_phrase$subexpression$1", "symbols": ["before"]},
    {"name": "before_phrase", "symbols": ["before_phrase$ebnf$1", "before_phrase$subexpression$1"], "postprocess": null},
    {"name": "at_least$string$1", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":" "}, {"literal":"l"}, {"literal":"e"}, {"literal":"a"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "at_least", "symbols": ["at_least$string$1", "__"], "postprocess": null}
]
  , ParserStart: "date_string"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

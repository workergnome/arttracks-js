@{%
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

%}




#-------------------------------------------------------------------------------
# Parser Rules
#-------------------------------------------------------------------------------

# Base rule
# ------------------
date           -> circa:? base_date {% addCirca %}

base_date      ->  imprecise_date   {% id %} 
                 | precise_date     {% id %}

imprecise_date ->  century          {% id %}
                 | decade           {% id %}
                 | year             {% id %}
                 | month            {% id %}
     
precise_date   ->  day              {% id %}
                 | euroday          {% id %}
                 | slashdate        {% id %}
                 | isodate          {% id %}
                 | dacs_date        {% id %}
    
# Core date rules
# ------------------   
century   -> the:? century_number __ century_word  era:? certainty:?           {% constructCentury %}
decade    -> the:? decade_number era:? certainty:?                             {% constructDecade %}
year      -> year_era certainty:?                                     {% constructYear %}
month     -> month_name comma:? __ year_era certainty:?                        {% constructMonth %}
day       -> month_name __ day_with_ordinal comma:? __ year_number era:? certainty:? {% constructDay %}
euroday   -> day_with_ordinal __ month_name __ year_number era:? certainty:?         {% constructEuroDate %}
slashdate -> month_number "/" day_number "/" year_number era:? certainty:?     {% constructSlashDate %}
isodate   -> "-":? year_number "-" month_number "-" day_number certainty:?     {% constructIsoDate %}
dacs_date -> four_digit_year __ month_name (__ day_number):? certainty:?               {% constructDacsDate %}

# Date parts
# ------------------
century_number   -> [0-9] [0-9]:? ordinal_suffix:?     {% (d) => Number([d[0],d[1]].join("")) %}
decade_number    -> int "0s"                           {% (d) => (d[0].v + "0") %}
four_digit_year  -> four_int                           {% id %}
month_name       -> month_names | (month_abbrev ".":?  {% id %})
month_number     -> ([0-9] | "1" [0-2] | "0" [1-9])    {% (d) => Number(d[0].join("")) %} 
day_number       -> [0-3]:? [0-9]                      {% (d) => Number(d.join("")) %}
day_with_ordinal -> day_number ordinal_suffix:?        {% id %}
century_word     -> "Century" | "century"              {% (d) => null %}
ordinal_suffix   -> "th" | "st" | "nd" | "rd"          {% (d) => null %}
era              -> _ era_names                        {% d => d[1] %}


year_era        -> (year_number era:?) | (low_year_number era)  {% id %}
low_year_number  -> (two_int | one_int) {% (d) => Number(d[0][0]) %}
year_number      -> (four_int | three_int | high_two_int) {% (d) => Number(d[0][0]) %}
four_int      -> [0-9] [0-9] [0-9] [0-9]        {% (d) => Number(d.join("")) %}
three_int     -> [0-9] [0-9] [0-9]              {% (d) => Number(d.join("")) %}
high_two_int  -> (("3" [2-9]) | ([4-9] [0-9]))  {% (d) =>  Number(d[0][0].join("")) %}
low_two_int   -> (([0-2] [0-9]) | ( "30" | "31")) {% (d) =>  Number(d[0][0].join("")) %}
two_int    -> [0-9] [0-9] {% (d) => d.join("") %}
one_int    -> [0-9]

# Special characters
# ------------------
the       -> ("the" | "The" ) __  {% null %}
circa     -> ("circa" | "Circa" | "ca" | "Ca" | "Ca." | "ca." | "c." | "C." | "cca" | "Cca" | "cca." | "Cca." | "approximately" | "Approximately" | "approx." | "Approx.") __           {% id %}
certainty -> "?"                  {% id %}
comma     -> ","                  {% null %}
int       -> [0-9]:+              {% (d) => ({v:d[0].join("")}) %}
_         -> [\s]:*               {% function(d) {return null} %}
__        -> [\s]:+               {% function(d) {return null} %}


# Dictionaries
# ------------------
era_names ->    "CE"i       {% id %}
              | "BCE"i      {% id %}
              | "BC"i       {% id %}
              | "AD"i       {% id %}    

month_abbrev ->  "jan"i     {% id %}
               | "feb"i     {% id %}
               | "mar"i     {% id %}
               | "apr"i     {% id %}
               | "jun"i     {% id %}
               | "jul"i     {% id %}
               | "aug"i     {% id %}
               | "sep"i     {% id %}
               | "sept"i    {% id %}
               | "oct"i     {% id %}
               | "nov"i     {% id %}
               | "dec"i     {% id %}

month_names -> "january"i   {% id %}
             | "february"i  {% id %}
             | "febuary"i   {% id %}
             | "march"i     {% id %}
             | "april"i     {% id %}
             | "may"i       {% id %}
             | "june"i      {% id %}
             | "july"i      {% id %}
             | "august"i    {% id %}
             | "september"i {% id %}
             | "october"i   {% id %}
             | "november"i  {% id %}
             | "december"i  {% id %}
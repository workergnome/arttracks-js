@include "date_parser.ne"

@{%
function edtf(d) {
  let day = String(d.day).padStart(2,"0");
  let month = String(d.month).padStart(2,"0");
  let year = String(d.year).padStart(4,"0");
  let decade = String(d.decade).padStart(4,"0").replace(/0$/, "")
  let century = String(d.century).padStart(4,"0").replace(/00$/, "")
  let era = d.era == "CE" ? "" : "-"

  let suffix = "";
  if (d.certainty && d.approximate) { suffix = "~"}
  else if (!d.certainty && d.approximate) { suffix = "%"}
  else if (!d.certainty && !d.approximate) { suffix = "?"}


  if(d.day) {
    return `${era}${year}-${month}-${day}${suffix}`;
  }
  else if  (d.month) {
    return `${era}${year}-${month}${suffix}`;
  }
  else if  (d.year) {
    return `${era}${year}${suffix}`;
  }
  else if  (d.decade) {
    return `${era}${decade}${suffix}`;
  }
  else if  (d.century) {
    return `${era}${century}${suffix}`;
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

function  formatDashDate(d) {
  d[2].approximate = d[0].approximate
  return {
    botb: edtf(d[0]), 
    eotb: edtf(d[0]),
    bote: edtf(d[2]), 
    eote: edtf(d[2])
  } 
}

function formatMonthDash(d) {
   let date1 = {
    year: d[1],
    month: normalizeMonth(d[3][0]),
    approximate: !!d[0],
    era: "CE",
    certainty: true
  }
  let date2 = {
    year: d[1],
    approximate: !!d[0],
    month: normalizeMonth(d[5][0]),
    era: "CE",
    certainty: true
  }
  return {
    botb: edtf(date1), 
    eotb: edtf(date1),
    bote: edtf(date2), 
    eote: edtf(date2)
  } 
}

%}


# Base rule
# ------------------
date_string -> date_phrase {% id %}
               | on_date {% id %} 
               | no_date {% id %}
               | dashed_date {% id %}
               | during_date {% id %}
               | month_dash {% id %}

# Core date type
# ------------------  

date_phrase -> (   start_clause 
                 | end_clause 
                 | (start_clause end_clause {% (d) => [d[0][0],d[1][0]]%})
               ) 
               {% formatDatePhrase %}
on_date -> "on" __ precise_date {% formatOnDate %}
no_date -> ("no date" | "undated") {% (d) => ({botb: null, eotb: null, bote: null, eote: null}) %}
dashed_date -> date ( "-" | (__ "-" __)) date  {% formatDashDate %}
month_dash  -> circa:? four_digit_year __ month_name "-" month_name     {% formatMonthDash %}

# Phrase Clauses
# ------------------  

start_clause -> in_date | between_begin | by_date | after_date | before_date | just_a_start_date
end_clause   -> until 
                (between_end | at_least_date | u_before_date | u_after_date | just_an_end_date ) 
                {% (d) => d[1]%}

# Phrase Parts
# ------------------  
just_a_start_date -> date               {% processStartDate %}
just_an_end_date  -> date               {% (d) => ({bote: edtf(d[0]), eote: edtf(d[0])}) %}
in_date       -> throughout date        {% (d) => ({eotb: edtf(d[1]), bote: edtf(d[1])}) %}
by_date       -> by date                {% (d) => ({eotb: edtf(d[1])}) %}
after_date    -> sometime:? after date  {% (d) => ({botb: edtf(d[2])}) %}
u_after_date  -> sometime:? after date  {% (d) => ({bote: edtf(d[2])}) %}
between_begin -> between date and date  {% (d) => ({botb: edtf(d[1]), eotb: edtf(d[3])}) %}
between_end   -> between date and date  {% (d) => ({bote: edtf(d[1]), eote: edtf(d[3])}) %}
u_before_date -> before_phrase date     {% (d) => ({eote: edtf(d[1])}) %}
before_date   -> before_phrase date     {% (d) => ({eotb: edtf(d[1])}) %}
at_least_date -> at_least date          {% (d) => ({bote: edtf(d[1])}) %}
during_date   -> sometime:? during imprecise_date {% (d) => ({botb: edtf(d[2]), eote: edtf(d[2])}) %}


# Magic Words
# ------------------
throughout    -> ((("T" | "t") "hroughout") | "in" | "In" ) __          {% null %}
after         -> ("A" | "a") "fter" __               {% null %}
sometime      -> ("s" | "S") "ometime" __            {% null %}
between       -> sometime:? ("B" | "b") "etween" __  {% null %}
by            -> ("by" | "By") __                    {% null %}
and           -> __ ("and" | "&") __                 {% null %}
until         -> _ ("U" | "u") "ntil" __             {% null %}
during        -> _ ("D" | "d") "uring" __            {% null %}
no_later_than -> ("no later than") __                {% null %}
before        -> ("before") __                       {% null %}
before_phrase -> sometime:? (no_later_than | before) {% null %}
at_least      -> "at least" __                       {% null %}
  
import edtf from "edtf";

export default class CulturalDates {
  /**
   * Given a four-part date interval as an object containing EDTF strings
   * representing the standard Allen Interval/CIDOC-CRM time model,
   * convert it into a pretty-printed string following the Cultural Date rules.
   *
   * @param  {String} options.botb - The Begin of the Begin as an EDTF date
   * @param  {String} options.eotb - The End of the Begin as an EDTF date
   * @param  {String} options.bote - The Begin of the End as an EDTF date
   * @param  {String} options.eote - The End of the End as an EDTF date
   * @return {String}              - The interval expressed as natural language English
   */
  parse(obj) {
    // Handle empty data
    if (obj.null || Object.keys(obj).length == 0) {
      return null;
    }

    const botb = obj.botb;
    const bote = obj.bote;
    const eotb = obj.eotb;
    const eote = obj.eote;

    // Handle "no date"
    if (!botb && !bote && !eotb && !eote) {
      return "no date";
    }

    // check for valid dates
    try {
      botb && edtf(botb);
      bote && edtf(bote);
      eotb && edtf(eotb);
      eote && edtf(eote);
    } catch (error) {
      return null;
    }

    // Handle special "throughout" case
    if (eotb && bote && !(botb || eote) && eotb === bote) {
      return `throughout ${this._format(eotb)}`;
    }

    // Handle special "during" case
    if (botb && eote && !(bote || eotb) && botb === eote) {
      let testDate = edtf(eote);
      if (
        testDate.precision < 3 ||
        testDate.type == "Century" ||
        testDate.type == "Decade"
      ) {
        return `sometime during ${this._format(botb)}`;
      }
    }

    // Handle special "throughout, until" case
    if (eotb && bote && eote && !botb && eotb === bote) {
      return `throughout ${this._format(
        eotb
      )} until no later than ${this._format(eote)}`;
    }

    // Handle special "on" case
    if (
      botb &&
      eotb &&
      bote &&
      eote &&
      (botb === eotb && bote === eote && botb === eote) &&
      edtf(botb).precision === 3
    ) {
      return `on ${this._format(botb)}`;
    }

    // Calculate the beginning date phrase
    let firstString = null;
    if (botb && eotb) {
      if (botb === eotb) {
        firstString = this._format(botb);
      } else {
        firstString = `sometime between ${this._format(
          botb
        )} and ${this._format(eotb)}`;
      }
    } else if (botb) {
      firstString = `after ${this._format(botb)}`;
    } else if (eotb) {
      firstString = `by ${this._format(eotb)}`;
    }

    // Calculate the ending date phrase
    let secondString = null;
    if (bote && eote) {
      if (bote === eote) {
        secondString = this._format(bote);
      } else {
        secondString = `sometime between ${this._format(
          bote
        )} and ${this._format(eote)}`;
      }
    } else if (bote) {
      secondString = `at least ${this._format(bote)}`;
    } else if (eote) {
      secondString = `no later than ${this._format(eote)}`;
    }

    // Join the phrases
    if (firstString && secondString) {
      return `${firstString} until ${secondString}`;
    } else if (secondString) {
      return `until ${secondString}`;
    }
    return firstString;
  }

  /**
   * Add the correct ordinalization suffix to a number and return as a string.
   *
   * @example
   * _ordinalize(1); // returns "1st"
   *
   * @param  {Number} i - the number to convert
   * @return {String}   - the _ordinalized number
   */
  _ordinalize(i) {
    let j = i % 10;
    let k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  }

  /**
   * Given an string representing an EDTF date, return a pretty-printed
   * string representation, using the Cultural Date rules.
   *
   * @param  {String} dateString  - The EDTF date as a String
   * @return {STring}             - The formatted date object
   */
  _format(dateString) {
    let bce = false;
    let str = null;
    let certain = true;
    let approximate = false;

    // figure out if the date is BCE or CE
    if (dateString.startsWith("-")) {
      bce = true;
      dateString = dateString.slice(1);
    }

    let date = edtf(dateString);

    // Figure out if the date is certain or not
    if (date.uncertain.value > 0 || date.uncertain === true) {
      certain = false;
      date.uncertain = false;
    }

    if (date.approximate.value > 0 || date.approximate === true) {
      approximate = true;
      date.approximate = false;
    }

    // Write out the base date string
    if (date.type === "Date") {
      str = date.format("en-US", { month: "long" });
    } else if (date.type === "Decade") {
      str = `the ${date.decade}0s`;
    } else if (date.type === "Century") {
      let century = bce ? date.century : date.century + 1;
      str = `the ${this._ordinalize(century)} century`;
    }

    // Append era to the date string
    if (bce) {
      str += " BCE";
    } else if (date.year < 1000) {
      str += " CE";
    }

    // append certainty to the date string
    if (certain === false) {
      str += "?";
    }

    // append certainty to the date string
    if (approximate === true) {
      str = `circa ${str}`;
    }

    return str;
  }
}

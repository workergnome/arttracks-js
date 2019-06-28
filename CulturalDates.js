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
  parse({ botb, eotb, bote, eote }) {
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
      (edtf(botb).precision === 3 && edtf(botb).precision === 3)
    ) {
      return `on ${this._format(botb)}`;
    }

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

    // workaround for BCE full date bug in edtf.js
    if (dateString.startsWith("-") && dateString.match(/-/g).length === 3) {
      bce = true;
      dateString = dateString.slice(1);
    }

    let date = edtf(dateString);

    if (date.uncertain.value > 0) {
      certain = false;
      date.uncertain = false;
    }

    if (date.type === "Date") {
      switch (date.precision) {
        case 1:
        case 2:
        case 3:
          str = date.format("en-US", { month: "long" });
      }
    } else if (date.type === "Decade") {
      str = `the ${date}0s`;
    } else if (date.type === "Century") {
      let century = date.century;
      if (century >= 0) {
        century += 1;
      } else {
        bce = true;
        century = Math.abs(century);
      }
      str = `the ${this._ordinalize(century)} Century`;
    }
    if (certain === false) {
      str += "?";
    }
    if (bce) {
      str += " BCE";
    }
    return str;
  }
}

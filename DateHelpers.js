import edtf from "edtf";
import CulturalDates from "./CulturalDates.js";
class DateHelpers {
  static _botb(obj) {
    const d = edtf(obj.botb).min;
    return new Date(d);
  }
  static _eotb(obj) {
    let d = edtf(obj.eotb).max;
    if (obj.bote && obj.eotb == obj.bote) {
      d = edtf(obj.eotb).min;
    }
    return new Date(d);
  }
  static _bote(obj) {
    let d = edtf(obj.bote).min;
    if (obj.eotb && obj.eotb == obj.bote) {
      d = edtf(obj.bote).max;
    }
    return new Date(d);
  }
  static _eote(obj) {
    const d = edtf(obj.eote).max;
    return new Date(d);
  }

  static generateString(inputObject) {
    let cd = new CulturalDates();
    return cd.parse(inputObject);
  }

  static createLinkedArt(inputObject, url, label) {
    if (!inputObject) {
      return null;
    }
    let iso = this.createIsoDates(inputObject);
    if (!label) {
      label = this.generateString(inputObject);
    }
    return JSON.parse(
      JSON.stringify({
        timespan: {
          id: url,
          type: "TimeSpan",
          _label: label,
          begin_of_the_begin: iso.botb,
          end_of_the_begin: iso.eotb,
          begin_of_the_end: iso.bote,
          end_of_the_end: iso.eote
        }
      })
    );
  }

  static createUTCDates(inputObject) {
    if (!inputObject) {
      return null;
    }
    let utcDates = {};
    if (inputObject.botb) {
      utcDates.botb = this._botb(inputObject).toUTCString();
    }

    if (inputObject.eotb) {
      utcDates.eotb = this._eotb(inputObject).toUTCString();
    }
    if (inputObject.bote) {
      utcDates.bote = this._bote(inputObject).toUTCString();
    }
    if (inputObject.eote) {
      utcDates.eote = this._eote(inputObject).toUTCString();
    }
    return utcDates;
  }

  static createIsoDates(inputObject) {
    if (!inputObject) {
      return null;
    }
    let isoDates = {};
    if (inputObject.botb) {
      isoDates.botb = this._botb(inputObject).toISOString();
    }

    if (inputObject.eotb) {
      isoDates.eotb = this._eotb(inputObject).toISOString();
    }
    if (inputObject.bote) {
      isoDates.bote = this._bote(inputObject).toISOString();
    }
    if (inputObject.eote) {
      isoDates.eote = this._eote(inputObject).toISOString();
    }
    return isoDates;
  }
}

export default DateHelpers;

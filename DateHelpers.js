import edtf from "edtf";
import CulturalDates from "./CulturalDates.js";

class DateHelpers {
  static generateString(inputObject) {
    let cd = new CulturalDates();
    return cd.parse(inputObject);
  }

  static generateIdentifier(string, url) {
    let val = JSON.parse(`
        {
          "id": "${url}", 
          "type": "Name", 
          "classified_as": [
            {
              "id": "http://vocab.getty.edu/aat/300404670", 
              "type": "Type", 
              "_label": "Primary Name"
            }
          ], 
          "language": [
            {
              "id": "http://vocab.getty.edu/aat/300388277", 
              "type": "Language", 
              "_label": "English"
            }
          ], 
          "content": "${string}"
        }
    `);
    if (!url) {
      delete val.id;
    }
    return val;
  }

  static createLinkedArt(inputObject, url, label) {
    if (!inputObject) {
      return null;
    }
    let iso = this.createIsoDates(inputObject);
    if (!label) {
      label = this.generateString(inputObject);
    }
    let val = {
      timespan: {
        type: "TimeSpan",
        _label: label,
        identified_by: [this.generateIdentifier(label, url ? url : null)],
        sometime_within: `${inputObject.botb || ""}/${inputObject.eote || ""}`,
        throughout: `${inputObject.eotb || ""}/${inputObject.bote || ""}`,
        begin_of_the_begin: iso.botb,
        end_of_the_begin: iso.eotb,
        begin_of_the_end: iso.bote,
        end_of_the_end: iso.eote
      }
    };
    if (url) {
      val.timespan.id = url;
    }
    return val;
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

  /**
   * Helper method for computing Begin of the Begin
   * @private
   * @param  {Object} obj   A date object
   * @return {Date}         The BOTB date
   */
  static _botb(obj) {
    const d = edtf(obj.botb).min;
    return new Date(d);
  }
  /**
   * Helper method for computing the End of the Beginning
   * @private
   * @param  {Object} obj   A date object
   * @return {Date}         The EOTB date
   */
  static _eotb(obj) {
    let d = edtf(obj.eotb).max;
    if (obj.bote && obj.eotb == obj.bote) {
      d = edtf(obj.eotb).min;
    }
    return new Date(d);
  }
  /**
   * Helper method for computing Begin of the End
   * @private
   * @param  {Object} obj   A date object
   * @return {Date}         The BOTE date
   */
  static _bote(obj) {
    let d = edtf(obj.bote).min;
    if (obj.eotb && obj.eotb == obj.bote) {
      d = edtf(obj.bote).max;
    }
    return new Date(d);
  }

  /**
   * Helper method for computing End of the End
   * @private
   * @param  {Object} obj   A date object
   * @return {Date}         The EOTE date
   */
  static _eote(obj) {
    const d = edtf(obj.eote).max;
    return new Date(d);
  }
}

export default DateHelpers;

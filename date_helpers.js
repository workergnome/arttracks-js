import edtf from "edtf";
if (!Date.prototype.toISOString) {
  (function() {
    function pad(number) {
      if (number < 10) {
        return "0" + number;
      }
      return number;
    }

    Date.prototype.toISOString = function() {
      return (
        this.getUTCFullYear() +
        "-" +
        pad(this.getUTCMonth() + 1) +
        "-" +
        pad(this.getUTCDate()) +
        "T" +
        pad(this.getUTCHours()) +
        ":" +
        pad(this.getUTCMinutes()) +
        ":" +
        pad(this.getUTCSeconds()) +
        "." +
        (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        "Z"
      );
    };
  })();
}

class DateHelpers {
  static createIsoDates(inputObject) {
    if (!inputObject) {
      return null;
    }
    let isoDates = {};

    if (inputObject.botb) {
      let date = edtf(inputObject.botb);
      isoDates.botb = new Date(date.min).toISOString();
    }
    if (inputObject.bote) {
      let date = edtf(inputObject.bote);
      isoDates.bote = new Date(date.min).toISOString();
    }
    if (inputObject.eotb) {
      let date = edtf(inputObject.eotb);
      isoDates.eotb = new Date(date.max).toISOString();
    }
    if (inputObject.eote) {
      let date = edtf(inputObject.eote);
      isoDates.eote = new Date(date.max).toISOString();
    }
    return isoDates;
  }
}

export default DateHelpers;

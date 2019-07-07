import nearley from "nearley";
import date_string_grammar from "./grammars/date_string_parser.js";
import DateHelpers from "./DateHelpers.js";

/**
 * Given a string describing an interval of time,
 * convert it into a representation of that interval.
 *
 * If the parsing is valid, it will return an object with five values:
 *
 *    {
 *      string: "the human-readable value of the interval.",
 *      edtf: {
 *        botb: "a EDTF representation of the earliest possible date",
 *        bote: "a EDTF representation of the earliest definite date",
 *        eotb: "a EDTF representation of the latest definite date",
 *        eote: "a EDTF representation of the latest possible date"
 *      },
 *      iso8061: {
 *        botb: "a ISO 8061 Datetime of the earliest possible date",
 *        bote: "a ISO 8061 Datetime of the earliest definite date",
 *        eotb: "a ISO 8061 Datetime of the latest definite date",
 *        eote: "a ISO 8061 Datetime of the latest possible date"
 *      },
 *      utc: {
 *        botb: "a javascript datestring  of the earliest possible date",
 *        bote: "a javascript datestring  of the earliest definite date",
 *        eotb: "a javascript datestring  of the latest definite date",
 *        eote: "a javascript datestring  of the latest possible date"
 *      },
 *      linked_art: "if a URL is provided, this will be a complex object describing \n
 *                   a CIDOC-CRM TimeSpan in the Linked.Art serialization". *
 *    }
 *
 * If the parsing is incomplete, it will return null.  This allows the parser to
 * be used on incomplete text strings.
 *
 * If the parser throws an error, it will return an `error` key:
 *
 *     {
 *       error: {
 *         name:    "the name of the error",
 *         message: "a string describing the error state",
 *         offset:  "the numeric offset of the first character that could not be parsed"
 *         token:   "the value of the first incorrect character"
 *       }
 *     }
 *
 * @param  {string}  string     A human-readable description of an interval of time
 * @param  {Object}  opts       Configuration options:
 * @param  {?string} opts.label A preferred label for the interval for use within
 *                              the Linked.Art representation.  This will be
 *                              auto-generated if not provided.
 * @param  {?url}    opts.url   A URL to provide as an ID for the Linked.Art
 *                              representation of the date.  If not provided, it
 *                              will not emit an Linked.Art representation of the
 *                              date.
 *
 * @return {Object}
 */

function parse_date(string, opts = {}) {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(date_string_grammar)
  );
  let results = null;
  try {
    parser.feed(string);
    const base_results = parser.results[0];
    if (base_results) {
      results = {
        string: DateHelpers.generateString(base_results),
        edtf: base_results,
        iso8061: DateHelpers.createIsoDates(base_results),
        utc: DateHelpers.createUTCDates(base_results)
      };
      if (opts.url) {
        results.linked_art = DateHelpers.createLinkedArt(
          base_results,
          opts.url,
          opts.label
        );
      }
    }
  } catch (e) {
    results = {
      error: {
        name: e.name,
        message: e.message,
        offset: e.offset,
        token: e.token
      }
    };
  }
  return results;
}

export { parse_date };

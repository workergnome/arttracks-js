import grammar from "./date_parser.js";
import nearley from "nearley";

describe("Date Parsing", () => {
  let parser = null;

  beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  });

  describe("Day Precision (default)", () => {
    it("works with days", () => {
      parser.feed("December 25th, 1990");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.month).toEqual(12);
      expect(results.day).toEqual(25);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with days w/o ordinals", () => {
      parser.feed("December 2, 1990");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.month).toEqual(12);
      expect(results.day).toEqual(2);
    });

    it("works with days w/o commas", () => {
      parser.feed("December 2 1990");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.month).toEqual(12);
      expect(results.day).toEqual(2);
    });
    it("works with uncertain days", () => {
      parser.feed("June 25th, 1990?");
      const results = parser.results[0];
      expect(results.certainty).toEqual(false);
    });
    it("works with eras", () => {
      parser.feed("June 25th, 1990 BCE");
      const results = parser.results[0];
      expect(results.era).toEqual("BCE");
    });
    it("works with AD eras", () => {
      parser.feed("June 25th, 1990 AD");
      const results = parser.results[0];
      expect(results.era).toEqual("CE");
    });
  });
  describe("Year Precision", () => {
    it("basic years work", () => {
      parser.feed("1990");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with uncertain years", () => {
      parser.feed("1990?");
      const results = parser.results[0];
      expect(results.certainty).toEqual(false);
    });
    it("works with BC", () => {
      parser.feed("1990 bc");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("BCE");
    });
    it("works with bce", () => {
      parser.feed("1990 BCE");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("BCE");
    });
    it("works with CE", () => {
      parser.feed("1990 CE");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("CE");
    });
    it("works with AD", () => {
      parser.feed("1990 ad");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("CE");
    });
    it("works with CE w/o whitespace", () => {
      parser.feed("1990CE");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("CE");
    });
    it("works with uncertain years w/o whitespace", () => {
      parser.feed("1990CE?");
      const results = parser.results[0];
      expect(results.year).toEqual(1990);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(false);
    });
  });
  describe("Century Precision", () => {
    it("works with centuries", () => {
      parser.feed("the 19th century");
      const results = parser.results[0];
      expect(results.century).toEqual(1800);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with centuries BCE", () => {
      parser.feed("the 1st century BCE");
      const results = parser.results[0];
      expect(results.century).toEqual(100);
      expect(results.era).toEqual("BCE");
    });
    it("works with the first century", () => {
      parser.feed("the 1st century CE");
      const results = parser.results[0];
      expect(results.century).toEqual(0);
      expect(results.era).toEqual("CE");
    });
    it("works with uncertain centuries", () => {
      parser.feed("the 19th century?");
      const results = parser.results[0];
      expect(results.certainty).toEqual(false);
    });
  });
  describe("Month Precision", () => {
    it("works with months", () => {
      parser.feed("January, 2018");
      const results = parser.results[0];
      expect(results.month).toEqual(1);
      expect(results.year).toEqual(2018);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with uncertain months", () => {
      parser.feed("September 2018?");
      const results = parser.results[0];
      expect(results.month).toEqual(9);
      expect(results.year).toEqual(2018);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(false);
    });
    it("works with months BCE", () => {
      parser.feed("November 2018 BCE");
      const results = parser.results[0];
      expect(results.month).toEqual(11);
      expect(results.year).toEqual(2018);
      expect(results.era).toEqual("BCE");
    });
    it("works with months w/o commas", () => {
      parser.feed("February 2018");
      const results = parser.results[0];
      expect(results.month).toEqual(2);
      expect(results.year).toEqual(2018);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with abbreviated months", () => {
      parser.feed("Mar. 2018");
      const results = parser.results[0];
      expect(results.month).toEqual(3);
    });
    it("works with abbreviated months without periods", () => {
      parser.feed("Apr 2018");
      const results = parser.results[0];
      expect(results.month).toEqual(4);
    });
    // do we want this to fail?
    it("works with abbreviated months and commas. ", () => {
      parser.feed("Jun., 2018");
      const results = parser.results[0];
      expect(results.month).toEqual(6);
    });
    it("does not work with 'May.'. ", () => {
      expect(() => parser.feed("May. 2018")).toThrow();
    });
  });
  describe("Decade Precision", () => {
    it("works with decades", () => {
      parser.feed("the 1990s");
      const results = parser.results[0];
      expect(results.decade).toEqual(1990);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works without a 'the'", () => {
      parser.feed("1990s");
      const results = parser.results[0];
      expect(results.decade).toEqual(1990);
    });
    it("works with undertainty'", () => {
      parser.feed("1990s?");
      const results = parser.results[0];
      expect(results.decade).toEqual(1990);
      expect(results.certainty).toEqual(false);
    });
    it("works with BCE'", () => {
      parser.feed("1990s BCE");
      const results = parser.results[0];
      expect(results.decade).toEqual(1990);
      expect(results.era).toEqual("BCE");
    });
  });
  describe("Euro Dates", () => {
    it("works with standard euro date", () => {
      parser.feed("17 October 1980");
      const results = parser.results[0];
      expect(results.year).toEqual(1980);
      expect(results.month).toEqual(10);
      expect(results.day).toEqual(17);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with abbrev. months", () => {
      parser.feed("17 Oct. 1980");
      const results = parser.results[0];
      expect(results.year).toEqual(1980);
      expect(results.month).toEqual(10);
      expect(results.day).toEqual(17);
    });
    it("works with uncertainty", () => {
      parser.feed("17 Oct. 1980?");
      const results = parser.results[0];
      expect(results.certainty).toEqual(false);
    });
    it("works with BC", () => {
      parser.feed("17 Oct. 1980 BC");
      const results = parser.results[0];
      expect(results.era).toEqual("BCE");
    });
    it("works with leading zero", () => {
      parser.feed("07 Oct. 1980");
      const results = parser.results[0];
      expect(results.day).toEqual(7);
    });
  });
  describe("Slash Dates", () => {
    it("works with slash dates", () => {
      parser.feed("10/17/1980");
      const results = parser.results[0];
      expect(results.year).toEqual(1980);
      expect(results.month).toEqual(10);
      expect(results.day).toEqual(17);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with uncertainty", () => {
      parser.feed("10/17/1980?");
      const results = parser.results[0];
      expect(results.certainty).toEqual(false);
    });
    it("works with single digit months", () => {
      parser.feed("1/17/1980");
      const results = parser.results[0];
      expect(results.month).toEqual(1);
    });
    it("works with leading zeros in the month", () => {
      parser.feed("01/17/1980");
      const results = parser.results[0];
      expect(results.month).toEqual(1);
    });
    it("works with leading zeros in the day", () => {
      parser.feed("1/01/1980");
      const results = parser.results[0];
      expect(results.day).toEqual(1);
    });
    it("does not work with invalid months", () => {
      expect(() => parser.feed("20/17/1980")).toThrow();
    });
    it("does not work with invalid months that start with 1", () => {
      expect(() => parser.feed("13/17/1980")).toThrow();
    });
    it("does not work with ordinal days", () => {
      expect(() => parser.feed("10/5th/17")).toThrow();
    });
  });

  describe("ISO Dates", () => {
    it("works with ISO dates", () => {
      parser.feed("1980-10-17");
      const results = parser.results[0];
      expect(results.year).toEqual(1980);
      expect(results.month).toEqual(10);
      expect(results.day).toEqual(17);
      expect(results.era).toEqual("CE");
      expect(results.certainty).toEqual(true);
    });
    it("works with ISO dates BCE", () => {
      parser.feed("-1980-10-17");
      const results = parser.results[0];
      expect(results.year).toEqual(1980);
      expect(results.month).toEqual(10);
      expect(results.day).toEqual(17);
      expect(results.era).toEqual("BCE");
      expect(results.certainty).toEqual(true);
    });
    it("works with leading zeros in the day", () => {
      parser.feed("1980-10-01");
      const results = parser.results[0];
      expect(results.day).toEqual(1);
    });
    it("works w/o leading zeros in the day", () => {
      parser.feed("1980-10-1");
      const results = parser.results[0];
      expect(results.day).toEqual(1);
    });
    it("works with leading zeros in the month", () => {
      parser.feed("1980-1-01");
      const results = parser.results[0];
      expect(results.month).toEqual(1);
    });
    it("works w/o leading zeros in the month", () => {
      parser.feed("1980-01-01");
      const results = parser.results[0];
      expect(results.month).toEqual(1);
    });
    it("does not work with invalid months", () => {
      expect(() => parser.feed("1980-20-17")).toThrow();
    });
    it("does not work with invalid months that start with 1", () => {
      expect(() => parser.feed("1980-13-17")).toThrow();
    });
  });
});

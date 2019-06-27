import grammar from "./date_string_parser.js";
import nearley from "nearley";

describe("Date Parsing", () => {
  let parser = null;

  beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  });
  describe("EDTF Support", () => {
    it("handles day precision", () => {
      parser.feed("July 1, 2019");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-01");
    });
    it("handles month precision", () => {
      parser.feed("July 2019");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-XX");
    });
    it("handles month precision", () => {
      parser.feed("July 2019");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-XX");
    });
    it("handles year precision", () => {
      parser.feed("2019");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-XX-XX");
    });
    it("handles decade precision", () => {
      parser.feed("the 2010s");
      const results = parser.results[0];
      expect(results.botb).toBe("201X-XX-XX");
    });
    it("handles century precision", () => {
      parser.feed("the 21st century");
      const results = parser.results[0];
      expect(results.botb).toBe("20XX-XX-XX");
    });
    it("handles uncertainty", () => {
      parser.feed("July 1, 2019?");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-01?");
    });
    it("handles BCE", () => {
      parser.feed("2000 BCE");
      const results = parser.results[0];
      expect(results.botb).toBe("-2000-XX-XX");
    });
  });

  describe("Date Phrases", () => {
    describe("Bare Dates", () => {
      it("works with a bare year", () => {
        parser.feed("2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-XX-XX");
        expect(results.eotb).toBe("2019-XX-XX");
      });
      it("works with a bare complete date", () => {
        parser.feed("January 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-01-01");
        expect(results.eotb).toBe("2019-01-01");
        expect(results.bote).toBe("2019-01-01");
        expect(results.eote).toBe("2019-01-01");
      });
    });
    describe("Complex 4-date phrases", () => {
      it("handles '1995 until 1996 '", () => {
        parser.feed("1995 until 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1996-XX-XX");
      });

      it("handles '1995 until sometime between 1996 and 1997'", () => {
        parser.feed("1995 until sometime between 1996 and 1997");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1997-XX-XX");
      });

      it("handles 'sometime between 1995 and 1996 until 1997'", () => {
        parser.feed("sometime between 1995 and 1996 until 1997");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1996-XX-XX");
        expect(results.bote).toBe("1997-XX-XX");
        expect(results.eote).toBe("1997-XX-XX");
      });

      it("handles 'sometime between 1995 and 1996 until sometime between 1997 and 1998'", () => {
        parser.feed(
          "sometime between 1995 and 1996 until sometime between 1997 and 1998"
        );
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1996-XX-XX");
        expect(results.bote).toBe("1997-XX-XX");
        expect(results.eote).toBe("1998-XX-XX");
      });
    });

    describe("Complex 3-date phrases", () => {
      it("handles 1995 until at least 1996", () => {
        parser.feed("1995 until at least 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBeUndefined();
      });

      it("handles 'sometime between 1995 and 1996 until at least 1996'", () => {
        parser.feed("sometime between 1995 and 1996 until at least 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1996-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBeUndefined();
      });

      it("handles 'sometime between 1995 and 1996 until at least 1997'", () => {
        parser.feed("sometime between 1995 and 1996 until at least 1997");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1996-XX-XX");
        expect(results.bote).toBe("1997-XX-XX");
        expect(results.eote).toBeUndefined();
      });

      it("handles '1995 until sometime before 1996'", () => {
        parser.feed("1995 until sometime before 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBeUndefined();
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'sometime between 1995 and 1996 until sometime before 1997'", () => {
        parser.feed(
          "sometime between 1995 and 1996 until sometime before 1997"
        );
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBe("1996-XX-XX");
        expect(results.bote).toBeUndefined();
        expect(results.eote).toBe("1997-XX-XX");
      });
      it("handles 'by 1995 until 1996'", () => {
        parser.feed("by 1995 until 1996");
        const results = parser.results[0];
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'in 1995 until sometime before 1996'", () => {
        parser.feed("in 1995 until sometime before 1996");
        const results = parser.results[0];
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1995-XX-XX");
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'by 1995 until sometime between 1996 and 1997'", () => {
        parser.feed("by 1995 until sometime between 1996 and 1997");
        const results = parser.results[0];
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1997-XX-XX");
      });
      it("handles 'after 1995 until 1996'", () => {
        parser.feed("after 1995 until 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBeUndefined();
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'after 1995 until sometime between 1996 and 1997'", () => {
        parser.feed("after 1995 until sometime between 1996 and 1997");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBeUndefined();
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBe("1997-XX-XX");
      });
    });

    describe("Complex 2-date phrases", () => {
      it("handles 'by 1995 until sometime before 1996'", () => {
        parser.feed("by 1995 until sometime before 1996");
        const results = parser.results[0];
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBeUndefined();
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'by 1995 until at least 1996'", () => {
        parser.feed("by 1995 until at least 1996");
        const results = parser.results[0];
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBe("1995-XX-XX");
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBeUndefined();
      });
      it("handles 'after 1995 until sometime before 1996'", () => {
        parser.feed("after 1995 until sometime before 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBeUndefined();
        expect(results.bote).toBeUndefined();
        expect(results.eote).toBe("1996-XX-XX");
      });
      it("handles 'after 1995 until at least 1996'", () => {
        parser.feed("after 1995 until at least 1996");
        const results = parser.results[0];
        expect(results.botb).toBe("1995-XX-XX");
        expect(results.eotb).toBeUndefined();
        expect(results.bote).toBe("1996-XX-XX");
        expect(results.eote).toBeUndefined();
      });
    });

    describe("Until dates", () => {
      it("works with 'until'", () => {
        parser.feed("until July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBeUndefined();
        expect(results.botb).toBeUndefined();
        expect(results.bote).toBe("2019-07-01");
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'Until'", () => {
        parser.feed("Until July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBe("2019-07-01");
        expect(results.eote).toBe("2019-07-01");
      });
    });
    describe("Before dates", () => {
      it("works with 'before'", () => {
        parser.feed("until before July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBeUndefined();
        expect(results.botb).toBeUndefined();
        expect(results.eotb).toBeUndefined();
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'no later than'", () => {
        parser.feed("until no later than July 1, 2019");
        const results = parser.results[0];
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'sometime no later than'", () => {
        parser.feed("until sometime no later than July 1, 2019");
        const results = parser.results[0];
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'sometime before'", () => {
        parser.feed("until sometime before July 1, 2019");
        const results = parser.results[0];
        expect(results.eote).toBe("2019-07-01");
      });
    });
    describe("Throughout dates", () => {
      it("works with 'throughout'", () => {
        parser.feed("throughout July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
        expect(results.bote).toBe("2019-07-01");
      });
      it("works with 'Throughout'", () => {
        parser.feed("Throughout July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
        expect(results.bote).toBe("2019-07-01");
      });
      it("works with 'in'", () => {
        parser.feed("in July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
        expect(results.bote).toBe("2019-07-01");
      });
      it("works with 'In'", () => {
        parser.feed("In July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
        expect(results.bote).toBe("2019-07-01");
      });
    });
    describe("By dates", () => {
      it("works with 'by'", () => {
        parser.feed("by July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
      });
      it("works with 'By'", () => {
        parser.feed("By July 1, 2019");
        const results = parser.results[0];
        expect(results.eotb).toBe("2019-07-01");
      });
    });
    describe("Starting Between dates", () => {
      it("works with 'Between'", () => {
        parser.feed("Between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-06-01");
        expect(results.eotb).toBe("2019-07-01");
      });
      it("works with 'between'", () => {
        parser.feed("between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-06-01");
        expect(results.eotb).toBe("2019-07-01");
      });
      it("works with 'sometime between'", () => {
        parser.feed("sometime between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-06-01");
        expect(results.eotb).toBe("2019-07-01");
      });
      it("works with ampersands", () => {
        parser.feed("between June 1, 2019 & July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-06-01");
        expect(results.eotb).toBe("2019-07-01");
      });
    });
    describe("Ending Between dates", () => {
      it("works with 'Between'", () => {
        parser.feed("until between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBe("2019-06-01");
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'between'", () => {
        parser.feed("until between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBe("2019-06-01");
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with 'sometime between'", () => {
        parser.feed("until sometime between June 1, 2019 and July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBe("2019-06-01");
        expect(results.eote).toBe("2019-07-01");
      });
      it("works with ampersands", () => {
        parser.feed("until between June 1, 2019 & July 1, 2019");
        const results = parser.results[0];
        expect(results.bote).toBe("2019-06-01");
        expect(results.eote).toBe("2019-07-01");
      });
    });
    describe("After dates", () => {
      it("works with 'after'", () => {
        parser.feed("after July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-07-01");
      });
      it("works with 'After'", () => {
        parser.feed("After July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-07-01");
      });
      it("works with 'sometime after'", () => {
        parser.feed("sometime after July 1, 2019");
        const results = parser.results[0];
        expect(results.botb).toBe("2019-07-01");
      });
      it("fails with strange capitalization", () => {
        expect(() => parser.feed("aFter July 2020")).toThrow();
      });
    });
  });

  describe("on dates", () => {
    it("works with precise dates", () => {
      parser.feed("on July 1, 2019");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-01");
      expect(results.bote).toBe("2019-07-01");
      expect(results.eotb).toBe("2019-07-01");
      expect(results.eote).toBe("2019-07-01");
    });
    it("works with precise uncertain dates", () => {
      parser.feed("on July 1, 2019?");
      const results = parser.results[0];
      expect(results.botb).toBe("2019-07-01?");
    });
    it("works with precise BCE dates", () => {
      parser.feed("on July 1, 2019 BCE");
      const results = parser.results[0];
      expect(results.botb).toBe("-2019-07-01");
    });
    it("fails with imprecise dates", () => {
      expect(() => parser.feed("on July 2020")).toThrow();
    });
  });

  describe("no date", () => {
    it("works blank strings", () => {
      parser.feed("");
      const results = parser.results[0];
      expect(results).toBeNull();
    });
    it("works with explicit string", () => {
      parser.feed("no date");
      const results = parser.results[0];
      expect(results).toBeNull();
    });
    it("fails with garbage strings", () => {
      expect(() => parser.feed("nonsense")).toThrow();
    });
  });
});

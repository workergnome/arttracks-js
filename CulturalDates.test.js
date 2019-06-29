import CulturalDates from "./CulturalDates.js";
import edtf from "edtf";

describe("edtf tests", () => {
  it("parses masked decades", () => {
    expect(edtf("199?").edtf).toEqual("199?");
  });
  it("parses masked centuries", () => {
    expect(edtf("19?").edtf).toEqual("19?");
  });
});

describe("CulturalDates.js", () => {
  let cd = null;
  beforeEach(() => {
    cd = new CulturalDates();
  });

  //----------------------------------------------------------------------------
  describe("Basic Configuration", () => {
    it("can be instantiated as a class", () => {
      expect(typeof cd).toEqual("object");
    });
  });

  // ----------------------------------------------------------------------------
  describe("Ordinalization", () => {
    it("it creates 'sts'", () => {
      const data = { botb: "00" };
      expect(cd.parse(data)).toContain("1st");
    });
    it("it creates 'nds'", () => {
      const data = { botb: "01" };
      expect(cd.parse(data)).toContain("2nd");
    });
    it("it creates 'rds'", () => {
      const data = { botb: "02" };
      expect(cd.parse(data)).toContain("3rd");
    });
    it("it creates 'ths'", () => {
      const data = { botb: "03" };
      expect(cd.parse(data)).toContain("4th");
    });
    it("it handles teens", () => {
      let data = { botb: "10" };
      expect(cd.parse(data)).toContain("11th");
      data = { botb: "11" };
      expect(cd.parse(data)).toContain("12th");
      data = { botb: "12" };
      expect(cd.parse(data)).toContain("13th");
    });
  });

  // ----------------------------------------------------------------------------
  describe("Date parsing", () => {
    it("does nothing without date elements", () => {
      const data = {};
      expect(cd.parse(data)).toBe(null);
    });

    it("does returns 'no date' with blank date elements", () => {
      const data = {
        botb: null,
        eotb: null,
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("no date");
    });

    it("does nothing with invalid date elements", () => {
      const data = {
        botb: "not a date",
        eotb: null,
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toBe(null);
    });

    it("handles basic dates", () => {
      const data = {
        botb: "1980-02-14",
        eotb: "1980-02-14",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("February 14, 1980");
    });
    it("handles basic dates BCE", () => {
      const data = {
        botb: "-1980-02-14",
        eotb: "-1980-02-14",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("February 14, 1980 BCE");
    });
    it("handles basic dates", () => {
      const data = {
        botb: "1980-02-14",
        eotb: "1980-02-14",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("February 14, 1980");
    });
    it("handles uncertain basic dates", () => {
      const data = {
        botb: "1980-02-14?",
        eotb: "1980-02-14?",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("February 14, 1980?");
    });
    it("handles uncertain basic dates BCE", () => {
      const data = {
        botb: "-1980-02-14?",
        eotb: "-1980-02-14?",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("February 14, 1980 BCE?");
    });

    it("handles 'throughout 1980'", () => {
      const data = {
        botb: null,
        eotb: "1980",
        bote: "1980",
        eote: null
      };
      expect(cd.parse(data)).toContain("throughout 1980");
    });
    it("handles throughout, until case", () => {
      const data = {
        botb: null,
        eotb: "1980",
        bote: "1980",
        eote: "1990"
      };
      expect(cd.parse(data)).toContain(
        "throughout 1980 until no later than 1990"
      );
    });
    it("handles 'on' case", () => {
      const data = {
        botb: "1980-02-14",
        eotb: "1980-02-14",
        bote: "1980-02-14",
        eote: "1980-02-14"
      };
      expect(cd.parse(data)).toContain("on February 14, 1980");
    });

    it("handles 'during' case with months", () => {
      const data = {
        botb: "1980-02",
        eote: "1980-02"
      };
      expect(cd.parse(data)).toContain("sometime during February 1980");
    });
    it("handles 'during' case with decades", () => {
      const data = {
        botb: "198",
        eote: "198"
      };
      expect(cd.parse(data)).toContain("during the 1980s");
    });

    it("handles 'during' case with centuries", () => {
      const data = {
        botb: "19",
        eote: "19"
      };
      expect(cd.parse(data)).toContain("during the 20th century");
    });

    it("handles basic until dates", () => {
      const data = {
        botb: null,
        eotb: null,
        bote: "1980-02-14",
        eote: "1980-02-14"
      };
      expect(cd.parse(data)).toContain("until February 14, 1980");
    });
    it("handles basic x until y dates", () => {
      const data = {
        botb: "1970",
        eotb: "1970",
        bote: "1980-02-14",
        eote: "1980-02-14"
      };
      expect(cd.parse(data)).toContain("1970 until February 14, 1980");
    });
    it("handles basic x until y dates", () => {
      const data = {
        botb: "-1970",
        eotb: "-1970",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("1970 BCE");
    });

    it("handles botb dates", () => {
      const data = {
        botb: "1980-02-14",
        eotb: null,
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("after February 14, 1980");
    });
    it("handles eotb dates", () => {
      const data = {
        botb: null,
        eotb: "1980-02-14",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("by February 14, 1980");
    });
    it("handles bote dates", () => {
      const data = {
        botb: null,
        eotb: null,
        bote: "1980-02-14",
        eote: null
      };
      expect(cd.parse(data)).toContain("until at least February 14, 1980");
    });
    it("handles eote dates", () => {
      const data = {
        botb: null,
        eotb: null,
        bote: null,
        eote: "1980-02-14"
      };
      expect(cd.parse(data)).toContain("until no later than February 14, 1980");
    });
    it("handles botb & eotb dates", () => {
      const data = {
        botb: "1980-02-14",
        eotb: "1990",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain(
        "sometime between February 14, 1980 and 1990"
      );
    });
    it("handles bote & eote dates", () => {
      const data = {
        botb: null,
        eotb: null,
        bote: "1980-02-14",
        eote: "1990"
      };
      expect(cd.parse(data)).toContain(
        "until sometime between February 14, 1980 and 1990"
      );
    });
    it("handles decades", () => {
      const data = {
        botb: "198",
        eotb: "198",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 1980s");
    });
    it("handles decades", () => {
      const data = {
        botb: "198?",
        eotb: "198?",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 1980s?");
    });
    it("handles centuries", () => {
      const data = {
        botb: "19",
        eotb: "19",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 20th century");
    });
    it("handles uncertain centuries", () => {
      const data = {
        botb: "19?",
        eotb: "19?",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 20th century?");
    });

    it("shows CE for dates less than 1000 CE", () => {
      const data = {
        botb: "0100",
        eotb: "0100",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("100 CE");
    });
    it("doesn't show CE for dates greater than 1000 CE", () => {
      const data = {
        botb: "1000",
        eotb: "1000",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("100");
    });

    it("handles centuries BCE", () => {
      const data = {
        botb: "-01",
        eotb: "-01",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 1st century BCE");
    });
    it("handles the zeroth century", () => {
      const data = {
        botb: "00",
        eotb: "00",
        bote: null,
        eote: null
      };
      expect(cd.parse(data)).toContain("the 1st century");
    });
  });
});

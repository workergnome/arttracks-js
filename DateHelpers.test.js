import DateHelpers from "./DateHelpers.js";

describe("Linked.Art generation", () => {
  let expected = null;
  let url = "http://example.org/timespan";
  beforeEach(() => {
    expected = {
      timespan: {
        id: "http://example.org/timespan",
        type: "TimeSpan"
      }
    };
  });

  it("returns null when passed null", () => {
    expect(DateHelpers.createLinkedArt(null)).toBeNull();
  });
  it("returns a valid botb date", () => {
    let val = { botb: "2000-XX-XX" };
    const results = DateHelpers.createLinkedArt(val, url);
    expected.timespan.begin_of_the_begin = "2000-01-01T00:00:00.000Z";
    expect(results).toMatchObject(expected);
  });
});

describe("ISO generation", () => {
  it("returns null when passed null", () => {
    expect(DateHelpers.createIsoDates(null)).toBeNull();
  });
  it("returns a valid botb date", () => {
    const results = DateHelpers.createIsoDates({ botb: "2000-XX-XX" });
    expect(results.botb).toBe("2000-01-01T00:00:00.000Z");
  });
  it("returns a valid eotb date", () => {
    const results = DateHelpers.createIsoDates({ eotb: "2000-XX-XX" });
    expect(results.eotb).toBe("2000-12-31T23:59:59.999Z");
  });
  it("returns a valid bote date", () => {
    const results = DateHelpers.createIsoDates({ bote: "2000-XX-XX" });
    expect(results.bote).toBe("2000-01-01T00:00:00.000Z");
  });
  it("returns a valid eote date", () => {
    const results = DateHelpers.createIsoDates({ eote: "2000-XX-XX" });
    expect(results.eote).toBe("2000-12-31T23:59:59.999Z");
  });
});

describe("internal 0-duration intervals", () => {
  it("handles overlapping decades", () => {
    const results = DateHelpers.createIsoDates({ bote: "2000", eotb: "2000" });
    expect(results.eotb).toBe("2000-01-01T00:00:00.000Z");
    expect(results.bote).toBe("2000-12-31T23:59:59.999Z");
  });
});

describe("UTC generation", () => {
  it("returns null when passed null", () => {
    expect(DateHelpers.createUTCDates(null)).toBeNull();
  });
  it("returns a valid botb date", () => {
    const results = DateHelpers.createUTCDates({ botb: "1990-XX-XX" });
    expect(results.botb).toBe("Mon, 01 Jan 1990 00:00:00 GMT");
  });
  it("returns a valid eotb date", () => {
    const results = DateHelpers.createUTCDates({ eotb: "1990-XX-XX" });
    expect(results.eotb).toBe("Mon, 31 Dec 1990 23:59:59 GMT");
  });
  it("returns a valid bote date", () => {
    const results = DateHelpers.createUTCDates({ bote: "1991-XX-XX" });
    expect(results.bote).toBe("Tue, 01 Jan 1991 00:00:00 GMT");
  });
  it("returns a valid eote date", () => {
    const results = DateHelpers.createUTCDates({ eote: "1991-XX-XX" });
    expect(results.eote).toBe("Tue, 31 Dec 1991 23:59:59 GMT");
  });
});

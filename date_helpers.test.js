import DateHelpers from "./date_helpers.js";

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

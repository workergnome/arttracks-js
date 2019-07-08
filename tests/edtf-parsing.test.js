import edtf from "edtf";

// These test implementation details in the underlying EDTF library:
// fixing them require pull requests to the upstream project.
describe("edtf tests", () => {
  it("parses uncertain masked decades", () => {
    expect(edtf("199?").edtf).toEqual("199?");
  });
  it("parses masked centuries", () => {
    expect(edtf("19?").edtf).toEqual("19?");
  });
  it.skip("parses uncertain masked decades", () => {
    expect(edtf("199X?").edtf).toEqual("199X?");
  });
  it.skip("parses masked centuries", () => {
    expect(edtf("19XX?").edtf).toEqual("19XX?");
  });
});

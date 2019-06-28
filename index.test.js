import { parse_date } from "./index.js";

it("parses dates and returns edtf", () => {
  const results = parse_date("by July 1, 2019");
  expect(results.edtf.eotb).toEqual("2019-07-01");
});

it("parses dates and returns valid iso8061 dates", () => {
  const results = parse_date("by July 1, 2019");
  expect(results.iso8061.eotb).toEqual("2019-07-01T23:59:59.999Z");
});
describe("Linked.Art", () => {
  it("does not produce linked.art without a URL", () => {
    const results = parse_date("by July 1, 2019");
    expect(results.linked_art).toBeUndefined();
  });
  it("produces linked.art with a URL", () => {
    const results = parse_date("by July 1, 2019", {
      url: "http://example.com/ts"
    });
    expect(results.linked_art).not.toBeUndefined();
  });
  it("produces valid linked.art", () => {
    const results = parse_date("by July 1, 2019", {
      url: "http://example.com/ts"
    });
    expect(results.linked_art.timespan.end_of_the_begin).toEqual(
      "2019-07-01T23:59:59.999Z"
    );
  });
});
it("returns an error message for bad dates", () => {
  const results = parse_date("spaghetti");
  expect(results.error).not.toBeNull();
});

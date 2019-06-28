import { parse_date } from "./index.js";

it("parses dates", () => {
  const results = parse_date("by July 1, 2019");
  expect(results.eotb).toEqual("2019-07-01");
});

it("returns an error message for bad dates", () => {
  const results = parse_date("spaghetti");
  expect(results.error).not.toBeNull();
});

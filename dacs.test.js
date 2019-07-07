import { parse_date } from "./index.js";

const DACS_EXAMPLES = [
  "undated",
  "1968",
  "1805",
  "1776",
  "1975",
  "1890s",
  "1906 March 17",
  "approximately 1925",
  "circa August 1975",
  "1980-2001",
  "1849-1851",
  "1934-1985",
  "1945-1960",
  "1950-1955",
  "before 1867",
  "after 1867 January 5",
  "approximately 1952-1978"
  // "1975 March-August",
  // "1801,1929",
  // "1975, 2002",
  // "1785-1960, bulk 1916-1958",
  // "1942-1998, predominant 1975-1991",
  // "1827, 1952-1978",
  // "circa 1870-1879",
  // "probably 1867",
  // "1892 or 1893",
];

for (let date of DACS_EXAMPLES) {
  it(`works correctly with ${date}`, () => {
    const results = parse_date(date);
    expect(results.edtf).not.toBeUndefined();
  });
}

import { describe, expect, it } from "vitest";
import { toInteger } from "./validation.ts";

describe("toInteger", () => {
  it.each([
    { text: "0", expected: 0 },
    { text: "7", expected: 7 },
    { text: "007", expected: 7 },
    { text: "-1", expected: undefined },
    { text: "+3", expected: undefined },
    { text: "1.5", expected: undefined },
    { text: "FIVE", expected: undefined },
    { text: "", expected: undefined },
    { text: undefined, expected: undefined },
  ])("converts $text to $expected", ({ text, expected }) => {
    expect(toInteger(text)).toBe(expected);
  });
});

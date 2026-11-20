import { describe, expect, it } from "vitest";
import { Instruction, Orientation } from "../domain/index.ts";
import { isInRange, isInstruction, isOrientation, toInteger } from "./validation.ts";

describe("toInteger", () => {
  it.each([
    { text: "0", expected: 0 },
    { text: "7", expected: 7 },
    { text: "-1", expected: -1 },
    { text: "1.5", expected: undefined },
    { text: "FIVE", expected: undefined },
    { text: undefined, expected: undefined },
  ])("converts $text to $expected", ({ text, expected }) => {
    expect(toInteger(text)).toBe(expected);
  });
});

describe("isInRange", () => {
  it.each([
    { value: 0, max: 50, expected: true },
    { value: 25, max: 50, expected: true },
    { value: 50, max: 50, expected: true },
    { value: -1, max: 50, expected: false },
    { value: 51, max: 50, expected: false },
  ])("returns $expected for $value with a max of $max", ({ value, max, expected }) => {
    expect(isInRange(value, max)).toBe(expected);
  });
});

describe("isOrientation", () => {
  it.each([
    ...Object.values(Orientation).map((value) => ({ value, expected: true })),
    { value: "n", expected: false },
    { value: "NE", expected: false },
    { value: "", expected: false },
    { value: undefined, expected: false },
  ])("returns $expected for $value", ({ value, expected }) => {
    expect(isOrientation(value)).toBe(expected);
  });
});

describe("isInstruction", () => {
  it.each([
    ...Object.values(Instruction).map((value) => ({ value, expected: true })),
    { value: "l", expected: false },
    { value: "Left", expected: false },
    { value: "", expected: false },
  ])("returns $expected for $value", ({ value, expected }) => {
    expect(isInstruction(value)).toBe(expected);
  });
});

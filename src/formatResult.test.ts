import { describe, expect, it } from "vitest";
import { Orientation } from "./domain/index.ts";
import { formatResult } from "./formatResult.ts";

describe("formatResult", () => {
  it.each([
    { position: { x: 1, y: 1, orientation: Orientation.E }, isLost: false, expected: "1 1 E" },
    { position: { x: 3, y: 3, orientation: Orientation.N }, isLost: true, expected: "3 3 N LOST" },
  ])("formats $expected", ({ position, isLost, expected }) => {
    expect(formatResult({ position, isLost })).toBe(expected);
  });
});

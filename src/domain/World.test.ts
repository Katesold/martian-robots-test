import { describe, expect, it } from "vitest";
import { isInWorld } from "./World.ts";

describe("isInWorld", () => {
  it.each([
    { x: 0, y: 0, expected: true },
    { x: 5, y: 3, expected: true },
    { x: -1, y: 0, expected: false },
    { x: 6, y: 3, expected: false },
  ])("$x,$y is in a 5 by 3 world: $expected", ({ x, y, expected }) => {
    expect(isInWorld({ maxX: 5, maxY: 3 }, { x, y })).toBe(expected);
  });
});

import { describe, expect, it } from "vitest";
import { getLeftOrientation, getRightOrientation, Orientation } from "./Orientation.ts";

const { N, E, S, W } = Orientation;

describe("getLeftOrientation and getRightOrientation", () => {
  it.each([
    { from: N, left: W, right: E },
    { from: E, left: N, right: S },
    { from: S, left: E, right: W },
    { from: W, left: S, right: N },
  ])("from $from turns left to $left and right to $right", ({ from, left, right }) => {
    expect(getLeftOrientation(from)).toBe(left);
    expect(getRightOrientation(from)).toBe(right);
  });
});

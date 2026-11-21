import { describe, expect, it } from "vitest";
import { World } from "./World.ts";

describe("World", () => {
  it.each([
    { x: 0, y: 0, expected: true },
    { x: 5, y: 3, expected: true },
    { x: -1, y: 0, expected: false },
    { x: 6, y: 3, expected: false },
    { x: 5, y: 4, expected: false },
  ])("$x,$y is in a 5 by 3 world: $expected", ({ x, y, expected }) => {
    expect(new World({ maxX: 5, maxY: 3 }).contains({ x, y })).toBe(expected);
  });

  it("remembers a scent only at the point it was left", () => {
    const world = new World({ maxX: 5, maxY: 3 });

    world.leaveScent({ x: 1, y: 3 });

    expect(world.hasScent({ x: 1, y: 3 })).toBe(true);
    expect(world.hasScent({ x: 3, y: 1 })).toBe(false);
  });
});

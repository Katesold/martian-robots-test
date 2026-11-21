import { describe, expect, it } from "vitest";
import { World } from "./World.ts";

describe("World", () => {
  it.each([
    { x: 0, y: 0, expected: true },
    { x: 5, y: 3, expected: true },
    { x: 2, y: 1, expected: true },
    { x: -1, y: 0, expected: false },
    { x: 0, y: -1, expected: false },
    { x: 6, y: 3, expected: false },
    { x: 5, y: 4, expected: false },
  ])("contains $x,$y: $expected", ({ x, y, expected }) => {
    expect(new World(5, 3).contains({ x, y })).toBe(expected);
  });

  it("remembers scents by grid point", () => {
    const world = new World(5, 3);

    world.leaveScent({ x: 3, y: 3 });

    expect(world.hasScent({ x: 3, y: 3 })).toBe(true);
    expect(world.hasScent({ x: 3, y: 2 })).toBe(false);
    expect(world.hasScent({ x: 2, y: 3 })).toBe(false);
  });
});

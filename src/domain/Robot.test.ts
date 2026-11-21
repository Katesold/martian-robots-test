import { describe, expect, it } from "vitest";
import { Orientation } from "./Orientation.ts";
import { Robot } from "./Robot.ts";

const { N, E, S, W } = Orientation;

describe("Robot", () => {
  it.each([
    { orientation: N, expected: { x: 1, y: 3, orientation: N } },
    { orientation: E, expected: { x: 2, y: 2, orientation: E } },
    { orientation: S, expected: { x: 1, y: 1, orientation: S } },
    { orientation: W, expected: { x: 0, y: 2, orientation: W } },
  ])("facing $orientation, looks one step ahead without moving", ({ orientation, expected }) => {
    const robot = new Robot({ x: 1, y: 2, orientation });

    expect(robot.nextPosition()).toEqual(expected);
    expect(robot.position).toEqual({ x: 1, y: 2, orientation });
  });
});

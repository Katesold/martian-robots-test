import { describe, expect, it } from "vitest";
import { Orientation } from "./domain/index.ts";
import { moveForward, turnRight } from "./instructions/index.ts";
import { runRobotPrograms } from "./runRobotPrograms.ts";

const { N, E, S } = Orientation;
const F = moveForward;
const R = turnRight;
const bounds = { maxX: 5, maxY: 3 };

describe("runRobotPrograms", () => {
  it("protects later robots at a point where an earlier one was lost", () => {
    const programs = [
      { start: { x: 5, y: 3, orientation: N }, instructions: [F] },
      { start: { x: 5, y: 3, orientation: E }, instructions: [F, R, F] },
    ];

    expect(runRobotPrograms(bounds, programs)).toEqual([
      { position: { x: 5, y: 3, orientation: N }, isLost: true },
      { position: { x: 5, y: 2, orientation: S }, isLost: false },
    ]);
  });
});

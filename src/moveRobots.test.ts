import { describe, expect, it } from "vitest";
import { type Instruction, Orientation } from "./domain/index.ts";
import { moveForward, turnRight } from "./instructions/index.ts";
import { moveRobots } from "./moveRobots.ts";

const { N, E, S } = Orientation;
const F = moveForward;
const R = turnRight;
const world = { maxX: 5, maxY: 3 };

describe("moveRobots", () => {
  it("keeps a robot with no instructions where it started", () => {
    const robots = [{ start: { x: 1, y: 1, orientation: E }, instructions: [] }];

    expect(moveRobots(world, robots)).toEqual([
      { position: { x: 1, y: 1, orientation: E }, isLost: false },
    ]);
  });

  it("protects later robots at a point where an earlier one was lost", () => {
    const robots = [
      { start: { x: 5, y: 3, orientation: N }, instructions: [F] },
      { start: { x: 5, y: 3, orientation: E }, instructions: [F, R, F] },
    ];

    expect(moveRobots(world, robots)).toEqual([
      { position: { x: 5, y: 3, orientation: N }, isLost: true },
      { position: { x: 5, y: 2, orientation: S }, isLost: false },
    ]);
  });

  it("only protects the exact point the scent was left on", () => {
    const robots = [
      { start: { x: 3, y: 3, orientation: N }, instructions: [F] },
      { start: { x: 2, y: 3, orientation: N }, instructions: [F] },
    ];

    expect(moveRobots(world, robots)).toEqual([
      { position: { x: 3, y: 3, orientation: N }, isLost: true },
      { position: { x: 2, y: 3, orientation: N }, isLost: true },
    ]);
  });

  it("applies the same lost and scent rules to a new instruction", () => {
    const jumpTwo: Instruction = (position) => ({ ...position, y: position.y + 2 });
    const robots = [
      { start: { x: 1, y: 2, orientation: N }, instructions: [jumpTwo] },
      { start: { x: 1, y: 2, orientation: N }, instructions: [jumpTwo, F] },
    ];

    expect(moveRobots(world, robots)).toEqual([
      { position: { x: 1, y: 2, orientation: N }, isLost: true },
      { position: { x: 1, y: 3, orientation: N }, isLost: false },
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { Orientation } from "./domain/index.ts";
import { defaultInstructions } from "./instructions/index.ts";
import { parseInput } from "./input/index.ts";
import { moveRobots } from "./moveRobots.ts";

const { N, E, S } = Orientation;

describe("moveRobots", () => {
  it("gives the sample result from the brief", () => {
    const lines = ["5 3", "1 1 E", "RFRFRFRF", "3 2 N", "FRRFLLFFRRFLL", "0 3 W", "LLFFFLFLFL"];
    const input = parseInput(lines, defaultInstructions);

    expect(moveRobots(input)).toEqual([
      { position: { x: 1, y: 1, orientation: E }, isLost: false },
      { position: { x: 3, y: 3, orientation: N }, isLost: true },
      { position: { x: 2, y: 3, orientation: S }, isLost: false },
    ]);
  });

  it("stops following instructions once a robot is lost", () => {
    const input = parseInput(["5 3", "0 0 S", "FRRF"], defaultInstructions);

    expect(moveRobots(input)).toEqual([{ position: { x: 0, y: 0, orientation: S }, isLost: true }]);
  });

  it("ignores a move off the grid from a point where an earlier robot was lost", () => {
    const input = parseInput(["5 3", "3 3 N", "F", "3 3 N", "FRF"], defaultInstructions);

    expect(moveRobots(input)).toEqual([
      { position: { x: 3, y: 3, orientation: N }, isLost: true },
      { position: { x: 4, y: 3, orientation: E }, isLost: false },
    ]);
  });

  it("only protects the exact point the scent was left on", () => {
    const input = parseInput(["5 3", "3 3 N", "F", "2 3 N", "F"], defaultInstructions);

    expect(moveRobots(input)).toEqual([
      { position: { x: 3, y: 3, orientation: N }, isLost: true },
      { position: { x: 2, y: 3, orientation: N }, isLost: true },
    ]);
  });
});

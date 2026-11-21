import { describe, expect, it } from "vitest";
import { type Instruction, Orientation } from "../domain/index.ts";
import { defaultInstructions, moveForward, turnRight } from "../instructions/index.ts";
import { parseInput } from "./parseInput.ts";

const F = moveForward;
const R = turnRight;
const { N, E } = Orientation;

describe("parseInput", () => {
  it.each([
    {
      name: "blank lines, extra spaces and lowercase",
      lines: ["", "  5   3  ", "", "1  1 e", "  rf  "],
      expected: {
        world: { maxX: 5, maxY: 3 },
        robots: [{ start: { x: 1, y: 1, orientation: E }, instructions: [R, F] }],
      },
    },
    {
      name: "an empty instruction line, then blank lines between robots",
      lines: ["5 3", "1 1 E", "", "", "2 2 N", "F"],
      expected: {
        world: { maxX: 5, maxY: 3 },
        robots: [
          { start: { x: 1, y: 1, orientation: E }, instructions: [] },
          { start: { x: 2, y: 2, orientation: N }, instructions: [F] },
        ],
      },
    },
    {
      name: "a robot starting on the world's edge, with 99 instructions",
      lines: ["50 3", "5 3 N", "F".repeat(99)],
      expected: {
        world: { maxX: 50, maxY: 3 },
        robots: [{ start: { x: 5, y: 3, orientation: N }, instructions: Array(99).fill(F) }],
      },
    },
  ])("parses $name", ({ lines, expected }) => {
    expect(parseInput(lines, defaultInstructions)).toStrictEqual(expected);
  });

  it.each([
    { name: "empty input", lines: [], error: "Missing world coordinates" },
    {
      name: "a missing instruction line",
      lines: ["5 3", "1 1 E"],
      error: "Line 2: Missing robot instructions",
    },
    {
      name: "a missing coordinate of the world line",
      lines: ["5"],
      error: 'Line 1: Invalid world coordinates "5": use two whole numbers from 0 to 50',
    },
    {
      name: "a world above 50",
      lines: ["51 3"],
      error: 'Line 1: World coordinates "51 3" are out of range: each must be from 0 to 50',
    },
    {
      name: "a negative world coordinate",
      lines: ["5 -3"],
      error: 'Line 1: Invalid world coordinates "5 -3": use two whole numbers from 0 to 50',
    },
    {
      name: "a badly formed robot position",
      lines: ["5 3", "1 1 X", "F"],
      error:
        'Line 2: Invalid robot position "1 1 X": use two numbers between 0 and 5 for x, and 0 and 3 for y, followed by a direction (N, E, S, W)',
    },
    {
      name: "a robot outside the world",
      lines: ["5 3", "6 1 E", "F"],
      error:
        'Line 2: Robot position "6 1 E" is outside the world: x must be from 0 to 5 and y from 0 to 3',
    },
    {
      name: "an unknown instruction",
      lines: ["5 3", "1 1 E", "FXF"],
      error: 'Line 3: Invalid robot instructions "FXF": use L, R, F',
    },
    {
      name: "100 instructions",
      lines: ["5 3", "1 1 E", "F".repeat(100)],
      error: "Line 3: Too many robot instructions: 100 given, the maximum is 99",
    },
    {
      name: "an error after blank lines, with the original line number",
      lines: ["", "5 3", "", "9 1 E", "F"],
      error:
        'Line 4: Robot position "9 1 E" is outside the world: x must be from 0 to 5 and y from 0 to 3',
    },
  ])("rejects $name", ({ lines, error }) => {
    expect(() => parseInput(lines, defaultInstructions)).toThrow(error);
  });

  it("resolves a new instruction's letter, whatever its case, without parser changes", () => {
    const jump: Instruction = (position) => position;

    const { robots } = parseInput(["5 3", "1 1 E", "FJ"], { ...defaultInstructions, j: jump });

    expect(robots[0]?.instructions[1]).toBe(jump);
  });
});

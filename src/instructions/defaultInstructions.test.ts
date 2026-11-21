import { describe, expect, it } from "vitest";
import { Orientation } from "../domain/index.ts";
import { moveForward, turnLeft, turnRight } from "./defaultInstructions.ts";

const { N, E, S, W } = Orientation;

describe("moveForward", () => {
  it.each([
    { orientation: N, expected: { x: 1, y: 3, orientation: N } },
    { orientation: E, expected: { x: 2, y: 2, orientation: E } },
    { orientation: S, expected: { x: 1, y: 1, orientation: S } },
    { orientation: W, expected: { x: 0, y: 2, orientation: W } },
  ])("facing $orientation, goes one step that way", ({ orientation, expected }) => {
    expect(moveForward({ x: 1, y: 2, orientation })).toEqual(expected);
  });
});

describe("turnLeft and turnRight", () => {
  it("turn on the spot, so they can never lose a robot", () => {
    expect(turnLeft({ x: 1, y: 2, orientation: N })).toEqual({ x: 1, y: 2, orientation: W });
    expect(turnRight({ x: 1, y: 2, orientation: N })).toEqual({ x: 1, y: 2, orientation: E });
  });
});

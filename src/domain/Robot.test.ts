import { describe, expect, it } from "vitest";
import type { Instruction } from "./Instruction.ts";
import { Orientation } from "./Orientation.ts";
import { PlacementError } from "./PlacementError.ts";
import { Robot } from "./Robot.ts";
import { World } from "./World.ts";

const { N, E } = Orientation;
const bounds = { maxX: 5, maxY: 3 };
const north: Instruction = (position) => ({ ...position, y: position.y + 1 });

describe("Robot.place", () => {
  it("places a robot in the world, including on its edge", () => {
    const robot = Robot.place(new World(bounds), { x: 5, y: 3, orientation: N });

    expect(robot.position).toEqual({ x: 5, y: 3, orientation: N });
    expect(robot.isLost).toBe(false);
  });

  it("rejects a start outside the world", () => {
    const place = () => Robot.place(new World(bounds), { x: 6, y: 1, orientation: E });

    expect(place).toThrow(PlacementError);
    expect(place).toThrow(
      "Robot position 6 1 E is outside the world: x must be from 0 to 5 and y from 0 to 3",
    );
  });
});

describe("Robot.execute", () => {
  it("goes where the instruction says when it's on the grid", () => {
    const robot = Robot.place(new World(bounds), { x: 1, y: 1, orientation: N });

    robot.execute(north);

    expect(robot.position).toEqual({ x: 1, y: 2, orientation: N });
    expect(robot.isLost).toBe(false);
  });

  it("is lost at its last position, leaving a scent, when it would go off the grid", () => {
    const world = new World(bounds);
    const robot = Robot.place(world, { x: 1, y: 3, orientation: N });

    robot.execute(north);

    expect(robot.isLost).toBe(true);
    expect(robot.position).toEqual({ x: 1, y: 3, orientation: N });
    expect(world.hasScent({ x: 1, y: 3 })).toBe(true);
  });

  it("ignores a move off the grid from a scented point, whichever way the scent was left", () => {
    const world = new World(bounds);
    world.leaveScent({ x: 1, y: 3 });
    const robot = Robot.place(world, { x: 1, y: 3, orientation: E });

    robot.execute(north);

    expect(robot.isLost).toBe(false);
    expect(robot.position).toEqual({ x: 1, y: 3, orientation: E });
  });

  it("ignores instructions once lost", () => {
    const robot = Robot.place(new World(bounds), { x: 1, y: 3, orientation: N });
    const back: Instruction = (position) => ({ ...position, y: position.y - 1 });

    robot.execute(north);
    robot.execute(back);

    expect(robot.position).toEqual({ x: 1, y: 3, orientation: N });
  });
});

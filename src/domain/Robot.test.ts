import { describe, expect, it } from "vitest";
import type { Instruction } from "./Instruction.ts";
import { Orientation } from "./Orientation.ts";
import { Robot } from "./Robot.ts";
import { Scents } from "./Scents.ts";

const { N, E } = Orientation;
const world = { maxX: 5, maxY: 3 };
const north: Instruction = (position) => ({ ...position, y: position.y + 1 });

describe("Robot.execute", () => {
  it("goes where the instruction says when it's on the grid", () => {
    const robot = new Robot({ x: 1, y: 1, orientation: N });

    robot.execute(north, world, new Scents());

    expect(robot.position).toEqual({ x: 1, y: 2, orientation: N });
    expect(robot.isLost).toBe(false);
  });

  it("is lost at its last position, leaving a scent, when it would go off the grid", () => {
    const robot = new Robot({ x: 1, y: 3, orientation: N });
    const scents = new Scents();

    robot.execute(north, world, scents);

    expect(robot.isLost).toBe(true);
    expect(robot.position).toEqual({ x: 1, y: 3, orientation: N });
    expect(scents.has({ x: 1, y: 3 })).toBe(true);
  });

  it("ignores a move off the grid from a scented point, whichever way the scent was left", () => {
    const robot = new Robot({ x: 1, y: 3, orientation: E });
    const scents = new Scents();
    scents.add({ x: 1, y: 3 });

    robot.execute(north, world, scents);

    expect(robot.isLost).toBe(false);
    expect(robot.position).toEqual({ x: 1, y: 3, orientation: E });
  });

  it("ignores instructions once lost", () => {
    const robot = new Robot({ x: 1, y: 3, orientation: N });
    const scents = new Scents();
    const back: Instruction = (position) => ({ ...position, y: position.y - 1 });

    robot.execute(north, world, scents);
    robot.execute(back, world, scents);

    expect(robot.position).toEqual({ x: 1, y: 3, orientation: N });
  });
});

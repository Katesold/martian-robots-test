import { describe, expect, it } from "vitest";
import { Orientation, Robot, World } from "../domain/index.ts";
import { moveForward } from "./defaultInstructions.ts";

const { N, W } = Orientation;

describe("moveForward", () => {
  it("moves the robot when the next point is on the grid", () => {
    const robot = new Robot({ x: 1, y: 1, orientation: N });

    moveForward.execute(robot, new World(5, 5));

    expect(robot.position).toEqual({ x: 1, y: 2, orientation: N });
    expect(robot.isLost).toBe(false);
  });

  it("loses the robot and leaves a scent where it was when it moves off the grid", () => {
    const robot = new Robot({ x: 5, y: 5, orientation: N });
    const world = new World(5, 5);

    moveForward.execute(robot, world);

    expect(robot.isLost).toBe(true);
    expect(robot.position).toEqual({ x: 5, y: 5, orientation: N });
    expect(world.hasScent({ x: 5, y: 5 })).toBe(true);
  });

  it("ignores a move off the grid from a scented point", () => {
    const robot = new Robot({ x: 5, y: 5, orientation: N });
    const world = new World(5, 5);
    world.leaveScent({ x: 5, y: 5 });

    moveForward.execute(robot, world);

    expect(robot.isLost).toBe(false);
    expect(robot.position).toEqual({ x: 5, y: 5, orientation: N });
  });

  it("still moves normally on the grid from a scented point", () => {
    const robot = new Robot({ x: 5, y: 5, orientation: W });
    const world = new World(5, 5);
    world.leaveScent({ x: 5, y: 5 });

    moveForward.execute(robot, world);

    expect(robot.position).toEqual({ x: 4, y: 5, orientation: W });
  });
});

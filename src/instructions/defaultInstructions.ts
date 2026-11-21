import type { Instruction } from "../domain/index.ts";
import type { InstructionsByLetter } from "./InstructionsByLetter.ts";

export const turnLeft: Instruction = { execute: (robot) => robot.turnLeft() };

export const turnRight: Instruction = { execute: (robot) => robot.turnRight() };

export const moveForward: Instruction = {
  execute(robot, world) {
    const next = robot.nextPosition();

    if (world.contains(next)) {
      robot.move(next);
      return;
    }
    if (world.hasScent(robot.position)) {
      return;
    }
    world.leaveScent(robot.position);
    robot.markLost();
  },
};

export const defaultInstructions = Object.freeze({
  L: turnLeft,
  R: turnRight,
  F: moveForward,
} satisfies InstructionsByLetter);

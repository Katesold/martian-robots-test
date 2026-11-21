import {
  getLeftOrientation,
  getRightOrientation,
  type Instruction,
  Orientation,
} from "../domain/index.ts";
import type { InstructionsByLetter } from "./InstructionsByLetter.ts";

export const turnLeft: Instruction = (position) => ({
  ...position,
  orientation: getLeftOrientation(position.orientation),
});

export const turnRight: Instruction = (position) => ({
  ...position,
  orientation: getRightOrientation(position.orientation),
});

export const moveForward: Instruction = ({ x, y, orientation }) => {
  switch (orientation) {
    case Orientation.N:
      return { x, y: y + 1, orientation };
    case Orientation.E:
      return { x: x + 1, y, orientation };
    case Orientation.S:
      return { x, y: y - 1, orientation };
    case Orientation.W:
      return { x: x - 1, y, orientation };
  }
};

export const defaultInstructions: InstructionsByLetter = {
  L: turnLeft,
  R: turnRight,
  F: moveForward,
};

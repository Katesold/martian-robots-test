import { Orientation } from "./Orientation.ts";

export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

export interface Position extends Coordinates {
  readonly orientation: Orientation;
}

export function getNextPosition(position: Position): Position {
  const { x, y, orientation } = position;

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
}

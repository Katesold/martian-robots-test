import { getLeftOrientation, getRightOrientation } from "./Orientation.ts";
import { getNextPosition, type Position } from "./Position.ts";

export class Robot {
  #position: Position;
  #lost = false;

  constructor(position: Position) {
    this.#position = position;
  }

  get position(): Position {
    return this.#position;
  }

  get isLost(): boolean {
    return this.#lost;
  }

  turnLeft(): void {
    this.#position = { ...this.#position, orientation: getLeftOrientation(this.#position.orientation) };
  }

  turnRight(): void {
    this.#position = { ...this.#position, orientation: getRightOrientation(this.#position.orientation) };
  }

  nextPosition(): Position {
    return getNextPosition(this.#position);
  }

  move(position: Position): void {
    this.#position = position;
  }

  markLost(): void {
    this.#lost = true;
  }
}

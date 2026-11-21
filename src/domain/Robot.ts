import type { Instruction } from "./Instruction.ts";
import { PlacementError } from "./PlacementError.ts";
import type { Position } from "./Position.ts";
import type { World } from "./World.ts";

export class Robot {
  readonly #world: World;
  #position: Position;
  #lost = false;

  private constructor(world: World, start: Position) {
    this.#world = world;
    this.#position = start;
  }

  // every robot starts inside the world
  static place(world: World, start: Position): Robot {
    if (!world.contains(start)) {
      const { x, y, orientation } = start;
      const { maxX, maxY } = world.bounds;
      throw new PlacementError(
        `Robot position ${x} ${y} ${orientation} is outside the world: x must be from 0 to ${maxX} and y from 0 to ${maxY}`,
      );
    }
    return new Robot(world, start);
  }

  get position(): Position {
    return this.#position;
  }

  get isLost(): boolean {
    return this.#lost;
  }

  execute(instruction: Instruction): void {
    if (this.#lost) return;

    const next = instruction(this.#position);
    if (this.#world.contains(next)) {
      this.#position = next;
      return;
    }
    if (this.#world.hasScent(this.#position)) return;

    this.#world.leaveScent(this.#position);
    this.#lost = true;
  }
}

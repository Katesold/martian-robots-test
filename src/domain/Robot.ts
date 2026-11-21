import type { Instruction } from "./Instruction.ts";
import type { Position } from "./Position.ts";
import type { Scents } from "./Scents.ts";
import { isInWorld, type World } from "./World.ts";

export class Robot {
  #position: Position;
  #lost = false;

  constructor(start: Position) {
    this.#position = start;
  }

  get position(): Position {
    return this.#position;
  }

  get isLost(): boolean {
    return this.#lost;
  }

  execute(instruction: Instruction, world: World, scents: Scents): void {
    if (this.#lost) return;

    const next = instruction(this.#position);
    if (isInWorld(world, next)) {
      this.#position = next;
      return;
    }
    if (scents.has(this.#position)) return;

    scents.add(this.#position);
    this.#lost = true;
  }
}

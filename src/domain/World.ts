import type { Coordinates } from "./Position.ts";

export class World {
  readonly #scents: Coordinates[] = [];

  constructor(
    readonly maxX: number,
    readonly maxY: number,
  ) {}

  contains({ x, y }: Coordinates): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
  }

  hasScent({ x, y }: Coordinates): boolean {
    return this.#scents.some((scent) => scent.x === x && scent.y === y);
  }

  leaveScent({ x, y }: Coordinates): void {
    this.#scents.push({ x, y });
  }
}

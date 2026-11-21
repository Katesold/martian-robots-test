import type { Coordinates } from "./Position.ts";

export class Scents {
  readonly #points: Coordinates[] = [];

  has({ x, y }: Coordinates): boolean {
    return this.#points.some((point) => point.x === x && point.y === y);
  }

  add({ x, y }: Coordinates): void {
    this.#points.push({ x, y });
  }
}

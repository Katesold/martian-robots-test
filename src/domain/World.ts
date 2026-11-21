import type { Bounds } from "./Bounds.ts";
import type { Coordinates } from "./Position.ts";

function key({ x, y }: Coordinates): string {
  return `${x},${y}`;
}

export class World {
  readonly bounds: Bounds;
  readonly #scents = new Set<string>();

  constructor(bounds: Bounds) {
    this.bounds = bounds;
  }

  contains({ x, y }: Coordinates): boolean {
    return x >= 0 && x <= this.bounds.maxX && y >= 0 && y <= this.bounds.maxY;
  }

  hasScent(point: Coordinates): boolean {
    return this.#scents.has(key(point));
  }

  leaveScent(point: Coordinates): void {
    this.#scents.add(key(point));
  }
}

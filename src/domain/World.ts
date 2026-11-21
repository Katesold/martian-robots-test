import type { Coordinates } from "./Position.ts";

export interface World {
  readonly maxX: number;
  readonly maxY: number;
}

export function isInWorld(world: World, { x, y }: Coordinates): boolean {
  return x >= 0 && x <= world.maxX && y >= 0 && y <= world.maxY;
}

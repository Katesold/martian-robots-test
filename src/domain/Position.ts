import type { Orientation } from "./Orientation.ts";

export interface Coordinates {
  readonly x: number;
  readonly y: number;
}

export interface Position extends Coordinates {
  readonly orientation: Orientation;
}

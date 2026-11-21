import type { Position } from "./domain/index.ts";

export function formatResult(position: Position, isLost: boolean): string {
  const { x, y, orientation } = position;
  return `${x} ${y} ${orientation}${isLost ? " LOST" : ""}`;
}

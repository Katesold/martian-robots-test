import type { RobotResult } from "./runRobotPrograms.ts";

export function formatResult({ position, isLost }: RobotResult): string {
  const { x, y, orientation } = position;
  return `${x} ${y} ${orientation}${isLost ? " LOST" : ""}`;
}

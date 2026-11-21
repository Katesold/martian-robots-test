import { type Position, Robot, World } from "./domain/index.ts";
import type { ParsedInput } from "./input/index.ts";

// 1 world per run with shared scents state for all robots
export function moveRobots({ maxX, maxY, robots }: ParsedInput): { position: Position; isLost: boolean }[] {
  const world = new World(maxX, maxY);

  return robots.map(({ start, instructions }) => {
    const robot = new Robot(start);

    for (const instruction of instructions) {
      if (robot.isLost) break;
      instruction.execute(robot, world);
    }

    return { position: robot.position, isLost: robot.isLost };
  });
}

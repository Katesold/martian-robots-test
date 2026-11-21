import { type Bounds, type Position, Robot, type RobotProgram, World } from "./domain/index.ts";

export interface RobotResult {
  readonly position: Position;
  readonly isLost: boolean;
}

export function runRobotPrograms(bounds: Bounds, programs: readonly RobotProgram[]): RobotResult[] {
  const world = new World(bounds);

  return programs.map(({ start, instructions }) => {
    const robot = Robot.place(world, start);

    for (const instruction of instructions) {
      robot.execute(instruction);
    }

    return { position: robot.position, isLost: robot.isLost };
  });
}

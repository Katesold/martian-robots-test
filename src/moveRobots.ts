import { type Instruction, type Position, Robot, Scents, type World } from "./domain/index.ts";

export interface RobotInstructions {
  readonly start: Position;
  readonly instructions: readonly Instruction[];
}

export interface RobotResult {
  position: Position;
  isLost: boolean;
}

// scents are shared by every robot in a world
export function moveRobots(world: World, robots: readonly RobotInstructions[]): RobotResult[] {
  const scents = new Scents();

  return robots.map(({ start, instructions }) => {
    const robot = new Robot(start);

    for (const instruction of instructions) {
      robot.execute(instruction, world, scents);
    }

    return { position: robot.position, isLost: robot.isLost };
  });
}

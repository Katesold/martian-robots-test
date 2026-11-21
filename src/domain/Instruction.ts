import type { Robot } from "./Robot.ts";
import type { World } from "./World.ts";

export interface Instruction {
  execute(robot: Robot, world: World): void;
}

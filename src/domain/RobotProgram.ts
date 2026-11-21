import type { Instruction } from "./Instruction.ts";
import type { Position } from "./Position.ts";

export interface RobotProgram {
  readonly start: Position;
  readonly instructions: readonly Instruction[];
}

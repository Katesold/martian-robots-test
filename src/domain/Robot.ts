import type { Instruction } from "./Instruction.ts";
import type { Position } from "./Position.ts";

export interface Robot {
  position: Position;
  instructions: Instruction[];
}

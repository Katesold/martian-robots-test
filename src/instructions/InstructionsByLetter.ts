import type { Instruction } from "../domain/index.ts";

export interface InstructionsByLetter {
  readonly [letter: string]: Instruction;
}

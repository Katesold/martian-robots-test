import type { Position } from "./Position.ts";

export type Instruction = (position: Position) => Position;

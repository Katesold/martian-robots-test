import type { Position } from "./Position.ts";

// returns where the robot would be next but the Robot decides whether it can go there
export type Instruction = (position: Position) => Position;

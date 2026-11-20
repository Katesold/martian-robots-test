import { Instruction, MAX_COORDINATE, MAX_INSTRUCTION_LENGTH, Orientation, type World } from "../domain/index.ts";

export const invalidWorldCoordinates = (text: string) => `Invalid world coordinates "${text}": use two whole numbers`;

export const worldOutOfRange = (text: string) =>
  `World coordinates "${text}" are out of range: each must be from 0 to ${MAX_COORDINATE}`;

export const invalidRobotPosition = (text: string) =>
  `Invalid robot position "${text}": use two whole numbers and a direction (${Object.values(Orientation).join(", ")})`;

export const robotOutsideWorld = (text: string, world: World) =>
  `Robot position "${text}" is outside the world: x must be from 0 to ${world.maxX} and y from 0 to ${world.maxY}`;

export const invalidRobotInstructions = (text: string) =>
  `Invalid robot instructions "${text}": use ${Object.values(Instruction).join(", ")}`;

export const tooManyInstructions = (count: number) =>
  `Too many robot instructions: ${count} given, the maximum is ${MAX_INSTRUCTION_LENGTH}`;

import {
  type Instruction,
  isInWorld,
  isOrientation,
  Orientation,
  type Position,
  type World,
} from "../domain/index.ts";
import type { InstructionsByLetter } from "../instructions/index.ts";
import type { RobotInstructions } from "../moveRobots.ts";
import { MAX_COORDINATE, MAX_INSTRUCTION_LENGTH } from "./constants.ts";
import { InputError } from "./InputError.ts";
import { toInteger } from "./validation.ts";

interface InputLine {
  text: string;
  lineNumber: number;
}

type InstructionLookup = ReadonlyMap<string, Instruction>;

export interface ParsedInput {
  world: World;
  robots: RobotInstructions[];
}

function parseWorld(line: InputLine): World {
  const values = line.text.split(/\s+/);
  const [xMaxValue, yMaxValue] = values;
  const maxX = toInteger(xMaxValue);
  const maxY = toInteger(yMaxValue);

  if (values.length !== 2 || maxX === undefined || maxY === undefined) {
    throw new InputError(
      `Invalid world coordinates "${line.text}": use two whole numbers from 0 to ${MAX_COORDINATE}`,
      line.lineNumber,
    );
  }

  if (maxX > MAX_COORDINATE || maxY > MAX_COORDINATE) {
    throw new InputError(
      `World coordinates "${line.text}" are out of range: each must be from 0 to ${MAX_COORDINATE}`,
      line.lineNumber,
    );
  }
  return { maxX, maxY };
}

function parsePosition(line: InputLine, world: World): Position {
  const values = line.text.split(/\s+/);
  const [xValue, yValue, orientation] = values;
  const x = toInteger(xValue);
  const y = toInteger(yValue);

  if (values.length !== 3 || x === undefined || y === undefined || !isOrientation(orientation)) {
    throw new InputError(
      `Invalid robot position "${line.text}": use two numbers between 0 and ${world.maxX} for x, and 0 and ${world.maxY} for y, followed by a direction (${Object.values(Orientation).join(", ")})`,
      line.lineNumber,
    );
  }
  const position = { x, y, orientation };
  if (!isInWorld(world, position)) {
    throw new InputError(
      `Robot position "${line.text}" is outside the world: x must be from 0 to ${world.maxX} and y from 0 to ${world.maxY}`,
      line.lineNumber,
    );
  }
  return position;
}

function parseInstructions(line: InputLine, lookup: InstructionLookup): Instruction[] {
  const instructions: Instruction[] = [];

  for (const letter of line.text) {
    const instruction = lookup.get(letter);
    if (instruction === undefined) {
      throw new InputError(
        `Invalid robot instructions "${line.text}": use ${[...lookup.keys()].join(", ")}`,
        line.lineNumber,
      );
    }
    instructions.push(instruction);
  }
  if (instructions.length > MAX_INSTRUCTION_LENGTH) {
    throw new InputError(
      `Too many robot instructions: ${instructions.length} given, the maximum is ${MAX_INSTRUCTION_LENGTH}`,
      line.lineNumber,
    );
  }
  return instructions;
}

// position line + instruction line per Robot
function parseRobots(
  lines: InputLine[],
  world: World,
  lookup: InstructionLookup,
): RobotInstructions[] {
  const robots: RobotInstructions[] = [];

  for (let i = 0; i < lines.length; i++) {
    const positionLine = lines[i];
    if (!positionLine || positionLine.text === "") continue;

    // blank line means no instructions
    i++;
    const instructionLine = lines[i];
    if (!instructionLine) {
      throw new InputError("Missing robot instructions", positionLine.lineNumber);
    }

    robots.push({
      start: parsePosition(positionLine, world),
      instructions: parseInstructions(instructionLine, lookup),
    });
  }

  return robots;
}

// input is uppercased before the lookup, so the letters are too
function uppercaseKeys(instructionsByLetter: InstructionsByLetter): InstructionLookup {
  const instructions = new Map<string, Instruction>();
  for (const [letter, instruction] of Object.entries(instructionsByLetter)) {
    instructions.set(letter.toUpperCase(), instruction);
  }
  return instructions;
}

// currently throws at the first error,
// would improve it and collect all errors so that users can fix them all
export function parseInput(
  rawLines: string[],
  instructionsByLetter: InstructionsByLetter,
): ParsedInput {
  const lines: InputLine[] = rawLines.map((text, index) => ({
    text: text.trim().toUpperCase(),
    lineNumber: index + 1,
  }));

  const worldIndex = lines.findIndex((line) => line.text !== "");
  const worldLine = lines[worldIndex];
  if (!worldLine) {
    throw new InputError("Missing world coordinates");
  }

  const world = parseWorld(worldLine);
  const robotLines = lines.slice(worldIndex + 1);
  const instructions = uppercaseKeys(instructionsByLetter);
  const robots = parseRobots(robotLines, world, instructions);

  return { world, robots };
}

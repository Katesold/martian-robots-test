import {
  type Bounds,
  type Instruction,
  isOrientation,
  Orientation,
  type Position,
  type RobotProgram,
} from "../domain/index.ts";
import type { InstructionsByLetter } from "../instructions/index.ts";
import { MAX_COORDINATE, MAX_INSTRUCTION_LENGTH } from "./constants.ts";
import { InputError } from "./InputError.ts";
import { toInteger } from "./validation.ts";

interface InputLine {
  readonly source: string;
  readonly text: string;
  readonly lineNumber: number;
}

type InstructionLookup = ReadonlyMap<string, Instruction>;

export interface ParsedInput {
  readonly bounds: Bounds;
  readonly programs: readonly RobotProgram[];
}

function parseBounds(line: InputLine): Bounds {
  const values = line.text.split(/\s+/);
  const [xMaxValue, yMaxValue] = values;
  const maxX = toInteger(xMaxValue);
  const maxY = toInteger(yMaxValue);

  if (values.length !== 2 || maxX === undefined || maxY === undefined) {
    throw new InputError(
      `Invalid world coordinates "${line.source}": use two whole numbers from 0 to ${MAX_COORDINATE}`,
      line.lineNumber,
    );
  }

  if (maxX > MAX_COORDINATE || maxY > MAX_COORDINATE) {
    throw new InputError(
      `World coordinates "${line.source}" are out of range: each must be from 0 to ${MAX_COORDINATE}`,
      line.lineNumber,
    );
  }
  return { maxX, maxY };
}

function parsePosition(line: InputLine, bounds: Bounds): Position {
  const values = line.text.split(/\s+/);
  const [xValue, yValue, orientation] = values;
  const x = toInteger(xValue);
  const y = toInteger(yValue);

  if (values.length !== 3 || x === undefined || y === undefined || !isOrientation(orientation)) {
    throw new InputError(
      `Invalid robot position "${line.source}": use two numbers between 0 and ${bounds.maxX} for x, and 0 and ${bounds.maxY} for y, followed by a direction (${Object.values(Orientation).join(", ")})`,
      line.lineNumber,
    );
  }

  if (x > bounds.maxX || y > bounds.maxY) {
    throw new InputError(
      `Robot position "${line.source}" is outside the world: x must be from 0 to ${bounds.maxX} and y from 0 to ${bounds.maxY}`,
      line.lineNumber,
    );
  }
  return { x, y, orientation };
}

function parseInstructions(line: InputLine, instructionLookup: InstructionLookup): Instruction[] {
  if (line.text.length > MAX_INSTRUCTION_LENGTH) {
    throw new InputError(
      `Robot instructions are too long: ${line.text.length} characters, the maximum is ${MAX_INSTRUCTION_LENGTH}`,
      line.lineNumber,
    );
  }

  const letters = line.text.split("").filter((letter) => letter.trim() !== "");

  return letters.map((letter) => {
    const instruction = instructionLookup.get(letter);
    if (instruction === undefined) {
      throw new InputError(
        `Invalid robot instructions "${line.source}": use ${[...instructionLookup.keys()].join(", ")}`,
        line.lineNumber,
      );
    }
    return instruction;
  });
}

// A position line and an instruction line per robot
function parsePrograms(
  lines: readonly InputLine[],
  bounds: Bounds,
  instructionLookup: InstructionLookup,
): RobotProgram[] {
  const programs: RobotProgram[] = [];
  let positionLine: InputLine | undefined;

  for (const line of lines) {
    if (positionLine === undefined) {
      if (line.text === "") continue;
      positionLine = line;
      continue;
    }

    programs.push({
      start: parsePosition(positionLine, bounds),
      instructions: parseInstructions(line, instructionLookup),
    });
    positionLine = undefined;
  }

  if (positionLine !== undefined) {
    throw new InputError("Missing robot instructions", positionLine.lineNumber);
  }

  return programs;
}

function buildUppercaseLetterLookup(instructionsByLetter: InstructionsByLetter): InstructionLookup {
  const instructions = new Map<string, Instruction>();

  for (const [letter, instruction] of Object.entries(instructionsByLetter)) {
    const key = letter.toUpperCase();
    if (key.length !== 1) {
      throw new Error(`Instruction key must be a single character, got "${letter}"`);
    }
    if (instructions.has(key)) {
      throw new Error(`Instruction already exists "${key}"`);
    }
    instructions.set(key, instruction);
  }

  return instructions;
}

export function parseInput(
  rawLines: readonly string[],
  instructionsByLetter: InstructionsByLetter,
): ParsedInput {
  const instructions = buildUppercaseLetterLookup(instructionsByLetter);
  const lines: InputLine[] = rawLines.map((raw, index) => {
    const source = raw.trim();
    return { source, text: source.toUpperCase(), lineNumber: index + 1 };
  });

  const worldIndex = lines.findIndex((line) => line.text !== "");
  const worldLine = lines[worldIndex];
  if (!worldLine) {
    throw new InputError("Missing world coordinates");
  }

  // blank lines at the end are ignored, so a position on the last line is missing its instructions
  const lastIndex = lines.findLastIndex((line) => line.text !== "");

  const bounds = parseBounds(worldLine);
  const programs = parsePrograms(lines.slice(worldIndex + 1, lastIndex + 1), bounds, instructions);

  return { bounds, programs };
}

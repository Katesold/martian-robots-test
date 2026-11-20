import {
  MAX_COORDINATE,
  MAX_INSTRUCTION_LENGTH,
  type Instruction,
  type Position,
  type Robot,
  type World,
} from "../domain/index.ts";
import {
  invalidRobotInstructions,
  invalidRobotPosition,
  invalidWorldCoordinates,
  robotOutsideWorld,
  tooManyInstructions,
  worldOutOfRange,
} from "./errorMessages.ts";
import { InputError } from "./InputError.ts";
import type { InputLine } from "./InputLine.ts";
import { isInRange, isInstruction, isOrientation, toInteger } from "./validation.ts";

export interface ParsedInput {
  world: World;
  robots: Robot[];
}

function parseWorld(line: InputLine): World {
  const values = line.text.split(/\s+/);
  const [xMaxValue, yMaxValue] = values;
  const maxX = toInteger(xMaxValue);
  const maxY = toInteger(yMaxValue);

  if (values.length !== 2 || maxX === undefined || maxY === undefined) {
    throw new InputError(invalidWorldCoordinates(line.text), line.lineNumber);
  }
  if (!isInRange(maxX, MAX_COORDINATE) || !isInRange(maxY, MAX_COORDINATE)) {
    throw new InputError(worldOutOfRange(line.text), line.lineNumber);
  }
  return { maxX, maxY };
}

function parsePosition(line: InputLine, world: World): Position {
  const values = line.text.split(/\s+/);
  const [xValue, yValue, orientation] = values;
  const x = toInteger(xValue);
  const y = toInteger(yValue);

  if (values.length !== 3 || x === undefined || y === undefined || !isOrientation(orientation)) {
    throw new InputError(invalidRobotPosition(line.text), line.lineNumber);
  }
  if (!isInRange(x, world.maxX) || !isInRange(y, world.maxY)) {
    throw new InputError(robotOutsideWorld(line.text, world), line.lineNumber);
  }
  return { x, y, orientation };
}

function parseInstructions(line: InputLine): Instruction[] {
  const letters = [...line.text];

  if (!letters.every(isInstruction)) {
    throw new InputError(invalidRobotInstructions(line.text), line.lineNumber);
  }
  if (letters.length > MAX_INSTRUCTION_LENGTH) {
    throw new InputError(tooManyInstructions(letters.length), line.lineNumber);
  }
  return letters;
}

// position line + instruction line
function parseRobots(lines: InputLine[], world: World): Robot[] {
  const robots: Robot[] = [];

  for (let i = 0; i < lines.length; i += 2) {
    const positionLine = lines[i];
    const instructionLine = lines[i + 1];

    if (!positionLine) break;
    if (!instructionLine) {
      throw new InputError("Missing robot instructions", positionLine.lineNumber);
    }

    const position = parsePosition(positionLine, world);
    const instructions = parseInstructions(instructionLine);

    robots.push({ position, instructions });
  }

  return robots;
}

// currently throws at the first error, 
// would improve it and collect all errors so that users can fix them all
export function parseInput(rawLines: string[]): ParsedInput {
  const lines: InputLine[] = rawLines
    .map((text, index) => ({ text: text.trim().toUpperCase(), lineNumber: index + 1 }))
    .filter((line) => line.text !== "");

  const [worldLine, ...robotLines] = lines;
  if (!worldLine) {
    throw new InputError("Missing world coordinates");
  }

  const world = parseWorld(worldLine);
  const robots = parseRobots(robotLines, world);

  return { world, robots };
}

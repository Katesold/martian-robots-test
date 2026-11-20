import { Instruction, Orientation } from "../domain/index.ts";

export function toInteger(text: string | undefined): number | undefined {
  if (text === undefined) return undefined;

  const value = Number(text);
  return Number.isInteger(value) ? value : undefined;
}

export function isInRange(value: number, max: number): boolean {
  return value >= 0 && value <= max;
}

export function isOrientation(value: string | undefined): value is Orientation {
  return value !== undefined && Object.values<string>(Orientation).includes(value);
}

export function isInstruction(value: string): value is Instruction {
  return Object.values<string>(Instruction).includes(value);
}

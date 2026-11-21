import * as readline from "node:readline";

// On Windows, Node gets Ctrl+Z (and Ctrl+D) as a character on its own line instead of end of input
const END_OF_INPUT = /^[\x04\x1a]$/;

export async function readLines(): Promise<string[]> {
  if (process.stdin.isTTY) {
    console.error(
      "Paste or type the input, then press Ctrl+D (Ctrl+Z then Enter on Windows) to finish:",
    );
  }

  const lines: string[] = [];
  for await (const line of readline.createInterface({ input: process.stdin })) {
    if (END_OF_INPUT.test(line.trim())) break;
    lines.push(line);
  }
  return lines;
}

import * as readline from "node:readline";

export async function readLines(): Promise<string[]> {
  if (process.stdin.isTTY) {
    console.log("Paste or type the input, then finish with an empty line (or Ctrl+D / Ctrl+Z then Enter):");
  }

  const lines = readline.createInterface({ input: process.stdin });
  const result: string[] = [];

  for await (const line of lines) {
    if (line.trim() === "" && process.stdin.isTTY) break;
    result.push(line);
  }

  lines.close();
  return result;
}

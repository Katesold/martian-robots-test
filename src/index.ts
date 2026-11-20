import { InputError, parseInput, readLines } from "./input/index.ts";

// TODO:
// 1. read lines, parse lines
// 2. set coordinates of world (max 50, 50)
// 3. take robot coordinates (x, y, orientation) then instructions (L, R, F) (max 100 char)
// 4. move robot (validate steps), if out of bounds LOST + scent saved
// 5. log coorditates and orientation OR LOST

try {
  const lines = await readLines();
  if (lines.length === 0) {
    throw new InputError("Missing input values");
  }
  const { world, robots } = parseInput(lines);
  console.log(`Moving ${robots.length} robot(s) on a ${world.maxX} x ${world.maxY} grid`);
  // TODO: run each robot and print final positions
} catch (error) {
  if (error instanceof InputError) {
    console.error(`Invalid input. ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}

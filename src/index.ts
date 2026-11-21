import { PlacementError } from "./domain/index.ts";
import { formatResult } from "./formatResult.ts";
import { defaultInstructions } from "./instructions/index.ts";
import { InputError, parseInput, readLines } from "./input/index.ts";
import { runRobotPrograms } from "./runRobotPrograms.ts";

// 1. read lines, parse lines, validate
// 2. set boundaries of world (max 50, 50)
// 3. take robot position (x, y, orientation) then instructions (L, R, F) (<100 char)
// 4. move robot (validate steps), if out of bounds LOST + scent saved
// 5. log coordinates and orientation OR LOST

try {
  const lines = await readLines();
  const { bounds, programs } = parseInput(lines, defaultInstructions);
  const results = runRobotPrograms(bounds, programs);

  for (const result of results) {
    console.log(formatResult(result));
  }
} catch (error) {
  if (error instanceof InputError || error instanceof PlacementError) {
    console.error(`Invalid input. ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}

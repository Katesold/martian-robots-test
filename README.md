# Martian Robots

Command-line app that moves robots around a grid on Mars and prints where each one ends up. The full brief is in [TASK.md](TASK.md).

## Requirements

- Node.js 22+ (built on Node 24)
- npm

## Setup

```sh
npm install
```

## Running

Reads input from stdin:

```sh
npm start                        # type or paste input, finish with an empty line
npm start --silent < input.txt   # or pass a file as input
```

## Testing

```sh
npm test             # run tests once
npm run test:watch   # rerun on change
npm run typecheck    # tsc (tsx runs code without type-checking)
```

- Grouped by domain, one concept per file.
- `domain` depends on nothing. `instructions` depends on `domain`, `input` on both.
- Each folder has an `index.ts` barrel for imports between folders.
- Tests sit next to the code as `*.test.ts`.

## Decisions and assumptions

- **tsx, no build step.** Runs TypeScript directly.
- **Vitest** for `it.each` tables.
- **Parse and validation.** Input is checked in `parseInput` with Typescript validation, after that the types are trusted.
- **New instructions.** An instruction is an object with `execute(robot, world)`. `defaultInstructions` maps each letter to one (`{ L: turnLeft, R: turnRight, F: moveForward }`) and is passed into `parseInput`. To add one, write the object and add its uppercase letter to `defaultInstructions`; the parser and its error messages pick it up.
- **Shared scents.** One `World` for all robots, so a scent protects every robot after one has been marked lost.
- **Input.** Blank lines are ignored, letters are case-insensitive, stops at the first error.
- **Every robot has at least one instruction.** An empty instruction line is skipped like any blank line.

## What I'd do with more time

- Report all input errors at once, not just the first so that users can fix all the problems before retrying.

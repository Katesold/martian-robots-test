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

Reads input from stdin and prints one line per robot to stdout:

```sh
npm start --silent < input.txt   # from a file
npm start                        # type or paste, then Ctrl+D (Ctrl+Z then Enter on Windows)
```

## Testing

```sh
npm test             # run tests once
npm run test:watch   # rerun on change
npm run typecheck    # tsc (tsx runs code without type-checking)
```

Tests sit next to the code as `*.test.ts`:

## Structure

- `domain/`: `Robot` (moving, getting lost, scents), `World` (the grid bounds), `Scents`, `Position`, `Orientation` and the `Instruction` type. No dependencies.
- `instructions/`: `L`, `R`, `F` and `defaultInstructions`, the map from letter to instruction.
- `input/`: reads stdin and parses it into a world and a list of robots.
- `moveRobots.ts`: runs the robots one after another, sharing scents.
- `formatResult.ts` and `index.ts`: the output format and the CLI entry point.

`domain` depends on nothing, and everything else depends on it. `moveRobots` defines the `RobotInstructions` type it takes, and the parser produces it, so `input/` depends on `moveRobots`.
- `index.ts` barrel export files in folders for module boundaries.

## Decisions

- Instructions are pure functions, `(position) => position`, that only say where the robot would end up. The `Robot` decides whether it can move. Because lost and scent move rules live in one place, a new instruction gets the same lost and scent behaviour for free and can't move a robot off the grid.
- To add an instruction, write the function and add its letter to `defaultInstructions`. That map is passed into `parseInput`, so the parser and its error messages pick up the new letter without changes. Using the Command pattern in functional style, with a registry.
- Scents are shared by every robot in one run and start empty on each run, so `moveRobots` never changes its input.
- Input is parsed once into typed values (`World`, `Position`, instructions), with runtime checks and errors. After that the types are trusted.
- tsx runs the TypeScript directly, so there's no build step.
- Vitest handles TypeScript and ES modules with no configuration.

## Assumptions

- Extra whitespace and letter case in the input don't matter.
- The line after a robot's position always holds its instructions, so an empty line there means the robot has no instructions. Other blank lines (before the world line, between robots, at the end) are ignored.
- Robots must start inside the world. The world's upper-right coordinates go up to 50, and instruction lines are at most 99 letters.
- Parsing stops at the first error.
- A lost robot reports the last position it held on the grid, facing the way it was facing then.
- A scent protects a grid point in every direction. From a scented corner, a move off either edge is ignored.
- A `0 0` world (a single point) is valid.

## What I'd do with more time

- Report every input error at once instead of stopping at the first, so users can fix them all in one go.
- Quote the user's original text in error messages. They currently show it uppercased.
- Widen the `Instruction` type if a command ever needs to do more than move the robot, such as reporting something or changing the world.

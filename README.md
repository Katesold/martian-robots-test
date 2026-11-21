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

Tests sit next to the code as `*.test.ts`.

## Structure

- `domain/`: `World` (the grid and its scents), `Robot` (placing, moving, getting lost), `RobotProgram` (a robot's starting place and instructions), `Instruction`, `Position`, `Orientation`, `Bounds` and `PlacementError`. No dependencies.
- `instructions/`: `turnLeft`, `turnRight`, `moveForward` and `defaultInstructions`, the map from letter to instruction.
- `input/`: reads stdin and parses it into `Bounds` and one `RobotProgram` per robot.
- `runRobotPrograms.ts`: creates a `World`, then places each robot and runs its program in order.
- `formatResult.ts` and `index.ts`: the output format and the CLI entry point.

`domain` depends on nothing, and everything else depends on it. The `index.ts` file in each folder is a barrel export.

## Adding a command

Write an `Instruction` and give it a letter:

```ts
// src/instructions/defaultInstructions.ts
export const jumpForward: Instruction = (position) => moveForward(moveForward(position));

export const defaultInstructions: InstructionsByLetter = {
  L: turnLeft,
  R: turnRight,
  F: moveForward,
  J: jumpForward,
};
```

Nothing else changes. The parser and its error messages read the letters from the map, and `Robot` applies the lost and scent rules to every command. Each letter must be a single character, and no two may match when uppercased.

## Decisions

- **Command pattern in functional form.** Each instruction is a pure function that proposes the next position. `defaultInstructions` is the registry, and `Robot` runs the commands. They're functions rather than command classes because they have no state, undo or metadata.
- **The rules live in the domain.** `World` knows the grid and the scents. `Robot` decides whether to move, ignore the move or get lost.
- **Placement is checked twice.** The parser rejects a start outside the world so the error can give its line number. `Robot.place`, the only way to create a robot, checks again so a `Robot` is never outside its `World`, whoever calls it.
- **A new `World` per run**, so scents start empty and `runRobotPrograms` never changes its input.
- tsx runs the TypeScript directly, so there's no build step. Vitest needs no configuration.

## Assumptions

- Letter case doesn't matter. Extra spaces are ignored, including between instructions (`R F` is the same as `RF`).
- A blank line right after a position means that robot has no instructions. Other blank lines are ignored.
- Robots must start inside the world. World coordinates go up to 50, and instruction lines are at most 99 characters.
- Parsing stops at the first error.
- A `0 0` world is valid.

## Future improvements

- Report every input error together so that the user can fix them all.
- Add ESLint and a CI workflow.
- Widen `Instruction` if a command ever needs more than a position, for example to read or change the world.

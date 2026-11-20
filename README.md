# Martian Robots

Command-line app that moves robots around a grid on Mars and prints where each one ends up.

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
npm start --silent < input.txt   # or pipe a file in
```

## Testing

```sh
npm test             # run tests once
npm run test:watch   # rerun on change
npm run typecheck    # tsc (tsx runs code without type-checking)
```

## Project structure

```
src/
├── index.ts              # entry point: read stdin, parse, run, print
├── domain/               # the Mars model, no parsing or I/O
│   ├── Orientation.ts
│   ├── Instruction.ts    # + MAX_INSTRUCTION_LENGTH
│   ├── Position.ts
│   ├── World.ts          # + MAX_COORDINATE
│   └── Robot.ts
└── input/                # text → domain
    ├── readLines.ts      # stdin
    ├── parseInput.ts     # lines → world and robots
    ├── validation.ts     # toInteger, isInRange, isOrientation, isInstruction
    ├── errorMessages.ts  # user-facing messages
    ├── InputError.ts     # error with line number
    └── InputLine.ts
```

- Grouped by domain, one concept per file.
- `input` depends on `domain`, never the other way round.
- Each folder has an `index.ts` barrel for imports between folders.
- Tests sit next to the code as `*.test.ts`.

## Decisions and assumptions

- **tsx, no build step.** Runs TypeScript directly.
- **Vitest** for `it.each` tables.
- **Parse and validation.** Input is checked in `parseInput` with Typescript validation, after that the types are trusted.

## What I'd do with more time

- Report all input errors at once, not just the first.

---

## The task

### The problem

The surface of Mars can be modelled by a rectangular grid around which robots are able to move according to instructions provided from Earth. You are to write a program that determines each sequence of robot positions and reports the final position of the robot.

A robot position consists of a grid coordinate (a pair of integers: x-coordinate followed by y-coordinate) and an orientation (N, S, E, W for north, south, east, and west). A robot instruction is a string of the letters "L", "R", and "F" which represent, respectively, the instructions:

- **Left:** the robot turns left 90 degrees and remains on the current grid point.
- **Right:** the robot turns right 90 degrees and remains on the current grid point.
- **Forward:** the robot moves forward one grid point in the direction of the current orientation and maintains the same orientation.

The direction North corresponds to the direction from grid point (x, y) to grid point (x, y+1).

There is also a possibility that additional command types may be required in the future and provision should be made for this.

Since the grid is rectangular and bounded (...yes Mars is a strange planet), a robot that moves "off" an edge of the grid is lost forever. However, lost robots leave a robot "scent" that prohibits future robots from dropping off the world at the same grid point. The scent is left at the last grid position the robot occupied before disappearing over the edge. An instruction to move "off" the world from a grid point from which a robot has been previously lost is simply ignored by the current robot.

### The input

The first line of input is the upper-right coordinates of the rectangular world; the lower-left coordinates are assumed to be 0, 0.

The remaining input consists of a sequence of robot positions and instructions (two lines per robot). A position consists of two integers specifying the initial coordinates of the robot and an orientation (N, S, E, W), all separated by whitespace on one line. A robot instruction is a string of the letters "L", "R", and "F" on one line.

Each robot is processed sequentially, i.e., finishes executing the robot instructions before the next robot begins execution.

The maximum value for any coordinate is 50.

All instruction strings will be less than 100 characters in length.

### The output

For each robot position/instruction in the input, the output should indicate the final grid position and orientation of the robot. If a robot falls off the edge of the grid the word "LOST" should be printed after the position and orientation.

### Sample input

```
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

### Sample output

```
1 1 E
3 3 N LOST
2 3 S
```

# Martian Robots

A command-line program that simulates robots moving around a bounded grid on Mars and reports where each robot ends up.

## Requirements

- Node.js **22 or later** (Node 24 recommended). The TypeScript source is run with [tsx](https://tsx.is), so there is no build step.
- npm (ships with Node)

## Getting started

```sh
npm install
```

## Running

The program reads input from stdin. You can type it in, or pipe or redirect it from a file:

```sh
npm start                     # type the input, then end it with Ctrl+D (macOS/Linux) or Ctrl+Z then Enter (Windows)
npm start --silent < input.txt
```

## Testing

```sh
npm test              # run all tests once
npm run test:watch    # rerun the tests on every change
npm run typecheck     # type-check with tsc (tsx compiles without checking types)
```

The tests use Node's built-in test runner (`node:test`) and `node:assert`.

## Project structure

```
src/
├── index.ts     # entry point: reads stdin, prints results
└── *.test.ts    # tests sit next to the code they cover
```

## Decisions and assumptions

- **No build step or test framework.** `tsx` compiles TypeScript on the fly, including syntax such as `enum` that Node's built-in type stripping can't handle. Tests run on Node's built-in runner. The dev dependencies are just `tsx`, `typescript` and `@types/node`, so setup is a single `npm install`.

<!-- TODO: add the remaining decisions, assumptions and trade-offs as the solution takes shape -->

## What I'd do with more time

<!-- TODO -->

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

// https://adventofcode.com/2024/day/21

import { getPermutations, numberSum } from './utils.ts';
import { Direction } from './utils.ts';
import { getRange } from './utils.ts';
import { Coordinate } from './utils.ts';

const numericPad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [null, '0', 'A'],
] as const;

const directionalPad = [
  [null, '^', 'A'],
  ['<', 'v', '>'],
] as const;

type NumericButton = typeof numericPad[number][number];
type DirectionButton = typeof directionalPad[number][number];
type CodeSymbol = NonNullable<NumericButton>;

const numericPadCoordinates = new Map<NumericButton, Coordinate>();
const directionalPadCoordinates = new Map<DirectionButton, Coordinate>();

// Initialise numericPadCoordinates and directionalPadCoordinates
for (let y = 0; y < numericPad.length; y++) {
  for (let x = 0; x < numericPad[y].length; x++) {
    const buttonType = numericPad[y][x];
    numericPadCoordinates.set(buttonType, { x, y });
  }
  for (let y = 0; y < directionalPad.length; y++) {
    for (let x = 0; x < directionalPad[y].length; x++) {
      const buttonType = directionalPad[y][x];
      directionalPadCoordinates.set(buttonType, { x, y });
    }
  }
}

export function part1(input: string) {
  const codes = parseInput(input);
  return getComplexitySum(codes, 4);
}

export function part2(input: string) {
  const codes = parseInput(input);
  return getComplexitySum(codes, 27);
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row) => row.split('') as CodeSymbol[]);
}

function getComplexitySum(codes: CodeSymbol[][], keypadCount: number) {
  const complexities = codes.map((code) => {
    const sequenceLength = getSequenceLength(code!, keypadCount);
    const numericCode = +code!.slice(0, -1).join('');
    return numericCode * sequenceLength;
  });
  return numberSum(complexities);
}

class Keypad {
  cache: Record<string, { count: number; coordinates: Coordinate[] }> = {};

  constructor(
    public coordinate: Coordinate,
    private pad: typeof directionalPad | typeof numericPad,
    private previousKeypad?: Keypad,
  ) {
  }

  /**
   * Clicks button at given coordinate with minimal button presses.
   * Previous keypads are clicked as necessary.
   * Returns sequence length.
   */
  clickButton(coord: Coordinate, cache = false): number {
    if (!this.previousKeypad) {
      this.coordinate = { ...coord };
      // First keykad => user can press button directly
      return 1;
    }

    const currentCoords = this.getCurrentCoords();
    const cacheKey = `${this.coordinate.x},${this.coordinate.y}:${coord.x},${coord.y}`;

    // Use cache for better performance
    if (this.cache[cacheKey]) {
      const { count, coordinates } = this.cache[cacheKey];
      this.setCoordinates(coordinates.map((coord) => ({ ...coord })));
      return count;
    }

    const xDir: Direction = { xDir: coord.x < this.coordinate.x ? -1 : 1, yDir: 0 };
    const xDiff = Math.abs(coord.x - this.coordinate.x);
    const xDirections = getRange(0, xDiff).map(() => xDir);
    const yDir: Direction = { xDir: 0, yDir: coord.y < this.coordinate.y ? -1 : 1 };
    const yDiff = Math.abs(coord.y - this.coordinate.y);
    const yDirections = getRange(0, yDiff).map(() => yDir);

    // Check all possible routes to button
    const directionPermutations = getPermutations([...xDirections, ...yDirections]);
    let bestDirs: Direction[] = [];
    let bestCount = Infinity;
    for (const directions of directionPermutations) {
      let childCount = 0;
      for (const dir of directions) {
        childCount += this.moveToDirection(dir);
        if (this.pad[this.coordinate.y][this.coordinate.x] === null) {
          // Can't go over empty button => skip
          childCount = Infinity;
          break;
        }
      }
      childCount += this.previousKeypad.clickButton(directionalPadCoordinates.get('A')!);
      if (childCount < bestCount) {
        bestCount = childCount;
        bestDirs = directions;
      }
      // Restore to previous state
      this.setCoordinates(currentCoords.map((coord) => ({ ...coord })));
    }
    let count = 0;
    for (const dir of bestDirs) {
      count += this.moveToDirection(dir);
    }
    count += this.previousKeypad.clickButton(directionalPadCoordinates.get('A')!, cache);

    this.cache[cacheKey] = {
      count,
      coordinates: this.getCurrentCoords(),
    };
    return count;
  }

  getCurrentCoords() {
    const coordinates: Coordinate[] = [{ ...this.coordinate }];
    let previous = this.previousKeypad;
    while (previous) {
      coordinates.push({ ...previous.coordinate });
      previous = previous.previousKeypad;
    }
    return coordinates;
  }

  /**
   * Replaces coordinate values of self and previous keypads.
   * Generally this is used to restore values to state previously obtained from getCurrentCoords.
   */
  setCoordinates(coordinates: Coordinate[]) {
    const reversedCoords = coordinates.toReversed();
    this.coordinate = reversedCoords.pop()!;
    let previous = this.previousKeypad;
    while (previous) {
      previous.coordinate = reversedCoords.pop()!;
      previous = previous.previousKeypad;
    }
  }

  moveToDirection(direction: Direction, cache = false) {
    if (direction.xDir === 1) {
      this.coordinate.x++;
      return this.previousKeypad!.clickButton(directionalPadCoordinates.get('>')!, cache);
    } else if (direction.xDir === -1) {
      this.coordinate.x--;
      return this.previousKeypad!.clickButton(directionalPadCoordinates.get('<')!, cache);
    } else if (direction.yDir === 1) {
      this.coordinate.y++;
      return this.previousKeypad!.clickButton(directionalPadCoordinates.get('v')!, cache);
    } else if (direction.yDir === -1) {
      this.coordinate.y--;
      return this.previousKeypad!.clickButton(directionalPadCoordinates.get('^')!, cache);
    }
    throw new Error('Invalid direction');
  }

  moveToX(coord: Coordinate) {
    let count = 0;
    while (this.coordinate.x !== coord.x) {
      if (this.coordinate.x < coord.x) {
        count += this.previousKeypad!.clickButton(directionalPadCoordinates.get('>')!);
        this.coordinate.x++;
      } else {
        count += this.previousKeypad!.clickButton(directionalPadCoordinates.get('<')!);
        this.coordinate.x--;
      }
    }
    return count;
  }

  moveToY(coord: Coordinate) {
    let count = 0;
    while (this.coordinate.y !== coord.y) {
      if (this.coordinate.y < coord.y) {
        count += this.previousKeypad!.clickButton(directionalPadCoordinates.get('v')!);
        this.coordinate.y++;
      } else {
        count += this.previousKeypad!.clickButton(directionalPadCoordinates.get('^')!);
        this.coordinate.y--;
      }
    }
    return count;
  }
}

function getSequenceLength(code: CodeSymbol[], robotCount: number) {
  const keypads: Keypad[] = [];
  for (let i = 0; i < robotCount; i++) {
    if (i === robotCount - 1) {
      keypads.push(new Keypad({ ...numericPadCoordinates.get('A')! }, numericPad, keypads[i - 1]));
    } else {
      keypads.push(new Keypad({ ...directionalPadCoordinates.get('A')! }, directionalPad, keypads[i - 1]));
    }
  }
  let sequenceLength = 0;
  for (const char of code) {
    sequenceLength += keypads[keypads.length - 1].clickButton(numericPadCoordinates.get(char!)!, true);
  }
  return sequenceLength;
}

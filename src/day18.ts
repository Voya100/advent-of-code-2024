// https://adventofcode.com/2024/day/18

import { AStarNode, findTargetWithAStar } from './algorithms/a-star.ts';
import { Coordinate, getAdjacentNonDiagonalCoordinates, parseNumbers } from './utils.ts';

interface PathOptions {
  corruptedCoordinates: Set<string>;
  end: Coordinate;
}

export function part1(input: string, goal = { x: 70, y: 70 }, bytes = 1024) {
  const coords = parseInput(input).slice(0, bytes);
  const corruptedCoordinates = new Set(
    coords.map(({ x, y }) => `${x},${y}`),
  );
  const start = new Path({ x: 0, y: 0 }, 0);
  return findTargetWithAStar(start, (node) => node.coordinate.x === goal.x && node.coordinate.y === goal.y, {
    corruptedCoordinates,
    end: goal,
  }).length;
}

export function part2(input: string, goal = { x: 70, y: 70 }) {
  const coords = parseInput(input);
  return findFirstBlockingCoordinate(coords, goal);
}

function findFirstBlockingCoordinate(coords: Coordinate[], goal: Coordinate) {
  const coordKeys = coords.map(({ x, y }) => `${x},${y}`);
  let prev = 0;
  let next = coords.length;
  // Find blocking coordinate by trying different coordinate slices with binary search
  while (next - prev > 1) {
    const middle = Math.floor((prev + next) / 2);
    const corruptedCoordinates = new Set(coordKeys.slice(0, middle + 1));
    const start = new Path({ x: 0, y: 0 }, 0);
    try {
      findTargetWithAStar(
        start,
        (node) => node.coordinate.x === goal.x && node.coordinate.y === goal.y,
        {
          corruptedCoordinates,
          end: goal,
        },
      );
      prev = middle;
    } catch {
      next = middle;
    }
  }
  return coordKeys[next];
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row) => {
      const [x, y] = parseNumbers(row);
      return { x, y };
    });
}

class Path extends AStarNode<Path, PathOptions> {
  constructor(
    public coordinate: Coordinate,
    public length: number,
    previous?: Path,
  ) {
    super();
    this.nodeState.previousNode = previous;
  }

  getAdjacentNodes({ corruptedCoordinates, end }: PathOptions) {
    const adjacentPaths: Path[] = [];
    const adjacentCoords = getAdjacentNonDiagonalCoordinates(this.coordinate);
    for (const adjacentCoord of adjacentCoords) {
      const coordKey = `${adjacentCoord.x},${adjacentCoord.y}`;
      if (!corruptedCoordinates.has(coordKey) && this.isValidCoord(adjacentCoord, end)) {
        adjacentPaths.push(new Path(adjacentCoord, this.length + 1, this));
      }
    }
    return adjacentPaths;
  }

  isValidCoord(coord: Coordinate, goal: Coordinate) {
    if (coord.x < 0 || coord.y < 0 || coord.x > goal.x || coord.y > goal.y) {
      return false;
    }
    return true;
  }

  getStateKey() {
    return `${this.coordinate.x},${this.coordinate.y}`;
  }

  getMinScore({ end }: PathOptions) {
    const xDiff = Math.abs(end.x - this.coordinate.x);
    const yDiff = Math.abs(end.y - this.coordinate.y);
    return this.length + xDiff + yDiff;
  }
}

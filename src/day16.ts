// https://adventofcode.com/2024/day/16

import { GraphNode } from './algorithms/graph-node.ts';
import { MinHeap } from './data-structures/heap.ts';
import { Coordinate, Direction, parseGrid } from './utils.ts';

const EAST = { xDir: 1, yDir: 0 } as const;

const WALL = '#';
const START = 'S';
const END = 'E';
type NodeType = typeof WALL | typeof START | typeof END;

export function part1(input: string) {
  const { map, startCoord, endCoord } = parseInput(input);
  return findBestPaths(map, startCoord, endCoord)[0].score;
}

export function part2(input: string) {
  const { map, startCoord, endCoord } = parseInput(input);
  const uniqueCoords = new Set<string>();
  const bestPaths = findBestPaths(map, startCoord, endCoord, { findAllBestPaths: true });
  for (const path of bestPaths) {
    uniqueCoords.add(`${path.coordinate.x},${path.coordinate.y}`);
    for (const subpath of path.getPath()) {
      uniqueCoords.add(`${subpath.coordinate.x},${subpath.coordinate.y}`);
    }
  }
  return uniqueCoords.size;
}

function parseInput(input: string) {
  const map = parseGrid(input) as NodeType[][];
  const startCoord = map.flatMap((row, y) =>
    row.map((type, x) => ({
      x,
      y,
      type,
    })).filter(({ type }) => type === START)
  )[0];
  const endCoord = map.flatMap((row, y) =>
    row.map((type, x) => ({
      x,
      y,
      type,
    })).filter(({ type }) => type === END)
  )[0];
  return {
    map,
    startCoord,
    endCoord,
  };
}

/**
 * Find quickest path by using A*
 * Distinct states are identified by location and direction
 */
function findBestPaths(
  grid: NodeType[][],
  start: Coordinate,
  goal: Coordinate,
  options: { findAllBestPaths?: boolean } = {},
) {
  const findAllBestPaths = options.findAllBestPaths ?? false;
  const pathHeap = new MinHeap<Path>((path) => path.getMinScore(goal));
  // stateKey => minScore
  const visitedStates = new Map<string, number>();

  const startPath = new Path(start, EAST, 0);
  pathHeap.addItem(startPath);

  const bestPaths: Path[] = [];

  while (pathHeap.length) {
    const nextQuickestPath = pathHeap.pop();
    const stateKey = nextQuickestPath.getStateKey();
    if (
      visitedStates.has(stateKey) &&
      (!findAllBestPaths || nextQuickestPath.getMinScore(goal) > visitedStates.get(stateKey)!)
    ) {
      continue;
    }
    if (
      nextQuickestPath.coordinate.x === goal.x &&
      nextQuickestPath.coordinate.y === goal.y
    ) {
      if (bestPaths.length && findAllBestPaths && bestPaths[0].score !== nextQuickestPath.score) {
        return bestPaths;
      }
      bestPaths.push(nextQuickestPath);
      if (!findAllBestPaths) {
        return bestPaths;
      }
    }
    visitedStates.set(stateKey, nextQuickestPath.getMinScore(goal));
    const adjacentPaths = nextQuickestPath
      .getAdjacentPaths(grid);
    pathHeap.addItems(adjacentPaths);
  }
  throw new Error('Path not found');
}

class Path extends GraphNode<Path> {
  constructor(
    public coordinate: Coordinate,
    private direction: Direction,
    public score: number,
    previous?: Path,
  ) {
    super();
    this.nodeState.previousNode = previous;
  }

  getAdjacentPaths(grid: NodeType[][]) {
    const adjacentPaths: Path[] = [];
    const nextCoord = getNextCoordinate(this.coordinate, this.direction);
    if (grid[nextCoord.y][nextCoord.x] !== WALL) {
      adjacentPaths.push(new Path(nextCoord, this.direction, this.score + 1, this));
    }
    const leftDirection = {
      xDir: -this.direction.yDir,
      yDir: this.direction.xDir,
    } as Direction;
    const rightDirection = {
      xDir: this.direction.yDir,
      yDir: -this.direction.xDir,
    } as Direction;
    const leftCoord = getNextCoordinate(this.coordinate, leftDirection);
    const rightCoord = getNextCoordinate(this.coordinate, rightDirection);
    if (grid[leftCoord.y][leftCoord.x] !== WALL) {
      adjacentPaths.push(new Path(leftCoord, leftDirection, this.score + 1001, this));
    }
    if (grid[rightCoord.y][rightCoord.x] !== WALL) {
      adjacentPaths.push(new Path(rightCoord, rightDirection, this.score + 1001, this));
    }
    // Note: Assuming 180 degree turn is never part of best path
    return adjacentPaths;
  }

  getStateKey() {
    return `${this.coordinate.x},${this.coordinate.y}:${this.direction.xDir},${this.direction.yDir}`;
  }

  getMinScore(end: Coordinate) {
    const xDiff = Math.abs(end.x - this.coordinate.x);
    const yDiff = Math.abs(end.y - this.coordinate.y);
    const turnScore = xDiff !== 0 && yDiff !== 0 ? 1000 : 0;
    return this.score + xDiff + yDiff + turnScore;
  }
}

function getNextCoordinate({ x, y }: Coordinate, { xDir, yDir }: Direction) {
  return {
    x: x + xDir,
    y: y + yDir,
  };
}

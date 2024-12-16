// https://adventofcode.com/2024/day/16

import { AStarNode, findTargetsWithAStar, findTargetWithAStar } from './algorithms/a-star.ts';
import { Coordinate, Direction, parseGrid } from './utils.ts';

const EAST = { xDir: 1, yDir: 0 } as const;

const WALL = '#';
const START = 'S';
const END = 'E';
type NodeType = typeof WALL | typeof START | typeof END;

interface PathOptions {
  map: NodeType[][];
  end: Coordinate;
}

export function part1(input: string) {
  const { map, startCoord, endCoord } = parseInput(input);
  const start = new Path(startCoord, EAST, 0);
  return findTargetWithAStar(start, (node) => node.coordinate.x === endCoord.x && node.coordinate.y === endCoord.y, {
    map,
    end: endCoord,
  }).score;
}

export function part2(input: string) {
  const { map, startCoord, endCoord } = parseInput(input);
  const start = new Path(startCoord, EAST, 0);
  const bestPaths = findTargetsWithAStar(
    start,
    (node) => node.coordinate.x === endCoord.x && node.coordinate.y === endCoord.y,
    {
      map,
      end: endCoord,
    },
    { findAllBestPaths: true },
  );
  const uniqueCoords = new Set<string>();
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

class Path extends AStarNode<Path, PathOptions> {
  constructor(
    public coordinate: Coordinate,
    private direction: Direction,
    public score: number,
    previous?: Path,
  ) {
    super();
    this.nodeState.previousNode = previous;
  }

  getAdjacentNodes({ map }: PathOptions) {
    const adjacentPaths: Path[] = [];
    const nextCoord = getNextCoordinate(this.coordinate, this.direction);
    if (map[nextCoord.y][nextCoord.x] !== WALL) {
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
    if (map[leftCoord.y][leftCoord.x] !== WALL) {
      adjacentPaths.push(new Path(leftCoord, leftDirection, this.score + 1001, this));
    }
    if (map[rightCoord.y][rightCoord.x] !== WALL) {
      adjacentPaths.push(new Path(rightCoord, rightDirection, this.score + 1001, this));
    }
    // Note: Assuming 180 degree turn is never part of best path
    return adjacentPaths;
  }

  getStateKey() {
    return `${this.coordinate.x},${this.coordinate.y}:${this.direction.xDir},${this.direction.yDir}`;
  }

  getMinScore({ end }: PathOptions) {
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

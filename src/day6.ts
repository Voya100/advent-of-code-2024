// https://adventofcode.com/2024/day/6

import { Direction } from './utils.ts';

const EMPTY = '.';
const GUARD = '^';
const WALL = '#';

const UP_DIRECTION = { xDir: 0, yDir: -1 } as const;

type PositionType = typeof EMPTY | typeof GUARD | typeof WALL;

interface Position {
  x: number;
  y: number;
  type: PositionType;
  /**
   * Direction guard is looking into when they visit position for the first time.
   * Note that starting position is not "visited" from direction, unless guard returns to it later
   */
  firstVisitDirection?: Direction;
}

export function part1(input: string) {
  const map = parseInput(input);
  const guardPosition: Position = findGuardPosition(map);
  return findRoutePositions(guardPosition, UP_DIRECTION, map, { firstRoute: true }).visitedPositions.size;
}

export function part2(input: string) {
  const map = parseInput(input);
  const guardPosition: Position = findGuardPosition(map);
  // Assumption: Original route never loops
  const routePositions = findRoutePositions(guardPosition, UP_DIRECTION, map, { firstRoute: true }).visitedPositions;
  let possibleWallPositions = 0;
  // All positions on original route are possible wall positions
  for (const routePosition of routePositions) {
    if (!routePosition.firstVisitDirection) {
      // Guard's starting position is on route, but wall can't be added to it unless guard has visited it again later
      continue;
    }
    const originalType = routePosition.type;
    // Replace position type as wall
    routePosition.type = WALL;
    // Start from position one step before guard would originally visit this position
    // Loop likely won't involve entire original route, so this finds final loop faster
    const startingPosition = map[routePosition.y - routePosition.firstVisitDirection.yDir][
      routePosition.x - routePosition.firstVisitDirection.xDir
    ];
    if (
      findRoutePositions(startingPosition, routePosition.firstVisitDirection, map, { firstRoute: false })
        .endReason === 'loop'
    ) {
      possibleWallPositions++;
    }
    // Restore original type
    routePosition.type = originalType;
  }
  return possibleWallPositions;
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row, y) => row.split('').map((type, x) => ({ x, y, type: type as PositionType })));
}

/**
 * Moves guard on map starting at guardPosition going to given direction.
 * Iteration stops until guard either exists map or route starts to loop.
 * Returns visited positions (including start position) and exit reason ('loop' or 'outside')
 */
function findRoutePositions(
  guardPosition: Position,
  direction: Direction,
  map: Position[][],
  { firstRoute }: { firstRoute: boolean },
): { visitedPositions: Set<Position>; endReason: 'loop' | 'outside' } {
  guardPosition = { ...guardPosition };
  const visitedPositions = new Set<Position>();
  const visitedPositionDirections = new Set<string>();
  // Move while guard is still on map
  while (
    0 <= guardPosition.x && guardPosition.x < map[0].length && 0 <= guardPosition.y && guardPosition.y < map.length
  ) {
    const position = map[guardPosition.y][guardPosition.x];
    visitedPositions.add(position);
    if (firstRoute && !position.firstVisitDirection && visitedPositions.size > 1) {
      // Used as optimisation for part 2
      // Visit direction is not added for guard's starting position, unless guard returns to it later
      position.firstVisitDirection = direction;
    }
    const positionDirectionKey = `${guardPosition.x},${guardPosition.y}:${direction.xDir},${direction.yDir}`;
    if (visitedPositionDirections.has(positionDirectionKey)) {
      // Already visited position from same direction => loop
      return {
        visitedPositions,
        endReason: 'loop',
      };
    }
    visitedPositionDirections.add(positionDirectionKey);
    if (map[guardPosition.y + direction.yDir]?.[guardPosition.x + direction.xDir]?.type === WALL) {
      direction = rotateDirectionRight(direction);
      continue;
    }
    guardPosition.x += direction.xDir;
    guardPosition.y += direction.yDir;
  }
  return {
    visitedPositions,
    endReason: 'outside',
  };
}

function findGuardPosition(map: Position[][]) {
  return map.map((row) => row.find((position) => position.type === GUARD)).find((v) => v)!;
}

function rotateDirectionRight(direction: Direction): Direction {
  return {
    xDir: -direction.yDir as -1 | 0 | 1,
    yDir: direction.xDir,
  };
}

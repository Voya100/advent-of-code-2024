// https://adventofcode.com/2024/day/15

import { Coordinate, Direction, numberSum, parseGrid } from './utils.ts';

const ROBOT = '@';
const WALL = '#';
const BOX = 'O';
const LEFT_BOX = '[';
const RIGHT_BOX = ']';
const EMPTY = '.';

const directions = {
  '^': { xDir: 0, yDir: -1 },
  'v': { xDir: 0, yDir: 1 },
  '>': { xDir: 1, yDir: 0 },
  '<': { xDir: -1, yDir: 0 },
} as const;

const LEFT = directions['<'];
const RIGHT = directions['>'];

type Command = keyof typeof directions;
type NodeType = typeof ROBOT | typeof WALL | typeof BOX | typeof LEFT_BOX | typeof RIGHT_BOX | typeof EMPTY;
type WarehouseMap = NodeType[][];

export function part1(input: string) {
  let { robot, map, commands } = parseInput(input);
  for (const command of commands) {
    robot = moveRobot(robot, command as Command, map);
  }
  const gpsCoordinates = map.flatMap((row, y) => row.map((type, x) => type === BOX ? y * 100 + x : 0));
  return numberSum(gpsCoordinates);
}

export function part2(input: string) {
  input = input
    .replaceAll('#', '##')
    .replaceAll('O', '[]')
    .replaceAll('.', '..')
    .replaceAll('@', '@.');
  let { robot, map, commands } = parseInput(input);
  for (const command of commands) {
    robot = moveRobot(robot, command as Command, map);
  }
  const gpsCoordinates = map.flatMap((row, y) => row.map((type, x) => type === LEFT_BOX ? y * 100 + x : 0));
  return numberSum(gpsCoordinates);
}

function parseInput(input: string) {
  const [mapInput, commandInput] = input.split('\n\n');
  const map = parseGrid(mapInput) as WarehouseMap;
  const robot: Coordinate =
    map.flatMap((row, y) => row.map((type, x) => ({ x, y, type })).filter(({ type }) => type === ROBOT))[0];
  return {
    robot,
    map,
    commands: commandInput.replaceAll('\n', ''),
  };
}

/**
 * Moves robot/box locations on map, if movement is possible.
 * Returns robot's new coordinate.
 */
function moveRobot(robot: Coordinate, command: Command, map: WarehouseMap) {
  const direction = directions[command];
  const nextNode = getNextCoordinate(robot, direction);
  if (map[nextNode.y][nextNode.x] === WALL) {
    return robot;
  }
  if (map[nextNode.y][nextNode.x] === EMPTY) {
    swapNodes(robot, nextNode, map);
    return nextNode;
  }
  // Otherwise must be box
  const boxMoved = moveBox(nextNode, direction, true, map);
  if (boxMoved) {
    swapNodes(robot, nextNode, map);
    return nextNode;
  }
  return robot;
}

function swapNodes(coord1: Coordinate, coord2: Coordinate, map: WarehouseMap) {
  const value1 = map[coord1.y][coord1.x];
  map[coord1.y][coord1.x] = map[coord2.y][coord2.x];
  map[coord2.y][coord2.x] = value1;
}

/**
 * Moves box in given direction if possible.
 * If moving box would move other boxes, those are also moved.
 * Returns true if boxes were moved, otherwise false.
 *
 * If moveFullBox is true, wide box's left/right side is also moved if necessary.
 */
function moveBox(box: Coordinate, direction: Direction, moveFullBox: boolean, map: WarehouseMap) {
  if (!canMoveBox(box, direction, true, map)) {
    return false;
  }
  const nextNode = getNextCoordinate(box, direction);
  const nextType = map[nextNode.y][nextNode.x];
  const boxType = map[box.y][box.x];
  if (nextType === BOX || nextType === LEFT_BOX || nextType === RIGHT_BOX) {
    moveBox(nextNode, direction, true, map);
  }

  if (boxType === LEFT_BOX && moveFullBox && direction.yDir !== 0) {
    const rightBox = getNextCoordinate(box, RIGHT);
    moveBox(rightBox, direction, false, map);
  }
  if (boxType === RIGHT_BOX && moveFullBox && direction.yDir !== 0) {
    const leftBox = getNextCoordinate(box, LEFT);
    moveBox(leftBox, direction, false, map);
  }
  swapNodes(box, nextNode, map);
  return true;
}

/**
 * Returns true if box can be moved.
 * If box is wide and checkFullBox is true, checks also the other half.
 */
function canMoveBox(box: Coordinate, direction: Direction, checkFullBox: boolean, map: WarehouseMap): boolean {
  const nextNode = getNextCoordinate(box, direction);
  const nextType = map[nextNode.y][nextNode.x];
  if (nextType === WALL) {
    return false;
  }
  const boxType = map[box.y][box.x];
  const canMoveSelf = nextType === EMPTY || canMoveBox(nextNode, direction, true, map);
  if (boxType === BOX || !checkFullBox || direction.yDir === 0) {
    return canMoveSelf;
  }
  if (boxType === LEFT_BOX) {
    const rightBox = getNextCoordinate(box, RIGHT);
    return canMoveSelf &&
      canMoveBox(rightBox, direction, false, map);
  }
  if (boxType === RIGHT_BOX) {
    const leftBox = getNextCoordinate(box, LEFT);
    return canMoveSelf &&
      canMoveBox(leftBox, direction, false, map);
  }
  throw new Error('Should not reach here');
}

function getNextCoordinate({ x, y }: Coordinate, { xDir, yDir }: Direction) {
  return {
    x: x + xDir,
    y: y + yDir,
  };
}

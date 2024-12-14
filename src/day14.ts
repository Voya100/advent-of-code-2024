// https://adventofcode.com/2024/day/14

import { compareByMultiple, Coordinate, groupBy, multiply, parseNumbers } from './utils.ts';

type Robot = ReturnType<typeof parseInput>[number];

export function part1(input: string, mapWidth = 101, mapHeight = 103) {
  const robots = parseInput(input);
  const positions = robots.map((robot) => getPosition(robot, 100, mapWidth, mapHeight));
  const quadrants: number[] = [];
  for (const [yStart, yEnd] of [[0, Math.floor(mapHeight / 2)], [Math.ceil(mapHeight / 2), mapHeight]]) {
    for (const [xStart, xEnd] of [[0, Math.floor(mapWidth / 2)], [Math.ceil(mapWidth / 2), mapWidth]]) {
      const positionsInQuadrant = positions.filter(({ x, y }) => xStart <= x && x < xEnd && yStart <= y && y < yEnd);
      quadrants.push(positionsInQuadrant.length);
    }
  }
  return multiply(quadrants, (q) => q);
}

export function part2(input: string) {
  const robots = parseInput(input);
  const mapWidth = 101, mapHeight = 103;
  let round = 0;
  while (round < 100000) {
    round++;
    const positions = robots.map((robot) => getPosition(robot, round, mapWidth, mapHeight));

    // Sort by y and x coordinates so that robots next to each other on same row are next to each other in array
    positions.sort(compareByMultiple((p) => p.y, (p) => p.x));

    // Picture will have a lot of adjacent robots
    // Find count of robots which are next to at least 1 other robot horizontally
    // While this does not check how big the adjacent groups are, it is accurate enough to find likely pictura candidate
    // (First robot of row is technically not counted, but accuracy is good enough)
    let adjacent = 0;
    for (let i = 1; i < positions.length; i++) {
      if (positions[i].y - positions[i - 1].y <= 1 && positions[i].x - positions[i - 1].x <= 1) {
        adjacent++;
      }
    }
    // "Most" robots are used in the picture, so at least half must be next to some other robot
    if (adjacent > robots.length / 2) {
      visualise(positions, mapWidth, mapHeight);
      return round;
    }
  }
  throw new Error('Not found');
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row) => {
      // Row format: p=0,4 v=3,-3
      const [px, py, vx, vy] = parseNumbers(row);
      return {
        position: {
          x: px,
          y: py,
        },
        velocity: {
          x: vx,
          y: vy,
        },
      };
    });
}

function getPosition(robot: Robot, round: number, mapWidth: number, mapHeight: number) {
  let x = (robot.position.x + robot.velocity.x * round) % mapWidth;
  let y = (robot.position.y + robot.velocity.y * round) % mapHeight;
  if (x < 0) {
    x += mapWidth;
  }
  if (y < 0) {
    y += mapHeight;
  }
  return {
    x,
    y,
  };
}

function visualise(coordinates: Coordinate[], mapWidth: number, mapHeight: number) {
  const map = [...Array(mapHeight)].map(() => [...Array(mapWidth)].map(() => ' '));
  for (const { x, y } of coordinates) {
    map[y][x] = '#';
  }
  console.log(map.map((row) => row.join('')).join('\n'));
}

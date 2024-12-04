// https://adventofcode.com/2024/day/4

import { ALL_DIRECTIONS, sum } from './utils.ts';
import { Direction } from './utils.ts';

interface CharPosition {
  x: number;
  y: number;
  char: string;
}

const WORD = 'XMAS';

export function part1(input: string) {
  const rows = parseInput(input);
  const startPositions = findPositions(WORD[0], rows);
  return sum(startPositions, (position) => countWordMatches(position, rows));
}

export function part2(input: string) {
  const rows = parseInput(input);
  const startPositions = findPositions('A', rows);
  return startPositions.filter((position) => countMasMatches(position, rows)).length;
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row) => row.split(''));
}

function findPositions(char: string, rows: string[][]) {
  return rows.flatMap((row, y) => row.map((v, x) => ({ char: v, x, y })))
    .filter((charPosition) => charPosition.char === char);
}

function countWordMatches(charPosition: CharPosition, rows: string[][]) {
  return ALL_DIRECTIONS.filter((dir) => isWordMatch(charPosition, dir, rows)).length;
}

function isWordMatch(charPosition: CharPosition, dir: Direction, rows: string[][]) {
  for (let i = 0; i < WORD.length; i++) {
    if (rows[charPosition.y + dir.yDir * i]?.[charPosition.x + dir.xDir * i] !== WORD[i]) {
      return false;
    }
  }
  return true;
}

function countMasMatches({ x, y }: CharPosition, rows: string[][]) {
  const topLeft = rows[y - 1]?.[x - 1];
  const topRight = rows[y - 1]?.[x + 1];
  const bottomLeft = rows[y + 1]?.[x - 1];
  const bottomRight = rows[y + 1]?.[x + 1];
  const diag1 = [topLeft, bottomRight];
  const diag2 = [topRight, bottomLeft];
  return diag1.includes('M') && diag1.includes('S') && diag2.includes('M') && diag2.includes('S');
}

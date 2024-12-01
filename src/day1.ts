import { toCountMap } from './utils.ts';
import { sum } from './utils.ts';
// https://adventofcode.com/2024/day/1

export function part1(input: string) {
  const { left, right } = parseInput(input);
  left.sort();
  right.sort();
  return sum(left, (value, i) => Math.abs(right[i] - value));
}

export function part2(input: string) {
  const { left, right } = parseInput(input);
  const countMap = toCountMap(right);
  return sum(left, (value) => value * (countMap.get(value) ?? 0));
}

function parseInput(input: string) {
  const valuePairs = input
    .split('\n')
    .map((row) => row.split('   ').map((v) => +v) as [number, number]);
  const left = valuePairs.map((v) => v[0]);
  const right = valuePairs.map((v) => v[1]);
  return { left, right };
}

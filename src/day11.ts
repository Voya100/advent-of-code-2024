// https://adventofcode.com/2024/day/11

import { cache, parseNumbers, sum } from './utils.ts';

export function part1(input: string) {
  const values = parseInput(input);
  const rockCounter = new RockCounter();
  return sum(values, (v) => rockCounter.countRocks(v, 25));
}

export function part2(input: string) {
  const values = parseInput(input);
  const rockCounter = new RockCounter();
  return sum(values, (v) => rockCounter.countRocks(v, 75));
}

function parseInput(input: string) {
  return parseNumbers(input);
}

class RockCounter {
  @cache()
  countRocks(value: number, rounds: number): number {
    if (rounds === 0) {
      return 1;
    }
    if (value === 0) {
      return this.countRocks(1, rounds - 1);
    }
    const valueString = value.toString();
    if (valueString.length % 2 === 0) {
      const middle = valueString.length / 2;
      return this.countRocks(+valueString.slice(0, middle), rounds - 1) +
        this.countRocks(+valueString.slice(middle), rounds - 1);
    }
    return this.countRocks(value * 2024, rounds - 1);
  }
}

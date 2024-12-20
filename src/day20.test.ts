import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day20.ts';

const input = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

describe('day 20, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input, 12)).toBe(8);
  });
});

describe('day 20, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input, 20, 72)).toBe(29);
  });
});

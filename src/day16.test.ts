import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day16.ts';

const input = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

describe('day 16, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(7036);
  });
});

describe('day 16, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(45);
  });
});

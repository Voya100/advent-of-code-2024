import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day6.ts';

const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

describe('day 6, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(41);
  });
});

describe('day 6, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(6);
  });
});

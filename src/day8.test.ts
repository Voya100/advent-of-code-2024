import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day8.ts';

const input1 = `..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
..........`;

const input2 = `..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........`;

const input3 = `..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......A...
..........
..........`;

const input4 = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

const input5 = `T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........`;

describe('day 8, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input1)).toBe(2);
    expect(part1(input2)).toBe(4);
    expect(part1(input3)).toBe(4);
    expect(part1(input4)).toBe(14);
  });
});

describe('day 8, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input5)).toBe(9);
    expect(part2(input4)).toBe(34);
  });
});

import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day12.ts';

const input1 = `AAAA
BBCD
BBCC
EEEC`;

const input2 = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

describe('day 12, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input1)).toBe(140);
    expect(part1(input2)).toBe(1930);
  });
});

describe('day 12, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input1)).toBe(80);
    expect(part2(input2)).toBe(1206);
  });
});

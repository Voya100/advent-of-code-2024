import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day19.ts';

const input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

describe('day 19, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(6);
  });
});

describe('day 19, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(16);
  });
});
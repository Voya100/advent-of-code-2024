import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day1.ts';

const input = `3   4
4   3
2   5
1   3
3   9
3   3`;

describe('day 1, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(11);
  });
});

describe('day 1, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(31);
  });
});

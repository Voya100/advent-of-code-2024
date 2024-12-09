import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day9.ts';

const input = `2333133121414131402`;

describe('day 9, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(1928);
  });
});

describe('day 9, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(2858);
  });
});

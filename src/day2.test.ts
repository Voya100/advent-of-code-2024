import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day2.ts';

const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

describe('day 2, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(2);
  });
});

describe('day 2, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(4);
  });
});

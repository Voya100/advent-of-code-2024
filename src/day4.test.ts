import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day4.ts';

const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

describe('day 4, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(18);
  });
});

describe('day 4, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(9);
  });
});

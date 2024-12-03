import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day3.ts';

const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
const input2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

describe('day 3, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(161);
  });
});

describe('day 3, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input2)).toBe(48);
  });
});

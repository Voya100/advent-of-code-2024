import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day22.ts';

const input = `1
10
100
2024`;

const input2 = `1
2
3
2024`;

describe('day 22, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(37327623);
  });
});

describe('day 22, part 2', () => {
  it('should work with test input', () => {
    expect(part2('123', 9)).toBe(6n);
    expect(part2(input2)).toBe(23n);
  });
});

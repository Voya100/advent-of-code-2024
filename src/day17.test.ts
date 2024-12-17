import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day17.ts';

const input = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

const input2 = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

describe('day 17, part 1', () => {
  it('should work with test input', () => {
    expect(part1(`Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`)).toBe('0,1,2');
    expect(part1(`Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`)).toBe('4,2,5,6,7,7,7,7,3,1,0');
    expect(part1(input)).toBe('4,6,3,5,6,3,5,2,1,0');
  });
});

describe('day 17, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input2)).toBe(117440);
  });
});

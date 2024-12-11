import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1 } from './day11.ts';

const input = `125 17`;

describe('day 11, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(55312);
  });
});

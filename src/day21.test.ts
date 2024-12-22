import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1 } from './day21.ts';

const input = `029A
980A
179A
456A
379A`;

describe('day 21, part 1', () => {
  it('should work with test input', () => {
    expect(part1('029A')).toBe(1972);
    expect(part1(input)).toBe(126384);
  });
});

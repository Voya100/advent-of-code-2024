import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day18.ts';

const input = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

describe('day 18, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input, { x: 6, y: 6 }, 12)).toBe(22);
  });
});

describe('day 18, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input, { x: 6, y: 6 })).toBe('6,1');
  });
});

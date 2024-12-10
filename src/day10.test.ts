import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day10.ts';

const input1 = `0123
1234
8765
9876`;

const input2 = `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`;

const input3 = `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`;

const input4 = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

const input5 = `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`;

const input6 = `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`;

describe('day 10, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input1)).toBe(1);
    expect(part1(input2)).toBe(2);
    expect(part1(input3)).toBe(3);
    expect(part1(input4)).toBe(36);
  });
});

describe('day 10, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input5)).toBe(3);
    expect(part2(input6)).toBe(13);
    expect(part2(input4)).toBe(81);
  });
});

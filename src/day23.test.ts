import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from 'jsr:@std/expect';
import { part1, part2 } from './day23.ts';

const input = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`;

describe('day 23, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(7);
  });
});

describe('day 23, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe('co,de,ka,ta');
  });
});

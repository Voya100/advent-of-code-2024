// https://adventofcode.com/2024/day/23

import { getAllCombinationsOfSize } from './utils.ts';

export function part1(input: string) {
  const computerMap = parseInput(input);
  return countConnectedComputers([...computerMap.values()]);
}

export function part2(input: string) {
  const computerMap = parseInput(input);
  return getPassword([...computerMap.values()]);
}

function parseInput(input: string) {
  const connections = input
    .split('\n')
    .map((row) => row.split('-'));
  const computerMap = new Map<string, Computer>();
  for (const [code1, code2] of connections) {
    if (!computerMap.has(code1)) {
      computerMap.set(code1, new Computer(code1));
    }
    if (!computerMap.has(code2)) {
      computerMap.set(code2, new Computer(code2));
    }
    computerMap.get(code1)!.connect(computerMap.get(code2)!);
  }
  return computerMap;
}

function countConnectedComputers(computers: Computer[]) {
  const tComputers = computers.filter((computer) => computer.code.startsWith('t'));
  const connected = new Set<string>();
  for (const tComputer of tComputers) {
    for (const [comp1, comp2] of getAllCombinationsOfSize([...tComputer.adjacentNodes], 2)) {
      if (comp1.adjacentNodes.has(comp2)) {
        connected.add([tComputer.code, comp1.code, comp2.code].sort().join(','));
      }
    }
  }
  return connected.size;
}

function getPassword(computers: Computer[]) {
  let biggest = 1;
  let biggestGroup: Computer[] = [];
  for (const computer of computers) {
    for (let i = computer.adjacentNodes.size - 1; i >= biggest; i--) {
      for (const adjacentComputers of getAllCombinationsOfSize([...computer.adjacentNodes], i)) {
        let union = new Set(computer.adjacentNodesAndSelf);
        for (const adjacent of adjacentComputers) {
          union = union.intersection(adjacent.adjacentNodesAndSelf);
          if (union.size < biggest) {
            break;
          }
        }
        if (union.size > biggest) {
          biggest = union.size;
          biggestGroup = [...union];
        }
      }
    }
  }
  const codes = biggestGroup.map((computer) => computer.code).sort();
  return codes.join(',');
}

class Computer {
  adjacentNodes = new Set<Computer>();
  adjacentNodesAndSelf = new Set<Computer>();

  constructor(public code: string) {
    this.adjacentNodesAndSelf.add(this);
  }

  connect(computer: Computer) {
    this.adjacentNodes.add(computer);
    this.adjacentNodesAndSelf.add(computer);
    computer.adjacentNodes.add(this);
    computer.adjacentNodesAndSelf.add(this);
  }
}

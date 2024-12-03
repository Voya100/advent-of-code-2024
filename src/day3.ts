// https://adventofcode.com/2024/day/3

import { sum } from './utils.ts';

enum InstructionType {
  DO,
  DONT,
  MUL,
}

interface MulInstruction {
  type: InstructionType.MUL;
  num1: number;
  num2: number;
}

type Instruction = { type: InstructionType.DO } | { type: InstructionType.DONT } | MulInstruction;

export function part1(input: string) {
  const mulInstructions = parseInput(input).filter((instruction) => instruction.type === InstructionType.MUL);
  return sum(mulInstructions, (mul) => mul.num1 * mul.num2);
}

export function part2(input: string) {
  const instructions = parseInput(input);
  let sum = 0;
  let active = true;
  for (const instruction of instructions) {
    if (instruction.type === InstructionType.DO) {
      active = true;
    } else if (instruction.type === InstructionType.DONT) {
      active = false;
    } else if (active) {
      sum += instruction.num1 * instruction.num2;
    }
  }
  return sum;
}

function parseInput(input: string): Instruction[] {
  return [...input.matchAll(/do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g)].map(([match, num1, num2]) => {
    if (match === 'do()') {
      return { type: InstructionType.DO };
    }
    if (match === "don't()") {
      return { type: InstructionType.DONT };
    }
    return { type: InstructionType.MUL, num1: +num1, num2: +num2 };
  });
}

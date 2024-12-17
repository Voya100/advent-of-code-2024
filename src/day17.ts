// https://adventofcode.com/2024/day/17

import { parseNumbers } from './utils.ts';

const A = 0, B = 1, C = 2;

export function part1(input: string) {
  const { registers, program } = parseInput(input);
  const output = runProgram(registers, program);
  return output.join(',');
}

/**
 * Base assumptions:
 * - Program runs a simple loop where A register is divided by 8 every time and exits when it reaches zero
 * - Each loop has single output operation which utilises only 3 last bits of A value (A % 8).
 *
 * Since last loop iteration must exit, A register will have to be 7 or less at start of last loop (3 bits).
 * Since division by 8 removes 3 bits, total size of A must be 3 * number of outputs.
 * Since each output only cares about the last 3 bits as assumed, it's possible to solve each output value individually.
 */
export function part2(input: string) {
  const { registers, program } = parseInput(input);
  let possibleSolutionParts: bigint[] = [0n];
  for (let i = 0n; i < program.length; i++) {
    // Solve output in parts, starting from the end
    const partialProgram = program.slice(Number(-i) - 1);
    const nextPossibleSolutionParts: bigint[] = [];
    for (const possibleSolutionPart of possibleSolutionParts) {
      for (let k = 0n; k < 8n; k++) {
        // Move "current" solution to left by 3 bits and iterate over remaining possible values (0-8)
        const possibleA = (possibleSolutionPart << (3n)) + k;
        registers[A] = possibleA;
        const output = runProgram([...registers], program, partialProgram);
        if (output.length === partialProgram.length) {
          nextPossibleSolutionParts.push(possibleA);
        }
        if (output.length === program.length) {
          return Number(possibleA);
        }
      }
    }
    possibleSolutionParts = nextPossibleSolutionParts;
    if (possibleSolutionParts.length === 0) {
      throw new Error('Solution not found');
    }
  }
}

function parseInput(input: string) {
  const [registerInput, programInput] = input.split('\n\n');
  return {
    registers: parseNumbers(registerInput).map((num) => BigInt(num)),
    program: parseNumbers(programInput),
  };
}

function runProgram(registers: bigint[], program: number[], expectedOutput?: number[]) {
  const output: bigint[] = [];
  let pointer = 0;
  while (pointer < program.length) {
    const instruction = program[pointer];
    const operand = BigInt(program[pointer + 1]);
    const comboOperandValue = getComboOperandValue(registers, operand);
    switch (instruction) {
      case 0: // 'adv'
        registers[A] = registers[A] / (2n ** comboOperandValue);
        break;
      case 1: // 'bxl'
        registers[B] = registers[B] ^ operand;
        break;
      case 2: // 'bst'
        registers[B] = comboOperandValue % 8n;
        break;
      case 3: // 'jnz'
        if (registers[A] !== 0n) {
          pointer = Number(operand);
          continue;
        }
        break;
      case 4: // bxc
        registers[B] = registers[B] ^ registers[C];
        break;
      case 5: { // 'out'
        const outputValue = comboOperandValue % 8n;
        if (expectedOutput && BigInt(expectedOutput[output.length] ?? -1) !== outputValue) {
          return [];
        }
        output.push(outputValue);
        break;
      }
      case 6: // 'bdv'
        registers[B] = registers[A] / (2n ** comboOperandValue);
        break;
      case 7: // 'cdb'
        registers[C] = registers[A] / (2n ** comboOperandValue);
        break;
      default:
        throw new Error('Unknown instruction');
    }
    pointer += 2;
  }
  return output;
}

function getComboOperandValue(registers: bigint[], operand: bigint) {
  if (operand <= 3) {
    return operand;
  }
  if (operand === 7n) {
    throw new Error('Invalid operand');
  }
  return registers[Number(operand - 4n)];
}

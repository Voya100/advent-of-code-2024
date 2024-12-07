// https://adventofcode.com/2024/day/7

import { parseNumbers, sum } from './utils.ts';

const basicOperators = ['+', '*'] as const;
const advancedOperators = ['+', '*', '||'] as const;
type Operator = typeof advancedOperators[number];

interface Equation {
  result: number;
  values: number[];
  allowedOperators: readonly Operator[];
}

export function part1(input: string) {
  const equations = parseInput(input, basicOperators);
  return countSolvableEquations(equations);
}

export function part2(input: string) {
  const equations = parseInput(input, advancedOperators);
  return countSolvableEquations(equations);
}

function parseInput(input: string, allowedOperators: readonly Operator[]): Equation[] {
  return input
    .split('\n')
    .map((row) => {
      // Rows are in format "result: num1 num2 num3"
      const [result, ...values] = parseNumbers(row);
      return { result, values, allowedOperators };
    });
}

function countSolvableEquations(equations: Equation[]) {
  const validEquations = equations.filter((equation) => isSolvable(equation.values[0], 1, equation));
  return sum(validEquations, (line) => line.result);
}

/**
 * Returns true if currentValue can be transformed into equation.result
 * with operators of equation.allowedOperators being applied between
 * currentValue and remaining equation.values from nextIndex.
 *
 * Each recursive call applies operators to currentValue and increments nextIndex.
 */
function isSolvable(
  currentValue: number,
  nextIndex: number,
  equation: Equation,
) {
  const { result, values, allowedOperators } = equation;
  if (currentValue > result) {
    // All operators can only increase value => exit early
    return false;
  }
  if (nextIndex === values.length) {
    // All numbers processed by operations => check if result has been achieved
    return currentValue === result;
  }
  const nextNumber = values[nextIndex];
  for (const operator of allowedOperators) {
    const nextResult = getResult(currentValue, nextNumber, operator);
    if (isSolvable(nextResult, nextIndex + 1, equation)) {
      return true;
    }
  }
  return false;
}

function getResult(value1: number, value2: number, operator: Operator) {
  switch (operator) {
    case '+':
      return value1 + value2;
    case '*':
      return value1 * value2;
    case '||':
      return +`${value1}${value2}`;
  }
}

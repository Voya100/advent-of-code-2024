// https://adventofcode.com/2024/day/13

import { numberSum, parseNumbers } from './utils.ts';

type Behaviour = ReturnType<typeof parseInput>[number];

export function part1(input: string) {
  const behaviours = parseInput(input);
  const tokenCounts = behaviours.map(countTokens).filter((tokens) => tokens !== Infinity);
  return numberSum(tokenCounts);
}

export function part2(input: string) {
  const behaviours = parseInput(input, 10000000000000);
  const tokenCounts = behaviours.map(countTokens).filter((tokens) => tokens !== Infinity);
  return numberSum(tokenCounts);
}

/**
 * Example behaviourInput:
 * Button A: X+94, Y+34
 * Button B: X+22, Y+67
 * Prize: X=8400, Y=5400
 */
function parseInput(input: string, offset = 0) {
  return input
    .split('\n\n')
    .map((behaviourInput) => {
      const [x1, y1, x2, y2, prizeX, prizeY] = parseNumbers(behaviourInput);
      return {
        buttonA: {
          x: x1,
          y: y1,
        },
        buttonB: {
          x: x2,
          y: y2,
        },
        prize: {
          x: prizeX + offset,
          y: prizeY + offset,
        },
      };
    });
}

function countTokens(behaviour: Behaviour) {
  const { buttonA, buttonB, prize } = behaviour;
  const x1 = buttonA.x;
  const x2 = buttonB.x;
  const y1 = buttonA.y;
  const y2 = buttonB.y;
  const x = prize.x;
  const y = prize.y;

  if (roughlyEquals(y2 / y1 - x2 / x1, 0)) {
    // Assuming there is only single solution
    throw new Error('Division by zero => solution can not be found with this implementation');
  }
  const requiredB = Math.round((y / y1 - x / x1) / (y2 / y1 - x2 / x1));

  const aRequiredX = (prize.x - Math.round(requiredB) * x2) / buttonA.x;
  const aRequiredY = (prize.y - Math.round(requiredB) * y2) / buttonA.y;
  if (roughlyEquals(aRequiredX, aRequiredY) && isRoughlyInteger(aRequiredX)) {
    return Math.round(aRequiredX * 3 + requiredB);
  }
  return Infinity;
}

function isRoughlyInteger(num: number) {
  return roughlyEquals(Math.round(num), num);
}

function roughlyEquals(num1: number, num2: number) {
  return Math.abs(num1 - num2) < 0.00000001;
}

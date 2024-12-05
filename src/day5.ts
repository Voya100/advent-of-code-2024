// https://adventofcode.com/2024/day/5

import { sum } from './utils.ts';
import { parseNumbers } from './utils.ts';

export function part1(input: string) {
  const { orderRules, updates } = parseInput(input);
  const validUpdates = updates.filter((update) => isInCorrectOrder(update, orderRules));
  return sum(validUpdates, (update) => update[Math.floor(update.length / 2)]);
}

export function part2(input: string) {
  const { orderRules, updates } = parseInput(input);
  const invalidUpdates = updates.filter((update) => !isInCorrectOrder(update, orderRules));
  const fixedUpdates = invalidUpdates.map((update) => fixOrder(update, orderRules));
  return sum(fixedUpdates, (update) => update[Math.floor(update.length / 2)]);
}

function parseInput(input: string) {
  const [orderInput, updateInput] = input.split('\n\n');
  return {
    // orderRules are in format before|after
    orderRules: new Set(orderInput.split('\n')),
    updates: updateInput.split('\n').map(parseNumbers),
  };
}

function isInCorrectOrder(update: number[], orderRules: Set<string>) {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const before = update[i];
      const after = update[j];
      if (orderRules.has(`${after}|${before}`)) {
        return false;
      }
    }
  }
  return true;
}

function fixOrder(update: number[], orderRules: Set<string>) {
  for (let i = 0; i < update.length - 1; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const before = update[i];
      const after = update[j];
      if (orderRules.has(`${after}|${before}`)) {
        // Wrong order => swap pages
        update[i] = after;
        update[j] = before;
      }
    }
  }
  return update;
}

// https://adventofcode.com/2024/day/22

import { parseNumbers, sum } from './utils.ts';

export function part1(input: string) {
  const initialSecretNumbers = parseInput(input);
  return sum(initialSecretNumbers, (number) => Number(getSecretNumbers(BigInt(number), 2000).secretNumber));
}

export function part2(input: string, count = 2000) {
  const initialSecretNumbers = parseInput(input);
  const results = initialSecretNumbers.map((num) => getSecretNumbers(BigInt(num), count, true).pricesBySequence);
  return getBestPrice(results);
}

function parseInput(input: string) {
  return parseNumbers(input);
}

function getSecretNumbers(initialSecretNumber: bigint, count: number, getSequences = false) {
  let secretNumber = initialSecretNumber;
  const numbers: bigint[] = [secretNumber];
  const changes: bigint[] = [0n];
  const pricesBySequence: Record<string, bigint> = {};
  for (let i = 0; i < count; i++) {
    const multiply1 = secretNumber * 64n;
    secretNumber = prune(mix(secretNumber, multiply1));
    const division = secretNumber / 32n;
    secretNumber = prune(mix(secretNumber, division));
    const multiply2 = secretNumber * 2048n;
    secretNumber = prune(mix(secretNumber, multiply2));
    numbers.push(secretNumber);
    changes.push((secretNumber % 10n) - (numbers[numbers.length - 2] % 10n));
  }
  if (getSequences) {
    for (let i = 0; i < numbers.length; i++) {
      const sequence = changes.slice(i - 3, i + 1).join(',');
      if (sequence) {
        pricesBySequence[sequence] = pricesBySequence[sequence] ?? numbers[i] % 10n;
      }
    }
  }
  return { secretNumber, pricesBySequence };
}

function getBestPrice(buyerPricesBySequence: Record<string, bigint>[]) {
  const sequences = new Set(buyerPricesBySequence.flatMap((prices) => Object.keys(prices)));
  let maxPrice = 0n;
  let counter = 0;
  for (const sequence of sequences) {
    counter++;
    if (!sequence) {
      continue;
    }
    let totalPrice = 0n;
    for (const prices of buyerPricesBySequence) {
      totalPrice += prices[sequence] ?? 0n;
    }
    if (totalPrice > maxPrice) {
      maxPrice = totalPrice;
    }
  }
  return maxPrice;
}

function mix(secretNumber: bigint, value: bigint) {
  return secretNumber ^ value;
}

function prune(secretNumber: bigint) {
  return secretNumber % 16777216n;
}

// https://adventofcode.com/2024/day/19

import { cache, numberSum } from './utils.ts';

export function part1(input: string) {
  const { towels, designs } = parseInput(input);
  return designs.filter((design) => isPossibleDesign(design, towels)).length;
}

export function part2(input: string) {
  const { towels, designs } = parseInput(input);
  const towelDesignMatcher = new TowelDesignMatcher(towels);
  const towelCombinations = designs.map((design) => towelDesignMatcher.countPossibleTowelCombinations(design));
  return numberSum(towelCombinations);
}

function parseInput(input: string) {
  const [towelInput, designInput] = input.split('\n\n');
  return {
    towels: towelInput.split(', '),
    designs: designInput.split('\n'),
  };
}

function isPossibleDesign(design: string, towels: string[]) {
  if (design.length === 0) {
    return true;
  }
  const possibleTowels = towels.filter((towel) => design.startsWith(towel));
  for (const possibleTowel of possibleTowels) {
    if (isPossibleDesign(design.slice(possibleTowel.length), towels)) {
      return true;
    }
  }
  return false;
}

export class TowelDesignMatcher {
  constructor(private towels: string[]) {}

  // Relies on memoization for performance
  @cache()
  countPossibleTowelCombinations(design: string): number {
    if (design.length === 0) {
      return 1;
    }
    const possibleTowels = this.towels.filter((towel) => design.startsWith(towel));
    const possibleCombinations = possibleTowels.map((towel) =>
      this.countPossibleTowelCombinations(design.slice(towel.length))
    );
    return numberSum(possibleCombinations);
  }
}

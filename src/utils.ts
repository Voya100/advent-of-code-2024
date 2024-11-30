export function sum<T>(objects: T[], valueFunction: (object: T, index: number) => number): number {
  return objects.reduce((sum, object, index) => sum + valueFunction(object, index), 0);
}

export function numberSum(numbers: number[]) {
  return numbers.reduce((sum, object) => sum + object, 0);
}

export function multiply<T>(objects: T[], valueFunction: (object: T, index: number) => number) {
  return objects.reduce((result, object, i) => result * valueFunction(object, i), 1);
}

export function min<T>(objects: T[], valueFunction: (object: T) => number) {
  return objects.reduce(
    (minObject, object) => (valueFunction(minObject) <= valueFunction(object) ? minObject : object),
    objects[0],
  );
}

export function max<T>(objects: T[], valueFunction: (object: T) => number) {
  return objects.reduce(
    (maxObject, object) => (valueFunction(maxObject) >= valueFunction(object) ? maxObject : object),
    objects[0],
  );
}

export function toMap<T, IdType>(values: T[], idFunction: (value: T) => IdType) {
  const map = new Map<IdType, T>();
  for (const value of values) {
    map.set(idFunction(value), value);
  }
  return map;
}

export function toRecord<T, IdType extends number | string>(values: T[], idFunction: (value: T) => IdType) {
  const map = {} as Record<IdType, T>;
  for (const value of values) {
    map[idFunction(value)] = value;
  }
  return map;
}

export function toCountMap<T>(values: T[]): Map<T, number> {
  const map = new Map();
  for (const value of values) {
    const count = map.get(value);
    if (count) {
      map.set(value, count + 1);
    } else {
      map.set(value, 1);
    }
  }
  return map;
}

export function median(values: number[]) {
  if (values.length % 2 === 0) {
    return (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
  }
  return values[Math.floor(values.length / 2)];
}

/**
 * Return numbers range [start, end)
 */
export function getRange(start: number, end: number) {
  const numbers: number[] = [];
  for (let i = start; i < end; i++) {
    numbers.push(i);
  }
  return numbers;
}

export function partition<T>(values: T[], listSize: number): T[][] {
  const partitionedValues = [];
  for (let i = 0; i < values.length; i += listSize) {
    partitionedValues.push(values.slice(i, i + listSize));
  }

  return partitionedValues;
}

export function getCombinations<T>(values: T[]): T[][] {
  if (values.length === 1) {
    return [values];
  }
  const subCombinations = getCombinations(values.slice(1));
  subCombinations.push(...subCombinations.map((subCombination) => [values[0], ...subCombination]));
  subCombinations.push([values[0]]);

  return subCombinations;
}

/**
 * Returns all value combinations of given size.
 * E.g. size 3 for [1,2,3,4]
 * => [1,2,3], [1,2,4], [1,3,4], [2,3,4]
 */
export function* getAllCombinationsOfSize<T>(values: T[], size: number, offset = 0): Generator<T[]> {
  if (size === 1) {
    for (let i = offset; i < values.length; i++) {
      yield [values[i]];
    }
    return;
  }
  for (let i = offset; i <= values.length - size; i++) {
    const subcombinations = getAllCombinationsOfSize(values, size - 1, i + 1);
    for (const subcombination of subcombinations) {
      yield [values[i], ...subcombination];
    }
  }
}

/**
 * Returns all pair combinations of values
 * E.g. [1,2,3] => [[1,2],[1,3],[2,3]]
 */
export function getAllPairs<T>(values: T[], startIndex = 0, output: [T, T][] = []): [T, T][] {
  if (values.length <= startIndex) {
    return output;
  }
  const item = values[startIndex];
  for (let i = startIndex + 1; i < values.length; i++) {
    output.push([item, values[i]]);
  }
  return getAllPairs(values, startIndex + 1, output);
}

/**
 * Split array into all possible split combinations
 * Example: [1,2,3] => [[1,2,3],[]], [[2,3],[1]], [[1,3],[2]], [[3],[1,2]]
 */
export function getAllArrayPairs<T>(values: T[]): [T[], T[]][] {
  if (values.length === 1) {
    return [[values, []]];
  }
  const subPairs = getAllArrayPairs(values.slice(1));
  return subPairs.flatMap(([array1, array2]) => [
    [[values[0], ...array1], array2],
    [array1, [values[0], ...array2]],
  ]);
}

/**
 * Finds repeating number patterns by comparing differences of values of different pattern intervals.
 * Sequential values of minLength-maxLength have same value difference as matching values in next [minPatterncount]
 * patterns, it is a pattern.
 * Example pattern of length 3: 1,3,6,  7,9,12  13,15,18
 * (13-7=7-1, 15-9=9-3, 18-12=12-6)
 * @param values          Number values from which to find the pattern
 * @param minLength       Minimum length of pattern
 * @param maxLength       Maximum length of pattern
 * @param minPatternCount How often pattern must occur sequentially
 * @returns
 */
export function findIncreasingPattern(values: number[], minLength = 250, maxLength = 2500, minPatternCount = 10) {
  if (values.length < maxLength * (minPatternCount + 1)) {
    return;
  }
  for (let patternLength = minLength; patternLength <= maxLength; patternLength++) {
    const patternResult = hasIncreasingPattern(values, patternLength, minPatternCount);
    if (patternResult) {
      return patternResult;
    }
  }
  return null;
}

function hasIncreasingPattern(values: number[], patternLength: number, patternCount: number) {
  const start = values.length - patternLength * patternCount;
  for (let i = 0; i < patternLength; i++) {
    let previousValue = values[start + i];
    let previousDiff: number | null = null;
    for (let patternIndex = 1; patternIndex < patternCount; patternIndex++) {
      const patternValue = values[start + i + patternIndex * patternLength];
      const diff = patternValue - previousValue;
      if (!previousDiff) {
        previousDiff = diff;
      } else if (previousDiff !== diff) {
        return null;
      }
      previousValue = patternValue;
    }
  }
  return { patternLength };
}

export function findPattern<T>(values: T[], minLength = 250, maxLength = 2500, minPatternCount = 10) {
  for (let patternLength = minLength; patternLength <= maxLength; patternLength++) {
    const patternResult = hasPattern(values, patternLength, minPatternCount);
    if (patternResult) {
      return patternResult;
    }
  }
  return null;
}

function hasPattern<T>(values: T[], patternLength: number, patternCount: number) {
  const start = values.length - patternLength * patternCount;
  for (let i = 0; i < patternLength; i++) {
    let previousValue = values[start + i];
    for (let patternIndex = 1; patternIndex < patternCount; patternIndex++) {
      const patternValue = values[start + i + patternIndex * patternLength];
      if (previousValue !== patternValue) {
        return null;
      }
      previousValue = patternValue;
    }
  }
  return { patternLength };
}

/**
 * Finds all integer values within string, accepting all non-digit value separators
 */
export function parseNumbers(input: string) {
  return [...input.matchAll(/-?\d+/g)].map((v) => +v);
}

export function findLeastCommonMultiple(numbers: number[]) {
  let leastCommonMultiple = numbers[0];
  for (const number of numbers.slice(1)) {
    leastCommonMultiple = Math.abs(number * leastCommonMultiple) /
      findGreatestCommonDivisor(number, leastCommonMultiple);
  }
  return leastCommonMultiple;
}

export function findGreatestCommonDivisor(number1: number, number2: number) {
  if (number2 === 0) {
    return number1;
  }
  return findGreatestCommonDivisor(number2, number1 % number2);
}

export function getDivisors(number: number) {
  const primes = getPrimes(number);
  const divisors: number[] = [];
  let dividedNumber = number;
  while (dividedNumber > 1) {
    for (const prime of primes) {
      if (dividedNumber % prime === 0) {
        dividedNumber /= prime;
        divisors.push(prime);
        break;
      }
    }
  }
  return divisors;
}

export function getPrimes(maxNumber: number) {
  const primes = [2];
  for (let i = 3; i <= maxNumber; i++) {
    let isPrime = true;
    for (const prime of primes) {
      if (i % prime === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
  }
  return primes;
}

export type Coordinate = { x: number; y: number };

export function getAdjacentNonDiagonalCoordinates({ x, y }: Coordinate) {
  return [
    { x: x, y: y - 1 },
    { x: x - 1, y: y },
    { x: x, y: y + 1 },
    { x: x + 1, y: y },
  ];
}
export function getAdjacentCoordinates({ x, y }: Coordinate) {
  return [
    // Top row
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    // Same row
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    // Bottom row
    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
}

export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value != null;
}

/**
 * Iterates between numbers start -> end, not including the end
 * End can be lower value than start.
 */
export class NumberIterator {
  constructor(
    private start: number,
    private end: number,
  ) {}

  *[Symbol.iterator]() {
    if (this.start < this.end) {
      let value = this.start;
      while (value < this.end) {
        yield value;
        value++;
      }
    }
    if (this.start > this.end) {
      let value = this.start;
      while (value > this.end) {
        yield value;
        value--;
      }
    }
  }

  copy() {
    return new NumberIterator(this.start, this.end);
  }

  reverse() {
    return new NumberIterator(this.end - 1, this.start - 1);
  }
}

export function deepClone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

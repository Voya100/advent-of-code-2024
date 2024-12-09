// https://adventofcode.com/2024/day/9

import { sum } from './utils.ts';

type Memory = (number | null)[];

export function part1(input: string) {
  const memory = parseInput(input);
  convertMemory1(memory);
  return getChecksum(memory);
}

export function part2(input: string) {
  const memory = parseInput(input);
  convertMemory2(memory);
  return getChecksum(memory);
}

function parseInput(input: string) {
  let empty = false;
  const memory: Memory = [];
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    // Every other block is "empty"
    for (let j = 0; j < +input[i]; j++) {
      memory.push(empty ? null : id);
    }
    empty = !empty;
    if (!empty) {
      id++;
    }
  }
  return memory;
}

function convertMemory1(memory: Memory) {
  let emptyIndex = findNextEmptyIndex(memory, -1, memory.length, 1);
  let valueIndex = findPreviousFileBlock(memory, memory.length).end;
  while (emptyIndex < valueIndex) {
    memory[emptyIndex] = memory[valueIndex];
    memory[valueIndex] = null;
    emptyIndex = findNextEmptyIndex(memory, emptyIndex, valueIndex, 1);
    valueIndex = findPreviousFileBlock(memory, valueIndex).end;
  }
}

function convertMemory2(memory: Memory) {
  let fileBlock = findPreviousFileBlock(memory, memory.length);
  while (fileBlock.start !== -1) {
    const fileSize = fileBlock.end - fileBlock.start + 1;
    const emptyIndex = findNextEmptyIndex(memory, -1, fileBlock.start, fileSize);
    if (emptyIndex < fileBlock.start) {
      const id = memory[fileBlock.start];
      for (let i = 0; i < fileSize; i++) {
        memory[emptyIndex + i] = id;
        memory[fileBlock.start + i] = null;
      }
    }
    fileBlock = findPreviousFileBlock(memory, fileBlock.start);
  }
}

/**
 * Returns start index of first empty memory block of given size starting from prevIndex (ascending order).
 * Empty index must be in range (prevIndex, maxIndex)
 * Returns Infinity if not found.
 */
function findNextEmptyIndex(memory: Memory, prevIndex: number, maxIndex: number, size: number) {
  for (let i = prevIndex + 1; i < maxIndex; i++) {
    if (memory[i] === null) {
      let isRequiredSize = true;
      for (let j = i + 1; j < i + size; j++) {
        if (memory[j] !== null) {
          i = j;
          isRequiredSize = false;
          break;
        }
      }
      if (isRequiredSize) {
        return i;
      }
    }
  }
  return Infinity;
}

/**
 * Finds inclusive start/end indices for non-empty memory block starting prevIndex in descending order.
 * Note that file block is not necessarily complete if prevIndex is also part of the file.
 * Returns {start:-1, end:-1} if not found.
 */
function findPreviousFileBlock(memory: Memory, prevIndex: number) {
  for (let end = prevIndex - 1; end >= 0; end--) {
    const id = memory[end];
    if (id !== null) {
      let start = end;
      while (start > 0) {
        if (memory[start - 1] !== id) {
          break;
        }
        start--;
      }
      return {
        start,
        end,
      };
    }
  }
  return {
    start: -1,
    end: -1,
  };
}

function getChecksum(memory: (number | null)[]) {
  return sum(memory, (id, i) => id ? id * i : 0);
}

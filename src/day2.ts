// https://adventofcode.com/2024/day/2

export function part1(input: string) {
  const records = parseInput(input);
  return records.filter(isSafe).length;
}

export function part2(input: string) {
  const records = parseInput(input);
  return records.filter(isSafe2).length;
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row) => row.split(' ').map((v) => +v));
}

function isSafe(report: number[]) {
  const ascending = report[0] < report[1];
  for (let i = 0; i < report.length - 1; i++) {
    const level1 = report[i];
    const level2 = report[i + 1];
    if (ascending !== level1 < level2) {
      return false;
    }
    const diff = Math.abs(level2 - level1);
    if (diff === 0 || diff > 3) {
      return false;
    }
  }
  return true;
}

function isSafe2(report: number[]) {
  if (isSafe(report)) {
    return true;
  }
  for (let i = 0; i < report.length; i++) {
    const reportCopy = [...report];
    reportCopy.splice(i, 1);
    if (isSafe(reportCopy)) {
      return true;
    }
  }
  return false;
}

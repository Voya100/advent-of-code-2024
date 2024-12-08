// https://adventofcode.com/2024/day/8

import { Coordinate, getAllCombinationsOfSize, groupBy } from './utils.ts';

interface Antenna {
  x: number;
  y: number;
  frequency: string;
}

export function part1(input: string) {
  const { antennas, map } = parseInput(input);
  return findAntinodes(antennas, map, false);
}

export function part2(input: string) {
  const { antennas, map } = parseInput(input);
  return findAntinodes(antennas, map, true);
}

function parseInput(input: string) {
  const map = input
    .split('\n')
    .map((row) => row.split(''));
  const antennas = map.flatMap((row, y) =>
    row.map((frequency, x) => ({
      x,
      y,
      frequency,
    }))
  ).filter(({ frequency }) => frequency !== '.' && frequency !== '#');
  return { map, antennas };
}

function findAntinodes(antennas: Antenna[], map: string[][], repeatingPattern: boolean) {
  const antennasByFrequency = groupBy(antennas, (antenna) => antenna.frequency);
  const antinodeCoordinates = new Set<string>();
  const maxY = map.length - 1;
  const maxX = map[0].length - 1;
  for (const frequencyAntennas of antennasByFrequency.values()) {
    if (frequencyAntennas.length === 1) {
      continue;
    }
    for (const [antenna1, antenna2] of getAllCombinationsOfSize(frequencyAntennas, 2)) {
      const xDiff = antenna2.x - antenna1.x;
      const yDiff = antenna2.y - antenna1.y;

      if (repeatingPattern) {
        // When all "lines" are included regardless of distance, all antenna locations are automatically included
        antinodeCoordinates.add(`${antenna1.x},${antenna1.y}`);
        antinodeCoordinates.add(`${antenna2.x},${antenna2.y}`);
      }

      // Iterate distance between antennes to both directions
      for (
        const coordinateKey of getValidCoordinatesInDirection(antenna1, {
          xDiff,
          yDiff,
          maxX,
          maxY,
          repeating: repeatingPattern,
        })
      ) {
        antinodeCoordinates.add(coordinateKey);
      }

      for (
        const coordinateKey of getValidCoordinatesInDirection(antenna2, {
          xDiff: -xDiff,
          yDiff: -yDiff,
          maxX,
          maxY,
          repeating: repeatingPattern,
        })
      ) {
        antinodeCoordinates.add(coordinateKey);
      }
    }
  }
  return antinodeCoordinates.size;
}

function getValidCoordinatesInDirection(
  startPosition: Coordinate,
  options: { xDiff: number; yDiff: number; maxX: number; maxY: number; repeating: boolean },
) {
  const { xDiff, yDiff, maxX, maxY, repeating } = options;
  const position1 = { x: startPosition.x, y: startPosition.y };
  const coordinates: string[] = [];

  while (true) {
    position1.x -= xDiff;
    position1.y -= yDiff;

    if (0 <= position1.x && position1.x <= maxX && 0 <= position1.y && position1.y <= maxY) {
      coordinates.push(`${position1.x},${position1.y}`);
    } else {
      // Outside of map => stop search
      return coordinates;
    }
    if (!repeating) {
      return coordinates;
    }
  }
}

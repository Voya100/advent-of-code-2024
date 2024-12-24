// https://adventofcode.com/2024/day/24

import { compareBy, getAllCombinationsOfSize } from './utils.ts';

type Operator = 'AND' | 'OR' | 'XOR';

export function part1(input: string) {
  const { zWires } = parseInput(input);
  return getValue(zWires);
}

export function part2(input: string) {
  const { wireMap } = parseInput(input);
  return findIncorrectPairs(wireMap).map((wire) => wire.id).sort().join(',');
}

function parseInput(input: string) {
  const [initialValueInput, operatorInput] = input.split('\n\n');
  const valueWires = initialValueInput.split('\n').map((row) => {
    const [id, value] = row.split(': ');
    const wire = new Wire(id);
    wire.value = +value as 1 | 0;
    return wire;
  });
  const wireMap = new Map<string, Wire>(valueWires.map((wire) => [wire.id, wire]));
  for (const row of operatorInput.split('\n')) {
    // Row format example: "ntg XOR fgs -> mjb"
    const [input1, operator, input2, _, id] = row.split(' ');
    if (!wireMap.has(input1)) {
      wireMap.set(input1, new Wire(input1));
    }
    if (!wireMap.has(input2)) {
      wireMap.set(input2, new Wire(input2));
    }
    if (!wireMap.has(id)) {
      wireMap.set(id, new Wire(id));
    }
    wireMap.get(id)!.input = {
      input1: wireMap.get(input1)!,
      input2: wireMap.get(input2)!,
      operator: operator as Operator,
    };
  }
  const zWires = [...wireMap.values().filter((wire) => wire.id.startsWith('z'))];
  zWires.sort(compareBy((wire) => -1 * (+wire.id.slice(1))));
  return {
    wireMap,
    zWires,
  };
}

function getValue(zWires: Wire[]) {
  return Number.parseInt(getBinaryValue(zWires), 2);
}

function getBinaryValue(wires: Wire[]) {
  return wires.map((wire) => wire.getValue()).join('');
}

function findIncorrectPairs(wireMap: Map<string, Wire>) {
  const wires = [...wireMap.values()];
  const xWires = [...wireMap.values().filter((wire) => wire.id.startsWith('x'))];
  xWires.sort(compareBy((wire) => -1 * (+wire.id.slice(1))));
  const yWires = [...wireMap.values().filter((wire) => wire.id.startsWith('y'))];
  yWires.sort(compareBy((wire) => -1 * (+wire.id.slice(1))));
  const zWires = [...wireMap.values().filter((wire) => wire.id.startsWith('z'))];
  zWires.sort(compareBy((wire) => -1 * (+wire.id.slice(1))));

  // Assumption: All z outputs except first/last use XOR operator
  const invalidZWires = zWires.filter((wire, i) => wire.input?.operator !== 'XOR' && i !== 0 && i !== zWires.length - 1)
    .reverse();

  // Assumption: Exactly 3 of the swappable outputs are related to z outputs
  if (invalidZWires.length !== 3) {
    throw new Error('This solution assumes that 3 of the invalid values are in invalidZ');
  }

  const possibleZSwapWires = wires.filter((wire) =>
    wire.input?.operator === 'XOR' && !wire.numberId && wire.input.input1.numberId === undefined
  );
  const swaps: Wire[] = [];
  for (const invalidZWire of invalidZWires) {
    const possibleSwaps = possibleZSwapWires.filter((possibleSwapWire) => {
      if (swaps.includes(possibleSwapWire)) {
        return false;
      }
      const inputNumberIds = [...possibleSwapWire.getRootInputs()].map((input) => input.numberId!);
      // z outputs should not rely on x/y inputs with greater id.
      // Since we are processing lower ids first and adding them to swaps, there should be only 1 match
      return inputNumberIds.every((id) => id <= invalidZWire.numberId!);
    });
    if (possibleSwaps.length !== 1) {
      throw new Error("Can't identify correct swap");
    }
    swaps.push(invalidZWire, possibleSwaps[0]);
    invalidZWire.swapInput(possibleSwaps[0]);
  }

  // Find last remaining by trying all combinations
  for (const [wire1, wire2] of getAllCombinationsOfSize(wires.filter((w) => w.input), 2)) {
    wire1.swapInput(wire2);
    if (isPossibleConfiguration(wires, xWires, yWires, zWires)) {
      swaps.push(wire1, wire2);
      return swaps;
    }
    // Revert swap
    wire1.swapInput(wire2);
  }
  throw new Error('Not found');
}

function isPossibleConfiguration(wires: Wire[], xWires: Wire[], yWires: Wire[], zWires: Wire[]) {
  const values = [
    { x: 0, y: 0, z: 0 },
  ];
  for (let i = 0; i < xWires.length; i++) {
    // Ensure every bit overflow is tested
    values.push({ x: 1, y: 2 ** i - 1, z: 2 ** i });
  }
  for (const { x, y, z } of values) {
    resetCache(wires);
    populateBinaryFromNumber(x, xWires);
    populateBinaryFromNumber(y, yWires);
    let expectedResult = z.toString(2);
    const result = getBinaryValue(zWires);
    expectedResult = '0'.repeat(result.length - expectedResult.length) + expectedResult;
    if (expectedResult !== result) {
      return false;
    }
  }
  return true;
}

function populateBinaryFromNumber(number: number, wires: Wire[]) {
  populateBinary(number.toString(2), wires);
}

function populateBinary(binary: string, wires: Wire[]) {
  binary = '0'.repeat(wires.length - binary.length) + binary;
  for (let i = 0; i < binary.length; i++) {
    wires[i].value = +binary[i] as 0 | 1;
  }
}

function resetCache(wires: Wire[]) {
  for (const wire of wires) {
    if (wire.input) {
      wire.value = undefined;
    }
  }
}

class Wire {
  numberId?: number;
  // value can either be initial value or cached result from input
  // null if max iteration depth is reached (likely infinite loop)
  value?: 1 | 0 | null;

  input?: {
    input1: Wire;
    input2: Wire;
    operator: Operator;
  };

  constructor(public id: string) {
    if (id.startsWith('x') || id.startsWith('y') || id.startsWith('z')) {
      this.numberId = +id.slice(1);
    }
  }

  getValue(depth = 0): 1 | 0 | null {
    if (this.value !== undefined) {
      return this.value;
    }
    if (depth > 100) {
      // When swapping outputs, infinite loops are possible
      // As an easy way around this, give empty result if depth is too large
      // For more generic case better loop detection would be needed, but this is "good enough" for this case
      this.value = null;
      return null;
    }
    const { input1, input2, operator } = this.input!;
    switch (operator) {
      case 'AND':
        this.value = input1.getValue(depth + 1) && input2.getValue(depth + 1) ? 1 : 0;
        break;
      case 'OR':
        this.value = input1.getValue(depth + 1) || input2.getValue(depth + 1) ? 1 : 0;
        break;
      case 'XOR':
        this.value = input1.getValue(depth + 1)! ^ input2.getValue(depth + 1)! ? 1 : 0;
        break;
    }
    return this.value!;
  }

  swapInput(wire: Wire) {
    const newInput = wire.input;
    wire.input = this.input;
    this.input = newInput;
  }

  /**
   * Returns deepest wires which have value directly
   */
  getRootInputs(): Set<Wire> {
    const inputsToProcess: Wire[] = [this];
    const output = new Set<Wire>();
    while (inputsToProcess.length) {
      const wire = inputsToProcess.pop()!;
      if (!wire.input) {
        output.add(wire);
      } else {
        inputsToProcess.push(wire.input.input1, wire.input.input2);
      }
    }
    return output;
  }
}

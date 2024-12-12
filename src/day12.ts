// https://adventofcode.com/2024/day/12

import { DfsNode, findTargetsWithDfs } from './algorithms/dfs.ts';
import { Coordinate, getAdjacentNonDiagonalCoordinates, groupBy, sum } from './utils.ts';

export function part1(input: string) {
  const nodes = parseInput(input);
  return getTotalPrice(nodes);
}

export function part2(input: string) {
  const nodes = parseInput(input);
  return getTotalPrice2(nodes);
}

function parseInput(input: string) {
  const map = input
    .split('\n')
    .map((row, y) => row.split('').map((type, x) => new PlotNode(x, y, type)));
  const nodes = map.flat();
  for (const node of nodes) {
    node.populateAdjacentNodes(map);
  }
  return nodes;
}

function getTotalPrice(nodes: PlotNode[]) {
  let startNode = nodes.find((node) => !node.nodeState.checked);
  let totalPrice = 0;
  while (startNode) {
    const regionNodes = findTargetsWithDfs(startNode, () => true, undefined);
    const area = regionNodes.size;
    const fences = sum([...regionNodes], (node) => node.fences);
    totalPrice += area * fences;
    startNode = nodes.find((node) => !node.nodeState.checked);
  }
  return totalPrice;
}

function getTotalPrice2(nodes: PlotNode[]) {
  let startNode = nodes.find((node) => !node.nodeState.checked);
  let totalPrice = 0;
  while (startNode) {
    const regionNodes = findTargetsWithDfs(startNode, () => true, undefined);
    const area = regionNodes.size;
    // Note: fences use offset of +/-0.1 for coordinate axis they go towards to avoid coordinate conflicts
    const fenceCoordinates = [...regionNodes].flatMap((node) => node.fenceCoordinates);
    const horizontalFences = fenceCoordinates.filter((c) => Math.floor(c.x) === c.x);
    const verticalFences = fenceCoordinates.filter((c) => Math.floor(c.y) === c.y);
    const fencesByY = groupBy(horizontalFences, (f) => f.y);
    const fencesByX = groupBy(verticalFences, (f) => f.x);
    let sides = 0;
    for (const coords of fencesByY.values()) {
      // Sort to ensure adjacent fences are next to each other
      coords.sort((a, b) => a.x - b.x);
      sides++;
      for (let i = 1; i < coords.length; i++) {
        // Fences are next to each other if they have distance of 1
        // If distance is greater, they are not part of the same side
        if (coords[i].x - coords[i - 1].x !== 1) {
          sides++;
        }
      }
    }
    for (const coords of fencesByX.values()) {
      coords.sort((a, b) => a.y - b.y);
      sides++;
      for (let i = 1; i < coords.length; i++) {
        if (coords[i].y - coords[i - 1].y !== 1) {
          sides++;
        }
      }
    }
    totalPrice += area * sides;
    startNode = nodes.find((node) => !node.nodeState.checked);
  }
  return totalPrice;
}

class PlotNode extends DfsNode<PlotNode, undefined> {
  adjacentNodes: PlotNode[] = [];
  fenceCoordinates: Coordinate[] = [];

  constructor(public x: number, public y: number, public type: string) {
    super();
  }

  override getAdjacentNodes(): PlotNode[] {
    return this.adjacentNodes;
  }

  populateAdjacentNodes(map: PlotNode[][]) {
    for (const { x, y } of getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y })) {
      const adjacentNode = map[y]?.[x];
      if (adjacentNode?.type === this.type) {
        this.adjacentNodes.push(adjacentNode);
      } else {
        // 0.1 is an arbitary offset to ensure fence coordinates don't collide with each other
        // E.g. in BAB middle fences of B will have different coordinates
        // Adjacent fences on same side will have either same x or same y (which includes 0.1 offset) and distance of 1 on the other axis.
        if (y < this.y) {
          this.fenceCoordinates.push({ x, y: this.y - 0.1 });
        } else if (y > this.y) {
          this.fenceCoordinates.push({ x, y: this.y + 0.1 });
        } else if (x < this.x) {
          this.fenceCoordinates.push({ x: this.x - 0.1, y });
        } else if (x > this.x) {
          this.fenceCoordinates.push({ x: this.x + 0.1, y });
        }
      }
    }
  }

  get fences() {
    return 4 - this.adjacentNodes.length;
  }
}

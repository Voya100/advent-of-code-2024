// https://adventofcode.com/2024/day/10

import { DfsNode, findAllPathsWithDfs, findTargetsWithDfs } from './algorithms/dfs.ts';
import { getAdjacentNonDiagonalCoordinates } from './utils.ts';

export function part1(input: string) {
  const { nodes, startingNodes } = parseInput(input);
  let sum = 0;
  for (const startingNode of startingNodes) {
    sum += findTargetsWithDfs(startingNode, (node) => node.height === 9, undefined).size;
    resetNodes(nodes);
  }
  return sum;
}

export function part2(input: string) {
  const { nodes, startingNodes } = parseInput(input);
  let sum = 0;
  for (const startingNode of startingNodes) {
    sum += findAllPathsWithDfs(startingNode, (node) => node.height === 9, undefined).length;
    resetNodes(nodes);
  }
  return sum;
}

function parseInput(input: string) {
  const map = input
    .split('\n')
    .map((row, y) => row.split('').map((height, x) => new MapNode(x, y, height === '.' ? Infinity : +height)));
  const nodes = map.flat();
  for (const node of nodes) {
    node.populateAdjacentNodes(map);
  }
  return {
    nodes,
    startingNodes: nodes.filter((node) => node.height === 0),
  };
}

function resetNodes(nodes: MapNode[]) {
  for (const node of nodes) {
    node.resetNodeState();
  }
}

class MapNode extends DfsNode<MapNode, undefined> {
  adjacentNodes: MapNode[] = [];

  constructor(public x: number, public y: number, public height: number) {
    super();
  }

  override getAdjacentNodes(): MapNode[] {
    return this.adjacentNodes;
  }

  populateAdjacentNodes(map: MapNode[][]) {
    for (const { x, y } of getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y })) {
      const adjacentNode = map[y]?.[x];
      if (adjacentNode?.height === this.height + 1) {
        this.adjacentNodes.push(adjacentNode);
      }
    }
  }

  override toString() {
    return `x: ${this.x}, y: ${this.y}, height: ${this.height}`;
  }
}

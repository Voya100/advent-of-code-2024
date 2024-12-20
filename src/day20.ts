import { BfsNode, findTargetsWithBfs } from './algorithms/bfs.ts';
import { getAdjacentNonDiagonalCoordinates, parseGrid } from './utils.ts';
// https://adventofcode.com/2024/day/20

const WALL = '#';
const START = 'S';
const END = 'E';

export function part1(input: string, cheatSave = 100) {
  return countCheats(input, 2, cheatSave);
}

export function part2(input: string, cheatSave = 100) {
  return countCheats(input, 20, cheatSave);
}

function countCheats(input: string, picoseconds: number, cheatSave: number) {
  const { start, end, map, nodes } = parseInput(input);

  // Iterate all nodes with bfs starting from end to get distances from all nodes to end
  findTargetsWithBfs(end, () => false, undefined);
  for (const node of nodes) {
    node.distanceToEnd = node.getDistanceToStart(true);
  }
  const best = start.distanceToEnd!;
  for (const node of nodes) {
    node?.resetNodeState();
  }
  // Iterate all nodes with bfs starting from start to get distances from all nodes to start
  findTargetsWithBfs(start, () => false, undefined);
  for (const node of nodes) {
    node.distanceToStart = node.getDistanceToStart(true);
  }

  let counter = 0;
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
      if (!map[y][x]) {
        // Is wall
        continue;
      }
      for (let j = 0; j <= picoseconds; j++) {
        for (let i = -picoseconds; i <= picoseconds; i++) {
          const jumpDistance = j + Math.abs(i);
          if (jumpDistance <= 0 || jumpDistance > picoseconds || i < 0 && j === 0) {
            continue;
          }
          const node1 = map[y][x];
          const node2 = map[y + j]?.[x + i];
          if (
            node1?.distanceToStart === undefined || node1.distanceToEnd === undefined ||
            node2?.distanceToStart === undefined || node2.distanceToEnd === undefined
          ) {
            continue;
          }
          if (node1.distanceToStart < node2.distanceToStart) {
            const distanceToEnd = node1.distanceToStart + jumpDistance + node2.distanceToEnd;
            if (best - distanceToEnd >= cheatSave) {
              counter++;
            }
          } else {
            const distanceToEnd = node2.distanceToStart + jumpDistance + node1.distanceToEnd;
            if (best - distanceToEnd >= cheatSave) {
              counter++;
            }
          }
        }
      }
    }
  }
  return counter;
}

function parseInput(input: string) {
  const map = parseGrid(input, (type, x, y) => {
    if (type === WALL) {
      return null;
    }
    return new GraphNode(x, y, type);
  });
  const nodes = map.flat().filter((node) => node) as GraphNode[];
  const start = nodes.find((node) => node?.type === START)!;
  const end = nodes.find((node) => node?.type === END)!;
  for (const node of nodes) {
    node?.populateAdjacentNodes(map);
  }
  return { map, nodes, start, end };
}

class GraphNode extends BfsNode<GraphNode, undefined> {
  adjacentNodes: GraphNode[] = [];

  distanceToStart?: number;
  distanceToEnd?: number;

  constructor(public x: number, public y: number, public type: string) {
    super();
  }

  override getAdjacentNodes(): GraphNode[] {
    return this.adjacentNodes;
  }

  populateAdjacentNodes(map: (GraphNode | null)[][]) {
    for (const { x, y } of getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y })) {
      const adjacentNode = map[y]?.[x];
      if (adjacentNode) {
        this.adjacentNodes.push(adjacentNode);
      }
    }
  }
}

import { MinHeap } from '../data-structures/heap.ts';
import { GraphNode } from './graph-node.ts';

export function findTargetWithAStar<NodeType extends AStarNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
) {
  return findTargetsWithAStar(start, isTargetNode, options, { findAllBestPaths: false })[0];
}

/**
 * Find best paths to target(s) by using A*
 */
export function findTargetsWithAStar<NodeType extends AStarNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
  searchOptions: { findAllBestPaths?: boolean } = {},
) {
  const findAllBestPaths = searchOptions.findAllBestPaths ?? false;
  const pathHeap = new MinHeap<NodeType>((path) => path.getMinScore(options));
  // stateKey => minScore
  const visitedStates = new Map<string, number>();

  pathHeap.addItem(start);

  const bestPaths: NodeType[] = [];

  while (pathHeap.length) {
    const nextQuickestPath = pathHeap.pop();
    const stateKey = nextQuickestPath.getStateKey();
    if (
      visitedStates.has(stateKey) &&
      (!findAllBestPaths || nextQuickestPath.getMinScore(options) > visitedStates.get(stateKey)!)
    ) {
      continue;
    }
    if (isTargetNode(nextQuickestPath)) {
      if (
        bestPaths.length && findAllBestPaths &&
        bestPaths[0].getMinScore(options) !== nextQuickestPath.getMinScore(options)
      ) {
        return bestPaths;
      }
      bestPaths.push(nextQuickestPath);
      if (!findAllBestPaths) {
        return bestPaths;
      }
    }
    visitedStates.set(stateKey, nextQuickestPath.getMinScore(options));
    const adjacentPaths = nextQuickestPath.getAdjacentNodes(options);
    pathHeap.addItems(adjacentPaths);
  }
  throw new Error('Path not found');
}

/**
 * Graph node which can be used to find 'best' route by using A* algorithm.
 */
export abstract class AStarNode<NodeType extends AStarNode<NodeType, Options>, Options> extends GraphNode<NodeType> {
  override nodeState = {
    checked: false,
    previousNode: undefined as NodeType | undefined,
  };

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
    };
  }

  /**
   * Returns adjacent nodes (or "paths").
   * Generally they should have higher "score" than current node.
   * Since score changes based on route, generally new node instances are created.
   */
  abstract getAdjacentNodes(options: Options): NodeType[];

  /**
   * Unique identifier for node state.
   * Same state is generally never visited twice.
   */
  abstract getStateKey(): string;

  /**
   * Minimum score required to get to end.
   * Generally this is "score so far on current path" + "estimated min distance/score to goal".
   * Smaller score is "better".
   */
  abstract getMinScore(options: Options): number;
}

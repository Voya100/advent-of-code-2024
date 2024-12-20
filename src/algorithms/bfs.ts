import { GraphNode } from './graph-node.ts';

/**
 * Generic bredth-first seach implementation
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or nt
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetWithBfs<NodeType extends BfsNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
) {
  const results = findTargetsWithBfs(start, isTargetNode, options, true);
  if (results.size) {
    return results.values().next().value;
  }
  throw new Error('Target not found');
}
/**
 * Generic bredth-first seach implementation for finding all matching nodes.
 * Iterates through whole graph.
 * @param start        Start node
 * @param isTargetNode Callback for determining whether node is the target or not
 * @param options      Options which may be passed to node's getAdjacentNodes method
 * @returns
 */
export function findTargetsWithBfs<NodeType extends BfsNode<NodeType, Options>, Options>(
  start: NodeType,
  isTargetNode: (node: NodeType) => boolean,
  options: Options,
  firstOnly = false,
) {
  const nodesToCheck: NodeType[] = [start];
  let currentNode = start;
  const results = new Set<NodeType>();
  while (nodesToCheck.length) {
    // A dequeue would be a better solution due to shift's O(n) complexity, but is performant enough
    currentNode = nodesToCheck.shift()!;
    if (currentNode.nodeState.checked) {
      continue;
    }
    currentNode.nodeState.checked = true;

    for (const node of currentNode.getAdjacentNodes(options) as NodeType[]) {
      if (!node.nodeState.previousNode && node !== start) {
        nodesToCheck.push(node);
        node.nodeState.previousNode = currentNode;
      }
      if (isTargetNode(node)) {
        results.add(node);
        if (firstOnly) {
          return results;
        }
      }
    }
  }
  return results;
}

/**
 * Generic node type for breadth-first search (BFS)
 */
export abstract class BfsNode<NodeType extends BfsNode<NodeType, Options>, Options> extends GraphNode<NodeType> {
  override nodeState = {
    checked: false,
    distanceCache: undefined as number | undefined,
    previousNode: undefined as NodeType | undefined,
  };

  abstract getAdjacentNodes(options: Options): NodeType[];

  override getDistanceToStart(cache = false): number {
    if (cache && this.nodeState.distanceCache !== undefined) {
      return this.nodeState.distanceCache;
    }
    let counter = 0;
    let previousNode = this.nodeState.previousNode;
    while (previousNode) {
      if (cache && previousNode.nodeState.distanceCache !== undefined) {
        counter += previousNode.nodeState.distanceCache + 1;
        break;
      }
      counter++;
      previousNode = previousNode.previousNode;
    }
    this.nodeState.distanceCache = counter;
    return counter;
  }

  resetNodeState() {
    this.nodeState = {
      checked: false,
      previousNode: undefined,
      distanceCache: undefined,
    };
  }
}

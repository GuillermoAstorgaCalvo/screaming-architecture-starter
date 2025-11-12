import type { TreeNode } from '@src-types/ui/navigation';

/**
 * Gets all visible node IDs (expanded nodes and their visible children)
 */
export function getVisibleNodeIds(
	nodes: readonly TreeNode[],
	expandedNodeIds: Set<string>
): string[] {
	const visibleIds: string[] = [];

	const traverse = (nodeList: readonly TreeNode[]) => {
		for (const node of nodeList) {
			visibleIds.push(node.id);
			if (node.children && node.children.length > 0 && expandedNodeIds.has(node.id)) {
				traverse(node.children);
			}
		}
	};

	traverse(nodes);
	return visibleIds;
}

/**
 * Gets the next visible node ID in the tree
 */
export function getNextVisibleNodeId(
	currentNodeId: string,
	visibleNodeIds: string[],
	direction: 'next' | 'previous'
): string | null {
	const currentIndex = visibleNodeIds.indexOf(currentNodeId);
	if (currentIndex === -1) {
		return visibleNodeIds[0] ?? null;
	}

	if (direction === 'next') {
		const nextIndex = currentIndex + 1;
		return visibleNodeIds[nextIndex] ?? null;
	}
	const prevIndex = currentIndex - 1;
	return prevIndex >= 0 ? (visibleNodeIds[prevIndex] ?? null) : null;
}

/**
 * Gets the first visible node ID
 */
export function getFirstVisibleNodeId(visibleNodeIds: string[]): string | null {
	return visibleNodeIds[0] ?? null;
}

/**
 * Gets the last visible node ID
 */
export function getLastVisibleNodeId(visibleNodeIds: string[]): string | null {
	return visibleNodeIds.at(-1) ?? null;
}

/**
 * Finds a node by ID and returns whether it has children
 */
export function nodeHasChildren(nodes: readonly TreeNode[], nodeId: string): boolean {
	const findNode = (nodeList: readonly TreeNode[]): TreeNode | null => {
		for (const node of nodeList) {
			if (node.id === nodeId) {
				return node;
			}
			if (node.children && node.children.length > 0) {
				const found = findNode(node.children);
				if (found) {
					return found;
				}
			}
		}
		return null;
	};

	const node = findNode(nodes);
	return node?.children !== undefined && node.children.length > 0;
}

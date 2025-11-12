import type { TreeNode } from '@src-types/ui/navigation';

export function flattenNodeIds(nodes: readonly TreeNode[]): string[] {
	const ids: string[] = [];
	const traverse = (nodeList: readonly TreeNode[]) => {
		for (const node of nodeList) {
			ids.push(node.id);
			if (node.children?.length) traverse(node.children);
		}
	};
	traverse(nodes);
	return ids;
}

export function findNodeById(nodes: readonly TreeNode[], nodeId: string): TreeNode | undefined {
	for (const node of nodes) {
		if (node.id === nodeId) return node;
		if (node.children?.length) {
			const found = findNodeById(node.children, nodeId);
			if (found) return found;
		}
	}
	return undefined;
}

export function getInitialExpandedIds(
	nodes: readonly TreeNode[],
	defaultExpandedIds?: readonly string[]
): Set<string> {
	const ids = new Set<string>(defaultExpandedIds ?? []);
	const traverse = (nodeList: readonly TreeNode[]) => {
		for (const node of nodeList) {
			if (node.defaultExpanded) ids.add(node.id);
			if (node.children?.length) traverse(node.children);
		}
	};
	traverse(nodes);
	return ids;
}

export function getInitialSelectedIds(
	nodes: readonly TreeNode[],
	defaultSelectedIds?: readonly string[]
): Set<string> {
	const ids = new Set<string>(defaultSelectedIds ?? []);
	const traverse = (nodeList: readonly TreeNode[]) => {
		for (const node of nodeList) {
			if (node.defaultSelected) ids.add(node.id);
			if (node.children?.length) traverse(node.children);
		}
	};
	traverse(nodes);
	return ids;
}

import type { TreeNode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent } from 'react';

export interface UseTreeViewKeyboardOptions {
	readonly nodes: readonly TreeNode[];
	readonly expandedNodeIds: Set<string>;
	readonly onNodeSelect: (nodeId: string) => void;
	readonly onNodeExpand: (nodeId: string) => void;
	readonly onNodeCollapse: (nodeId: string) => void;
	readonly onNodeToggle: (nodeId: string) => void;
}

export interface UseTreeViewKeyboardReturn {
	readonly handleKeyDown: (event: KeyboardEvent<HTMLDivElement>, currentNodeId: string) => void;
	readonly getNextNodeId: (currentNodeId: string, direction: 'next' | 'previous') => string | null;
	readonly getFirstNodeId: () => string | null;
	readonly getLastNodeId: () => string | null;
}

export interface KeyHandlerContext {
	readonly nodes: readonly TreeNode[];
	readonly expandedNodeIds: Set<string>;
	readonly getNextNodeId: (currentNodeId: string, direction: 'next' | 'previous') => string | null;
	readonly getFirstNodeId: () => string | null;
	readonly getLastNodeId: () => string | null;
	readonly onNodeSelect: (nodeId: string) => void;
	readonly onNodeExpand: (nodeId: string) => void;
	readonly onNodeCollapse: (nodeId: string) => void;
	readonly onNodeToggle: (nodeId: string) => void;
}

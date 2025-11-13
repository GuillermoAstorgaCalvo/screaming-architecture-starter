import type { TreeNode, TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';

export interface UseTreeViewOptions {
	readonly nodes: readonly TreeNode[];
	readonly selectionMode: TreeViewSelectionMode;
	readonly controlledSelectedIds?: readonly string[];
	readonly controlledExpandedIds?: readonly string[];
	readonly defaultSelectedIds?: readonly string[];
	readonly defaultExpandedIds?: readonly string[];
	readonly onSelectionChange?: (selectedNodeIds: string[]) => void;
	readonly onExpansionChange?: (expandedNodeIds: string[]) => void;
}

export interface UseTreeViewReturn {
	readonly selectedNodeIds: Set<string>;
	readonly expandedNodeIds: Set<string>;
	readonly isSelected: (nodeId: string) => boolean;
	readonly isExpanded: (nodeId: string) => boolean;
	readonly toggleSelection: (nodeId: string) => void;
	readonly toggleExpansion: (nodeId: string) => void;
	readonly selectNode: (nodeId: string) => void;
	readonly deselectNode: (nodeId: string) => void;
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
	readonly getAllNodeIds: () => string[];
	readonly getNodeById: (nodeId: string) => TreeNode | undefined;
}

export interface SelectionStateOptions {
	selectionMode: TreeViewSelectionMode;
	controlledSelectedIds?: readonly string[] | undefined;
	defaultSelectedIds?: readonly string[] | undefined;
	nodes: readonly TreeNode[];
	onSelectionChange?: ((ids: string[]) => void) | undefined;
}

export interface ExpansionStateOptions {
	controlledExpandedIds?: readonly string[] | undefined;
	defaultExpandedIds?: readonly string[] | undefined;
	nodes: readonly TreeNode[];
	onExpansionChange?: ((ids: string[]) => void) | undefined;
}

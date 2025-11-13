import type { TreeNode, TreeViewProps } from '@src-types/ui/navigation/treeView';

export interface TreeViewOptionsParams {
	readonly nodes: readonly TreeNode[];
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly controlledSelectedIds: readonly string[] | undefined;
	readonly controlledExpandedIds: readonly string[] | undefined;
	readonly defaultSelectedNodeIds: readonly string[] | undefined;
	readonly defaultExpandedNodeIds: readonly string[] | undefined;
	readonly onSelectionChange: TreeViewProps['onSelectionChange'];
	readonly onExpansionChange: TreeViewProps['onExpansionChange'];
}

export interface TreeViewStateParams {
	readonly nodes: readonly TreeNode[];
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly controlledSelectedIds: readonly string[] | undefined;
	readonly controlledExpandedIds: readonly string[] | undefined;
	readonly defaultSelectedNodeIds: readonly string[] | undefined;
	readonly defaultExpandedNodeIds: readonly string[] | undefined;
	readonly onSelectionChange: TreeViewProps['onSelectionChange'];
	readonly onExpansionChange: TreeViewProps['onExpansionChange'];
}

export interface KeyboardHandlersParams {
	readonly nodes: readonly TreeNode[];
	readonly expandedNodeIds: Set<string>;
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly toggleSelection: (nodeId: string) => void;
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
	readonly toggleExpansion: (nodeId: string) => void;
	readonly getNodeById: (nodeId: string) => TreeNode | undefined;
	readonly setFocusedNodeId: (nodeId: string) => void;
}

export interface TreeViewHandlersParams {
	readonly nodes: readonly TreeNode[];
	readonly expandedNodeIds: Set<string>;
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly toggleSelection: (nodeId: string) => void;
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
	readonly toggleExpansion: (nodeId: string) => void;
	readonly getNodeById: (nodeId: string) => TreeNode | undefined;
	readonly setFocusedNodeId: (nodeId: string) => void;
	readonly onNodeClick?: TreeViewProps['onNodeClick'];
	readonly onNodeDoubleClick?: TreeViewProps['onNodeDoubleClick'];
}

export interface SetupProps {
	readonly nodes: readonly TreeNode[];
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly onNodeClick?: TreeViewProps['onNodeClick'];
	readonly onNodeDoubleClick?: TreeViewProps['onNodeDoubleClick'];
}

export interface TreeStateResult {
	readonly selectedNodeIds: Set<string>;
	readonly expandedNodeIds: Set<string>;
	readonly isSelected: (nodeId: string) => boolean;
	readonly isExpanded: (nodeId: string) => boolean;
	readonly toggleSelection: (nodeId: string) => void;
	readonly toggleExpansion: (nodeId: string) => void;
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
	readonly getAllNodeIds: () => string[];
	readonly getNodeById: (nodeId: string) => TreeNode | undefined;
}

import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * TreeView selection mode types
 */
export type TreeViewSelectionMode = 'single' | 'multiple' | 'none';

/**
 * TreeView node data
 */
export interface TreeNode {
	/** Unique identifier for the node */
	id: string;
	/** Node label/content */
	label: ReactNode;
	/** Optional icon for the node */
	icon?: ReactNode;
	/** Child nodes (for hierarchical structure) */
	children?: readonly TreeNode[];
	/** Whether the node is expanded by default @default false */
	defaultExpanded?: boolean;
	/** Whether the node is disabled @default false */
	disabled?: boolean;
	/** Whether the node is selected by default @default false */
	defaultSelected?: boolean;
	/** Optional custom data associated with the node */
	data?: unknown;
}

/**
 * TreeView component props
 */
export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Array of tree nodes */
	nodes: readonly TreeNode[];
	/** Selection mode @default 'none' */
	selectionMode?: TreeViewSelectionMode;
	/** IDs of selected nodes (controlled mode) */
	selectedNodeIds?: readonly string[];
	/** IDs of expanded nodes (controlled mode) */
	expandedNodeIds?: readonly string[];
	/** Default selected node IDs (uncontrolled mode) */
	defaultSelectedNodeIds?: readonly string[];
	/** Default expanded node IDs (uncontrolled mode) */
	defaultExpandedNodeIds?: readonly string[];
	/** Callback when selection changes */
	onSelectionChange?: (selectedNodeIds: string[]) => void;
	/** Callback when expansion changes */
	onExpansionChange?: (expandedNodeIds: string[]) => void;
	/** Callback when a node is clicked */
	onNodeClick?: (nodeId: string, node: TreeNode) => void;
	/** Callback when a node is double-clicked */
	onNodeDoubleClick?: (nodeId: string, node: TreeNode) => void;
	/** Optional TreeView ID for accessibility */
	treeViewId?: string;
	/** Whether to show expand/collapse icons @default true */
	showExpandIcons?: boolean;
	/** Size of the tree view @default 'md' */
	size?: StandardSize;
}

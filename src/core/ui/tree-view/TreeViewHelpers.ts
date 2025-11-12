import {
	TREE_VIEW_BASE_CLASSES,
	TREE_VIEW_CHILDREN_COLLAPSED_CLASSES,
	TREE_VIEW_CHILDREN_CONTAINER_CLASSES,
	TREE_VIEW_CHILDREN_EXPANDED_CLASSES,
	TREE_VIEW_EXPAND_ICON_CLASSES,
	TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES,
	TREE_VIEW_NODE_BASE_CLASSES,
	TREE_VIEW_NODE_CONTENT_CLASSES,
	TREE_VIEW_NODE_HOVER_CLASSES,
	TREE_VIEW_NODE_ICON_CLASSES,
	TREE_VIEW_NODE_SELECTED_CLASSES,
	TREE_VIEW_NODE_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

/**
 * Gets CSS classes for the TreeView container
 */
export function getTreeViewClasses(className?: string): string {
	return twMerge(TREE_VIEW_BASE_CLASSES, className);
}

/**
 * Gets CSS classes for a TreeView node
 */
export function getTreeNodeClasses(
	size: StandardSize,
	isSelected: boolean,
	className?: string
): string {
	return twMerge(
		TREE_VIEW_NODE_BASE_CLASSES,
		TREE_VIEW_NODE_SIZE_CLASSES[size],
		TREE_VIEW_NODE_HOVER_CLASSES,
		isSelected && TREE_VIEW_NODE_SELECTED_CLASSES,
		className
	);
}

/**
 * Gets CSS classes for TreeView node content
 */
export function getTreeNodeContentClasses(className?: string): string {
	return twMerge(TREE_VIEW_NODE_CONTENT_CLASSES, className);
}

/**
 * Gets CSS classes for TreeView node icon
 */
export function getTreeNodeIconClasses(className?: string): string {
	return twMerge(TREE_VIEW_NODE_ICON_CLASSES, className);
}

/**
 * Gets CSS classes for TreeView expand icon
 */
export function getTreeExpandIconClasses(isExpanded: boolean, className?: string): string {
	return twMerge(
		TREE_VIEW_EXPAND_ICON_CLASSES,
		isExpanded && TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES,
		className
	);
}

/**
 * Gets CSS classes for TreeView children container
 */
export function getTreeChildrenClasses(isExpanded: boolean, className?: string): string {
	return twMerge(
		TREE_VIEW_CHILDREN_CONTAINER_CLASSES,
		isExpanded ? TREE_VIEW_CHILDREN_EXPANDED_CLASSES : TREE_VIEW_CHILDREN_COLLAPSED_CLASSES,
		className
	);
}

/**
 * Generates unique IDs for tree node elements
 */
export function getTreeNodeIds(
	treeViewId: string,
	nodeId: string
): {
	nodeButtonId: string;
	nodeContentId: string;
} {
	const fullNodeId = `${treeViewId}-node-${nodeId}`;
	return {
		nodeButtonId: `${fullNodeId}-button`,
		nodeContentId: `${fullNodeId}-content`,
	};
}

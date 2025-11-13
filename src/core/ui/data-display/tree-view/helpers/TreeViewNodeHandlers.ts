import type {
	CreateClickHandlerParams,
	CreateNodeHandlersParams,
	KeyboardEventHandler,
	MouseEventHandler,
} from '@core/ui/data-display/tree-view/types/TreeViewNodeTypes';
import type { TreeNode } from '@src-types/ui/navigation/treeView';
import type { KeyboardEvent, MouseEvent } from 'react';

// ============================================================================
// Helpers
// ============================================================================

function isNodeDisabled(node: TreeNode): boolean {
	return node.disabled === true;
}

// ============================================================================
// Event Handlers
// ============================================================================

/**
 * Creates click handler for tree node
 * Handles expansion/collapse, selection toggle, and click callback
 */
export function createClickHandler(params: Readonly<CreateClickHandlerParams>): MouseEventHandler {
	const {
		node,
		hasChildren,
		nodeIsExpanded,
		selectionMode,
		onNodeClick,
		onNodeToggle,
		onNodeExpand,
		onNodeCollapse,
	} = params;

	return (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		if (isNodeDisabled(node)) return;

		// Toggle expansion for nodes with children
		if (hasChildren) {
			if (nodeIsExpanded) {
				onNodeCollapse(node.id);
			} else {
				onNodeExpand(node.id);
			}
		}

		// Toggle selection if selection mode is enabled
		if (selectionMode !== 'none') {
			onNodeToggle(node.id);
		}

		// Always call click callback
		onNodeClick(node.id, node);
	};
}

/**
 * Creates double click handler for tree node
 */
function createDoubleClickHandler(
	params: Readonly<{
		node: TreeNode;
		onNodeDoubleClick: (nodeId: string, node: TreeNode) => void;
	}>
): MouseEventHandler {
	const { node, onNodeDoubleClick } = params;
	return (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		if (isNodeDisabled(node)) return;
		onNodeDoubleClick(node.id, node);
	};
}

/**
 * Creates key down handler for tree node
 */
function createKeyDownHandler(
	params: Readonly<{
		node: TreeNode;
		onKeyDown: (event: KeyboardEvent<HTMLDivElement>, nodeId: string) => void;
	}>
): KeyboardEventHandler {
	const { node, onKeyDown } = params;
	return (event: KeyboardEvent<HTMLDivElement>) => {
		if (isNodeDisabled(node)) return;
		onKeyDown(event, node.id);
	};
}

/**
 * Creates all event handlers for a tree node
 */
export function createNodeHandlers(params: Readonly<CreateNodeHandlersParams>): {
	readonly handleClick: MouseEventHandler;
	readonly handleDoubleClick: MouseEventHandler;
	readonly handleKeyDown: KeyboardEventHandler;
} {
	const {
		node,
		hasChildren,
		nodeIsExpanded,
		selectionMode,
		onNodeClick,
		onNodeDoubleClick,
		onNodeToggle,
		onNodeExpand,
		onNodeCollapse,
		onKeyDown,
	} = params;

	return {
		handleClick: createClickHandler({
			node,
			hasChildren,
			nodeIsExpanded,
			selectionMode,
			onNodeClick,
			onNodeToggle,
			onNodeExpand,
			onNodeCollapse,
		}),
		handleDoubleClick: createDoubleClickHandler({ node, onNodeDoubleClick }),
		handleKeyDown: createKeyDownHandler({ node, onKeyDown }),
	};
}

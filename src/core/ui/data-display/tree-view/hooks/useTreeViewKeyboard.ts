import { createKeyboardHandler } from '@core/ui/data-display/tree-view/helpers/useTreeViewKeyboard.handlers';
import {
	getFirstVisibleNodeId,
	getLastVisibleNodeId,
	getNextVisibleNodeId,
	getVisibleNodeIds,
} from '@core/ui/data-display/tree-view/helpers/useTreeViewKeyboard.helpers';
import type {
	KeyHandlerContext,
	UseTreeViewKeyboardOptions,
	UseTreeViewKeyboardReturn,
} from '@core/ui/data-display/tree-view/types/useTreeViewKeyboard.types';

/**
 * Creates key handler functions based on visible node IDs
 */
function createKeyHandlers(visibleNodeIds: string[]) {
	const getNextNodeId = (currentNodeId: string, direction: 'next' | 'previous'): string | null => {
		return getNextVisibleNodeId(currentNodeId, visibleNodeIds, direction);
	};

	const getFirstNodeId = (): string | null => {
		return getFirstVisibleNodeId(visibleNodeIds);
	};

	const getLastNodeId = (): string | null => {
		return getLastVisibleNodeId(visibleNodeIds);
	};

	return { getNextNodeId, getFirstNodeId, getLastNodeId };
}

/**
 * Hook for handling keyboard navigation in TreeView
 *
 * Implements ARIA keyboard navigation patterns:
 * - ArrowRight: Expand node if collapsed, or move to first child
 * - ArrowLeft: Collapse node if expanded, or move to parent
 * - ArrowDown: Move to next visible node
 * - ArrowUp: Move to previous visible node
 * - Home: Move to first node
 * - End: Move to last node
 * - Enter/Space: Toggle selection (if selection mode is enabled)
 */
export function useTreeViewKeyboard({
	nodes,
	expandedNodeIds,
	onNodeSelect,
	onNodeExpand,
	onNodeCollapse,
	onNodeToggle,
}: UseTreeViewKeyboardOptions): UseTreeViewKeyboardReturn {
	const visibleNodeIds = getVisibleNodeIds(nodes, expandedNodeIds);
	const { getNextNodeId, getFirstNodeId, getLastNodeId } = createKeyHandlers(visibleNodeIds);

	const context: KeyHandlerContext = {
		nodes,
		expandedNodeIds,
		getNextNodeId,
		getFirstNodeId,
		getLastNodeId,
		onNodeSelect,
		onNodeExpand,
		onNodeCollapse,
		onNodeToggle,
	};

	const handleKeyDown = createKeyboardHandler(context);

	return {
		handleKeyDown,
		getNextNodeId,
		getFirstNodeId,
		getLastNodeId,
	};
}

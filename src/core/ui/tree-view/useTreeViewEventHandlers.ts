import type { TreeNode, TreeViewProps } from '@src-types/ui/navigation';
import { useCallback } from 'react';

interface ClickHandlersParams {
	readonly onNodeClick?: TreeViewProps['onNodeClick'];
	readonly onNodeDoubleClick?: TreeViewProps['onNodeDoubleClick'];
}

/**
 * Creates click event handlers for tree nodes
 */
function useClickHandlers(params: ClickHandlersParams) {
	const handleNodeClick = useCallback(
		(nodeId: string, node: TreeNode) => {
			params.onNodeClick?.(nodeId, node);
		},
		[params]
	);

	const handleNodeDoubleClick = useCallback(
		(nodeId: string, node: TreeNode) => {
			params.onNodeDoubleClick?.(nodeId, node);
		},
		[params]
	);

	return { handleNodeClick, handleNodeDoubleClick };
}

interface ToggleHandlerParams {
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly toggleSelection: (nodeId: string) => void;
}

/**
 * Creates toggle selection handler for tree nodes
 */
function useToggleHandler(params: ToggleHandlerParams) {
	const handleNodeToggle = useCallback(
		(nodeId: string) => {
			if (params.selectionMode !== 'none') {
				params.toggleSelection(nodeId);
			}
		},
		[params]
	);

	return { handleNodeToggle };
}

interface ExpansionHandlersParams {
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
}

/**
 * Creates expansion/collapse handlers for tree nodes
 */
function useExpansionHandlers(params: ExpansionHandlersParams) {
	const handleNodeExpand = useCallback(
		(nodeId: string) => {
			params.expandNode(nodeId);
		},
		[params]
	);

	const handleNodeCollapse = useCallback(
		(nodeId: string) => {
			params.collapseNode(nodeId);
		},
		[params]
	);

	return { handleNodeExpand, handleNodeCollapse };
}

interface EventHandlersParams {
	readonly onNodeClick?: TreeViewProps['onNodeClick'];
	readonly onNodeDoubleClick?: TreeViewProps['onNodeDoubleClick'];
	readonly selectionMode: TreeViewProps['selectionMode'];
	readonly toggleSelection: (nodeId: string) => void;
	readonly expandNode: (nodeId: string) => void;
	readonly collapseNode: (nodeId: string) => void;
}

/**
 * Creates event handlers for tree nodes
 */
export function useTreeViewEventHandlers(params: EventHandlersParams) {
	const { handleNodeClick, handleNodeDoubleClick } = useClickHandlers({
		onNodeClick: params.onNodeClick,
		onNodeDoubleClick: params.onNodeDoubleClick,
	});
	const { handleNodeToggle } = useToggleHandler({
		selectionMode: params.selectionMode,
		toggleSelection: params.toggleSelection,
	});
	const { handleNodeExpand, handleNodeCollapse } = useExpansionHandlers({
		expandNode: params.expandNode,
		collapseNode: params.collapseNode,
	});

	return {
		handleNodeClick,
		handleNodeDoubleClick,
		handleNodeToggle,
		handleNodeExpand,
		handleNodeCollapse,
	};
}

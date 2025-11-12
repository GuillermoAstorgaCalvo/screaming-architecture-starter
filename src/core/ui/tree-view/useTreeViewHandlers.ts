import { useTreeViewEventHandlers } from './useTreeViewEventHandlers';
import { useTreeViewKeyboardHandlers } from './useTreeViewKeyboardHandlers';
import type { SetupProps, TreeStateResult, TreeViewHandlersParams } from './useTreeViewSetup.types';

export function useTreeViewHandlers(params: TreeViewHandlersParams) {
	const eventHandlers = useTreeViewEventHandlers({
		onNodeClick: params.onNodeClick,
		onNodeDoubleClick: params.onNodeDoubleClick,
		selectionMode: params.selectionMode,
		toggleSelection: params.toggleSelection,
		expandNode: params.expandNode,
		collapseNode: params.collapseNode,
	});
	const handleKeyDown = useTreeViewKeyboardHandlers({
		nodes: params.nodes,
		expandedNodeIds: params.expandedNodeIds,
		selectionMode: params.selectionMode,
		toggleSelection: params.toggleSelection,
		expandNode: params.expandNode,
		collapseNode: params.collapseNode,
		toggleExpansion: params.toggleExpansion,
		getNodeById: params.getNodeById,
		setFocusedNodeId: params.setFocusedNodeId,
	});
	return { ...eventHandlers, handleKeyDown };
}

export function useTreeViewHandlersFromState(
	setupProps: SetupProps,
	treeState: TreeStateResult,
	setFocusedNodeId: (nodeId: string) => void
) {
	return useTreeViewHandlers({
		nodes: setupProps.nodes,
		expandedNodeIds: treeState.expandedNodeIds,
		selectionMode: setupProps.selectionMode,
		toggleSelection: treeState.toggleSelection,
		expandNode: treeState.expandNode,
		collapseNode: treeState.collapseNode,
		toggleExpansion: treeState.toggleExpansion,
		getNodeById: treeState.getNodeById,
		setFocusedNodeId,
		onNodeClick: setupProps.onNodeClick,
		onNodeDoubleClick: setupProps.onNodeDoubleClick,
	});
}

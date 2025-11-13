import { useTreeNodeUtils } from '@core/ui/data-display/tree-view/hooks/useTreeView.hooks';
import {
	useExpansionState,
	useSelectionState,
} from '@core/ui/data-display/tree-view/hooks/useTreeView.state';
import type {
	UseTreeViewOptions,
	UseTreeViewReturn,
} from '@core/ui/data-display/tree-view/types/useTreeView.types';

function useTreeViewState(options: UseTreeViewOptions) {
	const {
		nodes,
		selectionMode,
		controlledSelectedIds,
		controlledExpandedIds,
		defaultSelectedIds,
		defaultExpandedIds,
		onSelectionChange,
		onExpansionChange,
	} = options;
	const selection = useSelectionState({
		selectionMode,
		controlledSelectedIds,
		defaultSelectedIds,
		nodes,
		onSelectionChange,
	});
	const expansion = useExpansionState({
		controlledExpandedIds,
		defaultExpandedIds,
		nodes,
		onExpansionChange,
	});
	return { selection, expansion };
}

export function useTreeView(options: UseTreeViewOptions): UseTreeViewReturn {
	const { nodes } = options;
	const nodeUtils = useTreeNodeUtils(nodes);
	const state = useTreeViewState(options);
	return {
		selectedNodeIds: state.selection.selectedNodeIds,
		expandedNodeIds: state.expansion.expandedNodeIds,
		isSelected: state.selection.isSelected,
		isExpanded: state.expansion.isExpanded,
		toggleSelection: state.selection.toggleSelection,
		toggleExpansion: state.expansion.toggleExpansion,
		selectNode: state.selection.selectNode,
		deselectNode: state.selection.deselectNode,
		expandNode: state.expansion.expandNode,
		collapseNode: state.expansion.collapseNode,
		getAllNodeIds: nodeUtils.getAllNodeIds,
		getNodeById: nodeUtils.getNodeById,
	};
}

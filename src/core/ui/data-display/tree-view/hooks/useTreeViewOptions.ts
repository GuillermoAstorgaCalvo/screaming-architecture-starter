import { useTreeView } from '@core/ui/data-display/tree-view/hooks/useTreeView';
import type {
	SetupProps,
	TreeViewOptionsParams,
	TreeViewStateParams,
} from '@core/ui/data-display/tree-view/types/useTreeViewSetup.types';
import type { TreeViewProps } from '@src-types/ui/navigation/treeView';
import { useMemo } from 'react';

export function buildTreeViewOptions(params: TreeViewOptionsParams) {
	return {
		nodes: params.nodes,
		selectionMode: params.selectionMode ?? 'none',
		...(params.controlledSelectedIds !== undefined && {
			controlledSelectedIds: params.controlledSelectedIds,
		}),
		...(params.controlledExpandedIds !== undefined && {
			controlledExpandedIds: params.controlledExpandedIds,
		}),
		...(params.defaultSelectedNodeIds !== undefined && {
			defaultSelectedIds: params.defaultSelectedNodeIds,
		}),
		...(params.defaultExpandedNodeIds !== undefined && {
			defaultExpandedIds: params.defaultExpandedNodeIds,
		}),
		...(params.onSelectionChange && { onSelectionChange: params.onSelectionChange }),
		...(params.onExpansionChange && { onExpansionChange: params.onExpansionChange }),
	};
}

export function useTreeViewState(params: TreeViewStateParams) {
	const treeViewOptions = useMemo(() => buildTreeViewOptions(params), [params]);
	return useTreeView(treeViewOptions);
}

export function extractSetupProps(
	props: Readonly<TreeViewProps>
): SetupProps & TreeViewStateParams {
	const {
		nodes,
		selectionMode = 'none',
		selectedNodeIds: controlledSelectedIds,
		expandedNodeIds: controlledExpandedIds,
		defaultSelectedNodeIds,
		defaultExpandedNodeIds,
		onSelectionChange,
		onExpansionChange,
		onNodeClick,
		onNodeDoubleClick,
	} = props;
	return {
		nodes,
		selectionMode,
		controlledSelectedIds,
		controlledExpandedIds,
		defaultSelectedNodeIds,
		defaultExpandedNodeIds,
		onSelectionChange,
		onExpansionChange,
		onNodeClick,
		onNodeDoubleClick,
	};
}

import { useFocusedNodeState } from '@core/ui/data-display/tree-view/hooks/useTreeViewFocus';
import { useTreeViewHandlersFromState } from '@core/ui/data-display/tree-view/hooks/useTreeViewHandlers';
import {
	extractSetupProps,
	useTreeViewState,
} from '@core/ui/data-display/tree-view/hooks/useTreeViewOptions';
import type { TreeViewProps } from '@src-types/ui/navigation/treeView';

/**
 * Custom hook that sets up all TreeView state and handlers
 */
export function useTreeViewSetup(props: Readonly<TreeViewProps>) {
	const setupProps = extractSetupProps(props);
	const treeState = useTreeViewState(setupProps);
	const [focusedNodeId, setFocusedNodeId] = useFocusedNodeState(treeState);
	const handlers = useTreeViewHandlersFromState(setupProps, treeState, setFocusedNodeId);
	return {
		nodes: setupProps.nodes,
		isSelected: treeState.isSelected,
		isExpanded: treeState.isExpanded,
		selectionMode: setupProps.selectionMode,
		focusedNodeId,
		...handlers,
	};
}

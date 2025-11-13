import {
	getInitialExpandedIds,
	getInitialSelectedIds,
} from '@core/ui/data-display/tree-view/helpers/useTreeView.utils';
import {
	createExpansionCallbacks,
	createSelectionCallbacks,
} from '@core/ui/data-display/tree-view/helpers/useTreeViewCallbacks';
import type {
	ExpansionStateOptions,
	SelectionStateOptions,
} from '@core/ui/data-display/tree-view/types/useTreeView.types';
import { useCallback, useMemo, useState } from 'react';

export function useSelectionState(options: SelectionStateOptions) {
	const { selectionMode, controlledSelectedIds, defaultSelectedIds, nodes, onSelectionChange } =
		options;
	const initialSelectedIds = useMemo(
		() => getInitialSelectedIds(nodes, defaultSelectedIds),
		[nodes, defaultSelectedIds]
	);
	const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(initialSelectedIds);
	const isSelectedControlled = controlledSelectedIds !== undefined;
	const selectedNodeIds = useMemo(
		() => (isSelectedControlled ? new Set(controlledSelectedIds) : internalSelectedIds),
		[isSelectedControlled, controlledSelectedIds, internalSelectedIds]
	);
	const isSelected = useCallback(
		(nodeId: string) => selectedNodeIds.has(nodeId),
		[selectedNodeIds]
	);
	const callbacks = useMemo(
		() =>
			createSelectionCallbacks({
				selectionMode,
				selectedNodeIds,
				isSelectedControlled,
				setInternalSelectedIds,
				onSelectionChange,
			}),
		[selectionMode, selectedNodeIds, isSelectedControlled, onSelectionChange]
	);
	const toggleSelection = useCallback(
		(nodeId: string) => callbacks.toggleSelection(nodeId),
		[callbacks]
	);
	const selectNode = useCallback((nodeId: string) => callbacks.selectNode(nodeId), [callbacks]);
	const deselectNode = useCallback((nodeId: string) => callbacks.deselectNode(nodeId), [callbacks]);
	return { selectedNodeIds, isSelected, toggleSelection, selectNode, deselectNode };
}

export function useExpansionState(options: ExpansionStateOptions) {
	const { controlledExpandedIds, defaultExpandedIds, nodes, onExpansionChange } = options;
	const initialExpandedIds = useMemo(
		() => getInitialExpandedIds(nodes, defaultExpandedIds),
		[nodes, defaultExpandedIds]
	);
	const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(initialExpandedIds);
	const isExpandedControlled = controlledExpandedIds !== undefined;
	const expandedNodeIds = useMemo(
		() => (isExpandedControlled ? new Set(controlledExpandedIds) : internalExpandedIds),
		[isExpandedControlled, controlledExpandedIds, internalExpandedIds]
	);
	const isExpanded = useCallback(
		(nodeId: string) => expandedNodeIds.has(nodeId),
		[expandedNodeIds]
	);
	const callbacks = useMemo(
		() =>
			createExpansionCallbacks({
				expandedNodeIds,
				isExpandedControlled,
				setInternalExpandedIds,
				onExpansionChange,
			}),
		[expandedNodeIds, isExpandedControlled, onExpansionChange]
	);
	const toggleExpansion = useCallback(
		(nodeId: string) => callbacks.toggleExpansion(nodeId),
		[callbacks]
	);
	const expandNode = useCallback((nodeId: string) => callbacks.expandNode(nodeId), [callbacks]);
	const collapseNode = useCallback((nodeId: string) => callbacks.collapseNode(nodeId), [callbacks]);
	return { expandedNodeIds, isExpanded, toggleExpansion, expandNode, collapseNode };
}

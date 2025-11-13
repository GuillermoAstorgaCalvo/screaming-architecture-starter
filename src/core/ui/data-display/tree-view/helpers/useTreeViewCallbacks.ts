import type { TreeViewSelectionMode } from '@src-types/ui/navigation/treeView';

export interface SelectionCallbacksOptions {
	selectionMode: TreeViewSelectionMode;
	selectedNodeIds: Set<string>;
	isSelectedControlled: boolean;
	setInternalSelectedIds: (ids: Set<string>) => void;
	onSelectionChange?: ((ids: string[]) => void) | undefined;
}

export function createSelectionCallbacks(opts: SelectionCallbacksOptions) {
	const {
		selectionMode,
		selectedNodeIds,
		isSelectedControlled,
		setInternalSelectedIds,
		onSelectionChange,
	} = opts;
	const updateSelection = (newIds: Set<string>) => {
		if (!isSelectedControlled) setInternalSelectedIds(newIds);
		onSelectionChange?.(Array.from(newIds));
	};
	const toggleSelection = (nodeId: string) => {
		if (selectionMode === 'none') return;
		const newIds = new Set(selectedNodeIds);
		if (newIds.has(nodeId)) newIds.delete(nodeId);
		else {
			if (selectionMode === 'single') newIds.clear();
			newIds.add(nodeId);
		}
		updateSelection(newIds);
	};
	const selectNode = (nodeId: string) => {
		if (selectionMode === 'none') return;
		const newIds = new Set(selectedNodeIds);
		if (selectionMode === 'single') newIds.clear();
		newIds.add(nodeId);
		updateSelection(newIds);
	};
	const deselectNode = (nodeId: string) => {
		if (selectionMode === 'none') return;
		const newIds = new Set(selectedNodeIds);
		newIds.delete(nodeId);
		updateSelection(newIds);
	};
	return { toggleSelection, selectNode, deselectNode };
}

export interface ExpansionCallbacksOptions {
	expandedNodeIds: Set<string>;
	isExpandedControlled: boolean;
	setInternalExpandedIds: (ids: Set<string>) => void;
	onExpansionChange?: ((ids: string[]) => void) | undefined;
}

export function createExpansionCallbacks(opts: ExpansionCallbacksOptions) {
	const { expandedNodeIds, isExpandedControlled, setInternalExpandedIds, onExpansionChange } = opts;
	const updateExpansion = (newIds: Set<string>) => {
		if (!isExpandedControlled) setInternalExpandedIds(newIds);
		onExpansionChange?.(Array.from(newIds));
	};
	const toggleExpansion = (nodeId: string) => {
		const newIds = new Set(expandedNodeIds);
		if (newIds.has(nodeId)) newIds.delete(nodeId);
		else newIds.add(nodeId);
		updateExpansion(newIds);
	};
	const expandNode = (nodeId: string) => {
		const newIds = new Set(expandedNodeIds);
		newIds.add(nodeId);
		updateExpansion(newIds);
	};
	const collapseNode = (nodeId: string) => {
		const newIds = new Set(expandedNodeIds);
		newIds.delete(nodeId);
		updateExpansion(newIds);
	};
	return { toggleExpansion, expandNode, collapseNode };
}

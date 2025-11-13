import { useCallback, useMemo, useState } from 'react';

export interface UseDataTableSelectionOptions {
	initialSelectedIds?: string[];
	onSelectionChange?: (selectedIds: string[]) => void;
}

export interface UseDataTableSelectionReturn {
	selectedRowIds: Set<string>;
	isSelected: (rowId: string) => boolean;
	isAllSelected: (rowIds: string[]) => boolean;
	isSomeSelected: (rowIds: string[]) => boolean;
	toggleRow: (rowId: string) => void;
	toggleAll: (rowIds: string[]) => void;
	selectRow: (rowId: string) => void;
	deselectRow: (rowId: string) => void;
	selectAll: (rowIds: string[]) => void;
	clearSelection: () => void;
	selectedCount: number;
}

// Pure helper functions for selection checks
function checkIsSelected(selectedRowIds: Set<string>, rowId: string): boolean {
	return selectedRowIds.has(rowId);
}

function checkIsAllSelected(selectedRowIds: Set<string>, rowIds: string[]): boolean {
	return rowIds.length > 0 && rowIds.every(id => selectedRowIds.has(id));
}

function checkIsSomeSelected(
	selectedRowIds: Set<string>,
	rowIds: string[],
	isAllSelected: boolean
): boolean {
	return rowIds.some(id => selectedRowIds.has(id)) && !isAllSelected;
}

// Selection updater factories
function createToggleRowUpdater(rowId: string) {
	return (set: Set<string>) => {
		if (set.has(rowId)) set.delete(rowId);
		else set.add(rowId);
	};
}

function createToggleAllUpdater(rowIds: string[], allSelected: boolean) {
	return (set: Set<string>) => {
		for (const id of rowIds) {
			if (allSelected) set.delete(id);
			else set.add(id);
		}
	};
}

function createSelectAllUpdater(rowIds: string[]) {
	return (set: Set<string>) => {
		for (const id of rowIds) set.add(id);
	};
}

function createSelectRowUpdater(rowId: string) {
	return (set: Set<string>) => set.add(rowId);
}

function createDeselectRowUpdater(rowId: string) {
	return (set: Set<string>) => set.delete(rowId);
}

// Hook implementation
function useSelectionUpdater(
	selectedRowIds: Set<string>,
	setSelectedRowIds: (value: Set<string>) => void,
	onSelectionChange?: (selectedIds: string[]) => void
) {
	return useCallback(
		(updater: (set: Set<string>) => void) => {
			const newSelection = new Set(selectedRowIds);
			updater(newSelection);
			setSelectedRowIds(newSelection);
			onSelectionChange?.(Array.from(newSelection));
		},
		[selectedRowIds, setSelectedRowIds, onSelectionChange]
	);
}

function useSelectionCheckers(selectedRowIds: Set<string>) {
	const isSelected = useCallback(
		(rowId: string) => checkIsSelected(selectedRowIds, rowId),
		[selectedRowIds]
	);
	const isAllSelected = useCallback(
		(rowIds: string[]) => checkIsAllSelected(selectedRowIds, rowIds),
		[selectedRowIds]
	);
	const isSomeSelected = useCallback(
		(rowIds: string[]) => checkIsSomeSelected(selectedRowIds, rowIds, isAllSelected(rowIds)),
		[selectedRowIds, isAllSelected]
	);
	return { isSelected, isAllSelected, isSomeSelected };
}

function useSelectionActions(
	applySelection: (updater: (set: Set<string>) => void) => void,
	isAllSelected: (rowIds: string[]) => boolean
) {
	const toggleRow = useCallback(
		(rowId: string) => applySelection(createToggleRowUpdater(rowId)),
		[applySelection]
	);
	const toggleAll = useCallback(
		(rowIds: string[]) => applySelection(createToggleAllUpdater(rowIds, isAllSelected(rowIds))),
		[applySelection, isAllSelected]
	);
	const selectRow = useCallback(
		(rowId: string) => applySelection(createSelectRowUpdater(rowId)),
		[applySelection]
	);
	const deselectRow = useCallback(
		(rowId: string) => applySelection(createDeselectRowUpdater(rowId)),
		[applySelection]
	);
	const selectAll = useCallback(
		(rowIds: string[]) => applySelection(createSelectAllUpdater(rowIds)),
		[applySelection]
	);
	return { toggleRow, toggleAll, selectRow, deselectRow, selectAll };
}

function useClearSelection(
	setSelectedRowIds: (value: Set<string>) => void,
	onSelectionChange?: (selectedIds: string[]) => void
) {
	return useCallback(() => {
		setSelectedRowIds(new Set());
		onSelectionChange?.([]);
	}, [setSelectedRowIds, onSelectionChange]);
}

/**
 * Hook for managing DataTable row selection state
 */
export function useDataTableSelection({
	initialSelectedIds,
	onSelectionChange,
}: UseDataTableSelectionOptions): UseDataTableSelectionReturn {
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
		() => new Set(initialSelectedIds ?? [])
	);
	const applySelection = useSelectionUpdater(selectedRowIds, setSelectedRowIds, onSelectionChange);
	const { isSelected, isAllSelected, isSomeSelected } = useSelectionCheckers(selectedRowIds);
	const { toggleRow, toggleAll, selectRow, deselectRow, selectAll } = useSelectionActions(
		applySelection,
		isAllSelected
	);
	const clearSelection = useClearSelection(setSelectedRowIds, onSelectionChange);
	const selectedCount = useMemo(() => selectedRowIds.size, [selectedRowIds]);

	return {
		selectedRowIds,
		isSelected,
		isAllSelected,
		isSomeSelected,
		toggleRow,
		toggleAll,
		selectRow,
		deselectRow,
		selectAll,
		clearSelection,
		selectedCount,
	};
}

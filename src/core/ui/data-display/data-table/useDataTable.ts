import type { DataTableColumn } from '@src-types/ui/dataTable';
import { useMemo } from 'react';

import { useDataTablePagination } from './useDataTablePagination';
import { useDataTableSelection } from './useDataTableSelection';

interface UseDataTableOptions<T> {
	initialData: T[];
	filteredData: T[];
	sortedData: T[];
	columns: DataTableColumn<T>[];
	getRowId: ((row: T, index: number) => string) | undefined;
	enablePagination: boolean;
	initialPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	controlledSelectedIds?: string[];
	onSelectionChange?: (selectedRowIds: string[]) => void;
}

/**
 * Pure function to compute row IDs from data
 */
function computeRowIds<T>(
	data: T[],
	getRowId: ((row: T, index: number) => string) | undefined
): string[] {
	return data.map((row, index) => (getRowId ? getRowId(row, index) : `row-${index}`));
}

/**
 * Hook to compute and memoize row IDs
 */
function useRowIds<T>(
	sortedData: T[],
	getRowId: ((row: T, index: number) => string) | undefined
): string[] {
	return useMemo(() => computeRowIds(sortedData, getRowId), [sortedData, getRowId]);
}

/**
 * Hook to manage selection state and compute selection flags
 */
function useSelectionState(
	rowIds: string[],
	controlledSelectedIds?: string[],
	onSelectionChange?: (selectedRowIds: string[]) => void
) {
	const { selectedRowIds, isAllSelected, isSomeSelected, toggleRow, toggleAll } =
		useDataTableSelection({
			...(controlledSelectedIds ? { initialSelectedIds: controlledSelectedIds } : {}),
			...(onSelectionChange ? { onSelectionChange } : {}),
		});

	const allRowIdsSelected = useMemo(() => isAllSelected(rowIds), [isAllSelected, rowIds]);

	const someRowIdsSelected = useMemo(() => isSomeSelected(rowIds), [isSomeSelected, rowIds]);

	return {
		selectedRowIds,
		allRowIdsSelected,
		someRowIdsSelected,
		toggleRow,
		toggleAll,
	};
}

/**
 * Hook to manage pagination state
 */
function usePaginationState(options: {
	sortedDataLength: number;
	initialPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
}) {
	return useDataTablePagination({
		initialPage: options.initialPage,
		pageSize: options.pageSize,
		totalItems: options.sortedDataLength,
		...(options.onPageChange ? { onPageChange: options.onPageChange } : {}),
	});
}

/**
 * Hook to compute display data based on pagination
 */
function useDisplayData<T>(
	sortedData: T[],
	enablePagination: boolean,
	paginatedData: <U>(data: U[]) => U[]
): T[] {
	return useMemo(
		() => (enablePagination ? paginatedData(sortedData) : sortedData),
		[enablePagination, paginatedData, sortedData]
	);
}

/**
 * Main hook for managing DataTable state
 */
export function useDataTable<T>({
	initialData: _initialData,
	filteredData: _filteredData,
	sortedData,
	columns: _columns,
	getRowId,
	enablePagination,
	initialPage,
	pageSize,
	onPageChange,
	controlledSelectedIds,
	onSelectionChange,
}: UseDataTableOptions<T>) {
	const rowIds = useRowIds(sortedData, getRowId);

	const { selectedRowIds, allRowIdsSelected, someRowIdsSelected, toggleRow, toggleAll } =
		useSelectionState(rowIds, controlledSelectedIds, onSelectionChange);

	const { currentPage, totalPages, setPage, paginatedData, startIndex, endIndex, totalItems } =
		usePaginationState({
			sortedDataLength: sortedData.length,
			initialPage,
			pageSize,
			...(onPageChange ? { onPageChange } : {}),
		});

	const displayData = useDisplayData(sortedData, enablePagination, paginatedData);

	return {
		rowIds,
		selectedRowIds,
		allRowIdsSelected,
		someRowIdsSelected,
		toggleRow,
		toggleAll,
		currentPage,
		totalPages,
		setPage,
		displayData,
		startIndex,
		endIndex,
		totalItems,
	};
}

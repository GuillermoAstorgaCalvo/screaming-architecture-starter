import {
	applyFilters,
	type useDataTableFilter,
} from '@core/ui/data-display/data-table/hooks/useDataTableFilter';
import type { useDataTableSort } from '@core/ui/data-display/data-table/hooks/useDataTableSort';
import { useDataTableSorting } from '@core/ui/data-display/data-table/hooks/useDataTableSorting';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { useMemo } from 'react';

export interface UseDataTableDataTransformationOptions<T> {
	initialData: T[];
	filter: ReturnType<typeof useDataTableFilter>['filter'];
	columns: DataTableColumn<T>[];
	sort: ReturnType<typeof useDataTableSort<T>>['sort'];
}

export interface CreateDataTableHandlersOptions {
	setColumnWidth: (columnId: string, width: number) => void;
	toggleSort: (columnId: string) => void;
	toggleAll: (rowIds: string[]) => void;
}

/**
 * Hook for transforming data through filtering and sorting
 */
export function useDataTableDataTransformation<T>({
	initialData,
	filter,
	columns,
	sort,
}: UseDataTableDataTransformationOptions<T>) {
	const filteredData = useMemo(
		() => applyFilters(initialData, filter, columns),
		[initialData, filter, columns]
	);

	const sortedData = useDataTableSorting(filteredData, sort, columns);

	return { filteredData, sortedData };
}

/**
 * Creates handler functions for data table interactions
 */
export function createDataTableHandlers({
	setColumnWidth,
	toggleSort,
	toggleAll,
}: CreateDataTableHandlersOptions) {
	const handleColumnResize = (columnId: string, width: number, enableColumnResize: boolean) => {
		if (enableColumnResize) setColumnWidth(columnId, width);
	};

	const handleSort = (columnId: string, enableSorting: boolean) => {
		if (enableSorting) toggleSort(columnId);
	};

	const handleSelectAll = (rowIds: string[], enableRowSelection: boolean) => {
		if (enableRowSelection) toggleAll(rowIds);
	};

	return { handleColumnResize, handleSort, handleSelectAll };
}

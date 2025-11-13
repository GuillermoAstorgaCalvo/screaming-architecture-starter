import type { DataTableColumn, DataTableFilter } from '@src-types/ui/dataTable';
import { useCallback, useState } from 'react';

export interface UseDataTableFilterOptions {
	initialFilter?: DataTableFilter;
	onFilterChange?: (filter: DataTableFilter) => void;
}

export interface UseDataTableFilterReturn {
	filter: DataTableFilter;
	setGlobalSearch: (value: string) => void;
	setColumnFilter: (columnId: string, value: string) => void;
	clearFilter: () => void;
	clearColumnFilter: (columnId: string) => void;
}

function createFilterWithGlobalSearch(filter: DataTableFilter, value: string): DataTableFilter {
	return { ...filter, globalSearch: value };
}

function createFilterWithColumnFilter(
	filter: DataTableFilter,
	columnId: string,
	value: string
): DataTableFilter {
	return {
		...filter,
		columnFilters: { ...filter.columnFilters, [columnId]: value },
	};
}

function createClearedFilter(): DataTableFilter {
	return { globalSearch: '', columnFilters: {} };
}

function createFilterWithoutColumn(filter: DataTableFilter, columnId: string): DataTableFilter {
	const { [columnId]: _, ...restColumnFilters } = filter.columnFilters ?? {};
	return { ...filter, columnFilters: restColumnFilters };
}

/**
 * Hook for managing DataTable filtering state
 */
export function useDataTableFilter({
	initialFilter,
	onFilterChange,
}: UseDataTableFilterOptions): UseDataTableFilterReturn {
	const [filter, setFilter] = useState<DataTableFilter>(
		initialFilter ?? { globalSearch: '', columnFilters: {} }
	);

	const updateFilter = useCallback(
		(newFilter: DataTableFilter) => {
			setFilter(newFilter);
			onFilterChange?.(newFilter);
		},
		[onFilterChange]
	);

	const setGlobalSearch = useCallback(
		(value: string) => updateFilter(createFilterWithGlobalSearch(filter, value)),
		[filter, updateFilter]
	);

	const setColumnFilter = useCallback(
		(columnId: string, value: string) =>
			updateFilter(createFilterWithColumnFilter(filter, columnId, value)),
		[filter, updateFilter]
	);

	const clearFilter = useCallback(() => updateFilter(createClearedFilter()), [updateFilter]);

	const clearColumnFilter = useCallback(
		(columnId: string) => updateFilter(createFilterWithoutColumn(filter, columnId)),
		[filter, updateFilter]
	);

	return {
		filter,
		setGlobalSearch,
		setColumnFilter,
		clearFilter,
		clearColumnFilter,
	};
}

/**
 * Apply filters to data
 */
export function applyFilters<T>(
	data: T[],
	filter: DataTableFilter,
	columns: DataTableColumn<T>[]
): T[] {
	let filtered = data;

	// Apply global search
	if (filter.globalSearch?.trim()) {
		const searchTerm = filter.globalSearch.toLowerCase();
		filtered = filtered.filter(row => {
			return columns.some(column => {
				const value = column.accessor(row);
				if (value == null) return false;
				const stringValue =
					typeof value === 'string' || typeof value === 'number'
						? String(value).toLowerCase()
						: JSON.stringify(value).toLowerCase();
				return stringValue.includes(searchTerm);
			});
		});
	}

	// Apply column-specific filters
	const { columnFilters } = filter;
	if (columnFilters) {
		for (const [columnId, filterValue] of Object.entries(columnFilters)) {
			if (typeof filterValue !== 'string' || !filterValue.trim()) continue;

			const column = columns.find(col => col.id === columnId);
			if (!column) continue;

			const filterFn = column.columnFilterFn ?? defaultColumnFilterFn(column);
			filtered = filtered.filter(row => filterFn(row, filterValue));
		}
	}

	// Apply custom filter function
	const { customFilter } = filter;
	if (customFilter) {
		filtered = filtered.filter(row => customFilter(row));
	}

	return filtered;
}

function defaultColumnFilterFn<T>(column: DataTableColumn<T>) {
	return (row: T, filterValue: string): boolean => {
		const value = column.accessor(row);
		if (value == null) return false;
		const stringValue =
			typeof value === 'string' || typeof value === 'number'
				? String(value).toLowerCase()
				: JSON.stringify(value).toLowerCase();
		return stringValue.includes(filterValue.toLowerCase());
	};
}

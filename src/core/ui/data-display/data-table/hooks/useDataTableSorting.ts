import type { ColumnSort, DataTableColumn } from '@src-types/ui/dataTable';
import { useMemo } from 'react';

/**
 * Apply sorting to data
 */
export function applySorting<T>(
	data: T[],
	sort: ColumnSort<T> | null,
	columns: DataTableColumn<T>[]
): T[] {
	if (!sort?.direction) {
		return data;
	}

	const column = columns.find(col => col.id === sort.columnId);
	if (!column) {
		return data;
	}

	const sortedData = [...data];
	const sortFn = getColumnSortFn(column, sort);

	sortedData.sort((a, b) => {
		const result = sortFn(a, b);
		return sort.direction === 'desc' ? -result : result;
	});

	return sortedData;
}

function defaultSortFn<T>(a: T, b: T, direction: 'asc' | 'desc' | null): number {
	if (direction === null) return 0;

	// Try to compare as numbers first
	const aNum = Number(a);
	const bNum = Number(b);
	if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
		return aNum - bNum;
	}

	// Fall back to string comparison
	const aStr = String(a ?? '').toLowerCase();
	const bStr = String(b ?? '').toLowerCase();

	if (aStr < bStr) return -1;
	if (aStr > bStr) return 1;
	return 0;
}

/**
 * Get sort function for a column
 */
export function getColumnSortFn<T>(
	column: DataTableColumn<T>,
	sort: ColumnSort<T>
): (a: T, b: T) => number {
	if (sort.sortFn) {
		return sort.sortFn;
	}
	if (column.columnSortFn) {
		const sortFn = column.columnSortFn;
		return (a: T, b: T) => sortFn(a, b, sort.direction);
	}

	// Default: use accessor values
	return (a: T, b: T) => {
		const aValue = column.accessor(a);
		const bValue = column.accessor(b);
		return defaultSortFn(aValue, bValue, sort.direction);
	};
}

/**
 * Hook to get sorted data
 */
export function useDataTableSorting<T>(
	data: T[],
	sort: ColumnSort<T> | null,
	columns: DataTableColumn<T>[]
): T[] {
	return useMemo(() => applySorting(data, sort, columns), [data, sort, columns]);
}

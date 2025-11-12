import type { ColumnSort, SortDirection } from '@src-types/ui/dataTable';
import { useCallback, useState } from 'react';

export interface UseDataTableSortOptions<T> {
	initialSort?: ColumnSort<T>;
	onSortChange?: (sort: ColumnSort<T> | null) => void;
}

export interface UseDataTableSortReturn<T> {
	sort: ColumnSort<T> | null;
	setSort: (columnId: string | null, direction?: SortDirection) => void;
	toggleSort: (columnId: string) => void;
	clearSort: () => void;
}

/**
 * Determines the next sort state when toggling a column
 */
function getNextSortState<T>(
	currentSort: ColumnSort<T> | null,
	columnId: string
): { columnId: string | null; direction?: SortDirection } {
	if (currentSort?.columnId === columnId) {
		// Cycle: asc -> desc -> null
		if (currentSort.direction === 'asc') return { columnId, direction: 'desc' };
		if (currentSort.direction === 'desc') return { columnId: null };
	}
	return { columnId, direction: 'asc' };
}

/**
 * Hook for managing DataTable sorting state
 */
export function useDataTableSort<T = unknown>({
	initialSort,
	onSortChange,
}: UseDataTableSortOptions<T>): UseDataTableSortReturn<T> {
	const [sort, setSort] = useState<ColumnSort<T> | null>(initialSort ?? null);

	const setSortWithCallback = useCallback(
		(columnId: string | null, direction: SortDirection = 'asc') => {
			if (columnId === null) {
				setSort(null);
				onSortChange?.(null);
				return;
			}

			const newSort: ColumnSort<T> = {
				columnId,
				direction,
			};
			setSort(newSort);
			onSortChange?.(newSort);
		},
		[onSortChange]
	);

	const toggleSort = useCallback(
		(columnId: string) => {
			const next = getNextSortState(sort, columnId);
			setSortWithCallback(next.columnId, next.direction);
		},
		[sort, setSortWithCallback]
	);

	const clearSort = useCallback(() => {
		setSortWithCallback(null);
	}, [setSortWithCallback]);

	return {
		sort,
		setSort: setSortWithCallback,
		toggleSort,
		clearSort,
	};
}

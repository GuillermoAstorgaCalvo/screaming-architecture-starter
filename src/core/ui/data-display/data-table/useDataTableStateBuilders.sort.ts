import type { ColumnSort } from '@src-types/ui/dataTable';

import type { UseSortStateOptions } from './useDataTableStateBuilders.types';

/**
 * Builds options for sort state hook
 */
export function buildSortStateOptions<T>(
	initialSort?: ColumnSort<T>,
	onSortChange?: (sort: ColumnSort<T> | null) => void
): UseSortStateOptions<T> {
	const options: UseSortStateOptions<T> = {};
	if (initialSort) {
		options.initialSort = initialSort;
	}
	if (onSortChange) {
		options.onSortChange = onSortChange;
	}
	return options;
}

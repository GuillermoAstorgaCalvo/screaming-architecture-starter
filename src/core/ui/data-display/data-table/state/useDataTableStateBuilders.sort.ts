import type { UseSortStateOptions } from '@core/ui/data-display/data-table/types/useDataTableStateBuilders.types';
import type { ColumnSort } from '@src-types/ui/dataTable';

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

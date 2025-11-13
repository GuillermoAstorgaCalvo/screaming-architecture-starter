import type { UseFilterStateOptions } from '@core/ui/data-display/data-table/types/useDataTableStateBuilders.types';
import type { DataTableFilter } from '@src-types/ui/dataTable';

/**
 * Builds options for filter state hook
 */
export function buildFilterStateOptions(
	initialFilter?: DataTableFilter,
	onFilterChange?: (filter: DataTableFilter) => void
): UseFilterStateOptions {
	const options: UseFilterStateOptions = {};
	if (initialFilter) {
		options.initialFilter = initialFilter;
	}
	if (onFilterChange) {
		options.onFilterChange = onFilterChange;
	}
	return options;
}

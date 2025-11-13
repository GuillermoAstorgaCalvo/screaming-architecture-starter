import type { DataTableFilter } from '@src-types/ui/dataTable';

import type { UseFilterStateOptions } from './useDataTableStateBuilders.types';

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

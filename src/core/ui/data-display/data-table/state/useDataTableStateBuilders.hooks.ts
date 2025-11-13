import type {
	BuildStateHooksOptionsParams,
	UseDataTableStateHooksOptions,
} from '@core/ui/data-display/data-table/types/useDataTableStateBuilders.types';

/**
 * Builds options for state hooks initialization
 */
export function buildStateHooksOptions<T>(
	params: BuildStateHooksOptionsParams<T>
): UseDataTableStateHooksOptions<T> {
	const options: UseDataTableStateHooksOptions<T> = {
		initialColumns: params.initialColumns,
		initialData: params.initialData,
		enableColumnReorder: params.enableColumnReorder,
	};
	if (params.onColumnsReorder) {
		options.onColumnsReorder = params.onColumnsReorder;
	}
	if (params.initialSort) {
		options.initialSort = params.initialSort;
	}
	if (params.onSortChange) {
		options.onSortChange = params.onSortChange;
	}
	if (params.initialFilter) {
		options.initialFilter = params.initialFilter;
	}
	if (params.onFilterChange) {
		options.onFilterChange = params.onFilterChange;
	}
	return options;
}

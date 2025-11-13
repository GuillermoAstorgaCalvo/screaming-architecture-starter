import type {
	BuildTableStateOptionsParams,
	BuildTableStateParamsOptions,
	UseTableStateOptions,
} from '@core/ui/data-display/data-table/types/useDataTableStateBuilders.types';

/**
 * Builds options for table state hook
 */
export function buildTableStateOptions<T>(
	params: BuildTableStateOptionsParams<T>
): UseTableStateOptions<T> {
	const options: UseTableStateOptions<T> = {
		initialData: params.initialData,
		filteredData: params.filteredData,
		sortedData: params.sortedData,
		columns: params.columns,
		getRowId: params.getRowId,
		enablePagination: params.enablePagination,
		initialPage: params.initialPage,
		pageSize: params.pageSize,
	};
	if (params.onPageChange) {
		options.onPageChange = params.onPageChange;
	}
	if (params.controlledSelectedIds) {
		options.controlledSelectedIds = params.controlledSelectedIds;
	}
	if (params.onSelectionChange) {
		options.onSelectionChange = params.onSelectionChange;
	}
	return options;
}

/**
 * Builds table state parameters
 */
export function buildTableStateParams<T>(
	params: BuildTableStateParamsOptions<T>
): BuildTableStateOptionsParams<T> {
	const result: BuildTableStateOptionsParams<T> = {
		initialData: params.initialData,
		filteredData: params.filteredData,
		sortedData: params.sortedData,
		columns: params.columns,
		getRowId: params.getRowId,
		enablePagination: params.enablePagination,
		initialPage: params.initialPage,
		pageSize: params.pageSize,
	};
	if (params.onPageChange) {
		result.onPageChange = params.onPageChange;
	}
	if (params.controlledSelectedIds) {
		result.controlledSelectedIds = params.controlledSelectedIds;
	}
	if (params.onSelectionChange) {
		result.onSelectionChange = params.onSelectionChange;
	}
	return result;
}

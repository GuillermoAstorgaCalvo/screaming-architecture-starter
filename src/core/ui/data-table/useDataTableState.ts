import type { DataTableProps } from '@src-types/ui/dataTable';

import { buildStateHooksOptions } from './useDataTableStateBuilders.hooks';
import { buildTableStateOptions, buildTableStateParams } from './useDataTableStateBuilders.table';
import type {
	BuildStateHooksOptionsParams,
	BuildTableStateParamsOptions,
} from './useDataTableStateBuilders.types';
import { createDataTableHandlers } from './useDataTableStateHelpers';
import { useDataTableStateHooks, useTableState } from './useDataTableStateHooks';

interface UseDataTableStateOptions<T> {
	columns: DataTableProps<T>['columns'];
	data: DataTableProps<T>['data'];
	getRowId: DataTableProps<T>['getRowId'];
	enableSorting?: DataTableProps<T>['enableSorting'];
	enableGlobalFilter?: DataTableProps<T>['enableGlobalFilter'];
	enablePagination?: DataTableProps<T>['enablePagination'];
	enableColumnReorder?: DataTableProps<T>['enableColumnReorder'];
	initialSort?: DataTableProps<T>['initialSort'];
	initialFilter?: DataTableProps<T>['initialFilter'];
	initialPage?: DataTableProps<T>['initialPage'];
	pageSize?: DataTableProps<T>['pageSize'];
	selectedRowIds?: DataTableProps<T>['selectedRowIds'];
	onSelectionChange?: DataTableProps<T>['onSelectionChange'];
	onSortChange?: DataTableProps<T>['onSortChange'];
	onFilterChange?: DataTableProps<T>['onFilterChange'];
	onPageChange?: DataTableProps<T>['onPageChange'];
	onColumnsReorder?: DataTableProps<T>['onColumnsReorder'];
}

interface ParsedOptions<T> {
	initialColumns: DataTableProps<T>['columns'];
	initialData: T[];
	getRowId: DataTableProps<T>['getRowId'];
	enableColumnReorder: boolean;
	onColumnsReorder: DataTableProps<T>['onColumnsReorder'] | undefined;
	initialSort: DataTableProps<T>['initialSort'] | undefined;
	onSortChange: DataTableProps<T>['onSortChange'] | undefined;
	initialFilter: DataTableProps<T>['initialFilter'] | undefined;
	onFilterChange: DataTableProps<T>['onFilterChange'] | undefined;
	enablePagination: boolean;
	initialPage: number;
	pageSize: number;
	onPageChange: DataTableProps<T>['onPageChange'] | undefined;
	controlledSelectedIds: string[] | undefined;
	onSelectionChange: DataTableProps<T>['onSelectionChange'] | undefined;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Parses and normalizes options with defaults
 */
function parseOptions<T>(options: UseDataTableStateOptions<T>): ParsedOptions<T> {
	return {
		initialColumns: options.columns,
		initialData: options.data,
		getRowId: options.getRowId,
		enableColumnReorder: options.enableColumnReorder ?? false,
		onColumnsReorder: options.onColumnsReorder,
		initialSort: options.initialSort,
		onSortChange: options.onSortChange,
		initialFilter: options.initialFilter,
		onFilterChange: options.onFilterChange,
		enablePagination: options.enablePagination ?? true,
		initialPage: options.initialPage ?? 1,
		pageSize: options.pageSize ?? DEFAULT_PAGE_SIZE,
		onPageChange: options.onPageChange,
		controlledSelectedIds: options.selectedRowIds,
		onSelectionChange: options.onSelectionChange,
	};
}

/**
 * Builds parameters for state hooks initialization
 */
function buildStateHooksParams<T>(parsed: ParsedOptions<T>): BuildStateHooksOptionsParams<T> {
	const params: BuildStateHooksOptionsParams<T> = {
		initialColumns: parsed.initialColumns,
		initialData: parsed.initialData,
		enableColumnReorder: parsed.enableColumnReorder,
	};
	if (parsed.onColumnsReorder) {
		params.onColumnsReorder = parsed.onColumnsReorder;
	}
	if (parsed.initialSort) {
		params.initialSort = parsed.initialSort;
	}
	if (parsed.onSortChange) {
		params.onSortChange = parsed.onSortChange;
	}
	if (parsed.initialFilter) {
		params.initialFilter = parsed.initialFilter;
	}
	if (parsed.onFilterChange) {
		params.onFilterChange = parsed.onFilterChange;
	}
	return params;
}

/**
 * Builds parameters for table state initialization
 */
function buildTableStateParamsForHook<T>(
	parsed: ParsedOptions<T>,
	stateHooks: ReturnType<typeof useDataTableStateHooks<T>>
): BuildTableStateParamsOptions<T> {
	const params: BuildTableStateParamsOptions<T> = {
		initialData: parsed.initialData,
		filteredData: stateHooks.filteredData,
		sortedData: stateHooks.sortedData,
		columns: stateHooks.columns,
		getRowId: parsed.getRowId,
		enablePagination: parsed.enablePagination,
		initialPage: parsed.initialPage,
		pageSize: parsed.pageSize,
	};
	if (parsed.onPageChange) {
		params.onPageChange = parsed.onPageChange;
	}
	if (parsed.controlledSelectedIds) {
		params.controlledSelectedIds = parsed.controlledSelectedIds;
	}
	if (parsed.onSelectionChange) {
		params.onSelectionChange = parsed.onSelectionChange;
	}
	return params;
}

/**
 * Combines state hooks and table state into final return value
 */
function combineState<T>(
	stateHooks: ReturnType<typeof useDataTableStateHooks<T>>,
	tableState: ReturnType<typeof useTableState<T>>
) {
	const handlers = createDataTableHandlers({
		setColumnWidth: stateHooks.setColumnWidth,
		toggleSort: stateHooks.toggleSort,
		toggleAll: tableState.toggleAll,
	});

	return {
		columns: stateHooks.columns,
		columnWidths: stateHooks.columnWidths,
		sort: stateHooks.sort,
		filter: stateHooks.filter,
		setGlobalSearch: stateHooks.setGlobalSearch,
		filteredData: stateHooks.filteredData,
		sortedData: stateHooks.sortedData,
		handleColumnResize: handlers.handleColumnResize,
		handleSort: handlers.handleSort,
		handleSelectAll: handlers.handleSelectAll,
		...tableState,
	};
}

/**
 * Main hook for managing DataTable state
 */
export function useDataTableState<T>(options: UseDataTableStateOptions<T>) {
	const parsed = parseOptions(options);
	const stateHooksParams = buildStateHooksParams(parsed);
	const stateHooks = useDataTableStateHooks(buildStateHooksOptions(stateHooksParams));

	const tableStateParams = buildTableStateParamsForHook(parsed, stateHooks);
	const tableState = useTableState<T>(
		buildTableStateOptions(buildTableStateParams(tableStateParams))
	);

	return combineState(stateHooks, tableState);
}

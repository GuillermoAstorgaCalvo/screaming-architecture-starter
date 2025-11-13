import {
	type DataTableStateOptions,
	DEFAULT_PAGE_SIZE,
} from '@core/ui/data-display/data-table/types/DataTableTypes';
import type { DataTableProps } from '@src-types/ui/dataTable';

function withDefault<T>(value: T | null | undefined, fallback: T): T {
	return value ?? fallback;
}

/**
 * Builds state options from DataTable props
 */
export function buildStateOptions<T>(props: Readonly<DataTableProps<T>>): DataTableStateOptions<T> {
	return {
		columns: props.columns,
		data: props.data,
		getRowId: props.getRowId,
		enableSorting: withDefault(props.enableSorting, true),
		enableGlobalFilter: withDefault(props.enableGlobalFilter, true),
		enablePagination: withDefault(props.enablePagination, true),
		enableColumnReorder: withDefault(props.enableColumnReorder, false),
		initialSort: props.initialSort,
		onSortChange: props.onSortChange,
		initialFilter: props.initialFilter,
		onFilterChange: props.onFilterChange,
		initialPage: withDefault(props.initialPage, 1),
		pageSize: withDefault(props.pageSize, DEFAULT_PAGE_SIZE),
		onPageChange: props.onPageChange,
		selectedRowIds: props.selectedRowIds,
		onSelectionChange: props.onSelectionChange,
		onColumnsReorder: props.onColumnsReorder,
	};
}

/**
 * Extracts table props, excluding columns and data
 */
export function extractTableProps<T>(props: Readonly<DataTableProps<T>>): Record<string, unknown> {
	const { columns: _columns, data: _data, ...rest } = props;
	return rest;
}

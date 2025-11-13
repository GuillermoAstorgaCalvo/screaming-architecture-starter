import type { DataTableProps } from '@src-types/ui/dataTable';

import { type DataTableStateOptions, DEFAULT_PAGE_SIZE } from './DataTableTypes';

/**
 * Builds state options from DataTable props
 */
export function buildStateOptions<T>(props: Readonly<DataTableProps<T>>): DataTableStateOptions<T> {
	return {
		columns: props.columns,
		data: props.data,
		getRowId: props.getRowId,
		enableSorting: props.enableSorting ?? true,
		enableGlobalFilter: props.enableGlobalFilter ?? true,
		enablePagination: props.enablePagination ?? true,
		enableColumnReorder: props.enableColumnReorder ?? false,
		initialSort: props.initialSort,
		onSortChange: props.onSortChange,
		initialFilter: props.initialFilter,
		onFilterChange: props.onFilterChange,
		initialPage: props.initialPage ?? 1,
		pageSize: props.pageSize ?? DEFAULT_PAGE_SIZE,
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

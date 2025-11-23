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
 * Extracts table props, excluding columns, data, and DataTable-specific props
 */
export function extractTableProps<T>(props: Readonly<DataTableProps<T>>): Record<string, unknown> {
	const {
		columns: _columns,
		data: _data,
		enableSorting: _enableSorting,
		enableGlobalFilter: _enableGlobalFilter,
		enableColumnFilter: _enableColumnFilter,
		enablePagination: _enablePagination,
		enableRowSelection: _enableRowSelection,
		enableColumnResize: _enableColumnResize,
		enableColumnReorder: _enableColumnReorder,
		initialSort: _initialSort,
		initialFilter: _initialFilter,
		initialPage: _initialPage,
		pageSize: _pageSize,
		selectedRowIds: _selectedRowIds,
		onSortChange: _onSortChange,
		onFilterChange: _onFilterChange,
		onPageChange: _onPageChange,
		onSelectionChange: _onSelectionChange,
		onColumnsReorder: _onColumnsReorder,
		getRowId: _getRowId,
		globalSearchPlaceholder: _globalSearchPlaceholder,
		selectAllLabel: _selectAllLabel,
		showPaginationInfo: _showPaginationInfo,
		...rest
	} = props;
	return rest;
}

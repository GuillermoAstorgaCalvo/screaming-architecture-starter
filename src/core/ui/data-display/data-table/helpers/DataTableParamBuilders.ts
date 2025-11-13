import type { ReactNode } from 'react';

import type {
	ColumnParams,
	DataAndDisplayParams,
	FilterParams,
	PaginationParams,
	SortAndSelectionParams,
	StyleParams,
} from './DataTableTypes';

export function buildDataAndDisplayParams<T>({
	displayData,
	initialData,
	emptyMessage,
}: DataAndDisplayParams<T>) {
	return {
		displayData,
		initialData,
		emptyMessage: emptyMessage ?? ('No data available' as ReactNode),
	};
}

export function buildFilterParams({
	filter,
	setGlobalSearch,
	globalSearchPlaceholder,
	enableGlobalFilter,
}: FilterParams) {
	return {
		filter,
		setGlobalSearch,
		globalSearchPlaceholder: globalSearchPlaceholder ?? 'Search...',
		enableGlobalFilter,
	};
}

export function buildColumnParams<T>({
	columns,
	columnWidths,
	enableColumnResize,
	handleColumnResize,
	getRowId,
}: ColumnParams<T>) {
	return {
		columns,
		columnWidths,
		enableColumnResize: enableColumnResize ?? true,
		handleColumnResize,
		getRowId,
	};
}

export function buildSortAndSelectionParams<T>({
	sort,
	handleSort,
	enableSorting,
	enableRowSelection,
	rowIds,
	handleSelectAll,
	allRowIdsSelected,
	someRowIdsSelected,
	selectAllLabel,
	selectedRowIds,
	toggleRow,
}: SortAndSelectionParams<T>) {
	return {
		sort,
		handleSort,
		enableSorting,
		enableRowSelection: enableRowSelection ?? false,
		rowIds,
		handleSelectAll,
		allRowIdsSelected,
		someRowIdsSelected,
		selectAllLabel: selectAllLabel ?? 'Select all rows',
		selectedRowIds,
		toggleRow,
	};
}

export function buildStyleParams<T>({
	size,
	dataTableId,
	className,
	striped,
	hoverable,
	rowClassName,
}: StyleParams<T>) {
	return {
		size: size ?? 'md',
		dataTableId,
		className,
		striped: striped ?? false,
		hoverable: hoverable ?? true,
		rowClassName,
	};
}

export function buildPaginationParams({
	enablePagination,
	totalPages,
	currentPage,
	setPage,
	showPaginationInfo,
	startIndex,
	endIndex,
	totalItems,
}: PaginationParams) {
	return {
		enablePagination,
		totalPages,
		currentPage,
		setPage,
		showPaginationInfo: showPaginationInfo ?? false,
		startIndex,
		endIndex,
		totalItems,
	};
}

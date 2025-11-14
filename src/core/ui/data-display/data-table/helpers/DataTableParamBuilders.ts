import i18n from '@core/i18n/i18n';
import type {
	ColumnParams,
	DataAndDisplayParams,
	FilterParams,
	PaginationParams,
	SortAndSelectionParams,
	StyleParams,
} from '@core/ui/data-display/data-table/types/DataTableTypes';
import type { ReactNode } from 'react';

export function buildDataAndDisplayParams<T>({
	displayData,
	initialData,
	emptyMessage,
}: DataAndDisplayParams<T>) {
	return {
		displayData,
		initialData,
		emptyMessage: emptyMessage ?? (i18n.t('common.noDataAvailable', { ns: 'common' }) as ReactNode),
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
		globalSearchPlaceholder:
			globalSearchPlaceholder ?? i18n.t('common.searchPlaceholder', { ns: 'common' }),
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
		selectAllLabel: selectAllLabel ?? i18n.t('common.selectAllRows', { ns: 'common' }),
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

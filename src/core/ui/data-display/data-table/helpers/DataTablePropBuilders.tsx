import type {
	BasePropsParams,
	ColumnProps,
	FilterProps,
	PaginationProps,
	SortAndSelectionProps,
	StylePropsParams,
} from '@core/ui/data-display/data-table/types/DataTableTypes';
import { TableEmptyState } from '@core/ui/data-display/table/components/TableEmptyState';

export function buildFilterProps({
	filter,
	setGlobalSearch,
	globalSearchPlaceholder,
	enableGlobalFilter,
}: FilterProps) {
	return {
		enableGlobalFilter,
		globalSearch: filter.globalSearch ?? '',
		onGlobalSearchChange: setGlobalSearch,
		globalSearchPlaceholder,
	};
}

export function buildSortAndSelectionProps<T>({
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
}: SortAndSelectionProps<T>) {
	return {
		sort,
		onSort: (id: string) => handleSort(id, enableSorting),
		enableRowSelection,
		onSelectAll: () => handleSelectAll(rowIds, enableRowSelection),
		isAllSelected: allRowIdsSelected,
		isSomeSelected: someRowIdsSelected,
		selectAllLabel,
		selectedRowIds,
		onRowToggle: toggleRow,
	};
}

export function buildColumnProps<T>({
	columns,
	columnWidths,
	enableColumnResize,
	handleColumnResize,
	getRowId,
}: ColumnProps<T>) {
	return {
		columns,
		columnWidths,
		enableColumnResize,
		onColumnResize: (id: string, w: number) => handleColumnResize(id, w, enableColumnResize),
		...(getRowId ? { getRowId } : {}),
	};
}

export function buildPaginationProps({
	enablePagination,
	totalPages,
	currentPage,
	setPage,
	showPaginationInfo,
	startIndex,
	endIndex,
	totalItems,
}: PaginationProps) {
	return {
		enablePagination,
		totalPages,
		currentPage,
		onPageChange: setPage,
		showPaginationInfo,
		startIndex,
		endIndex,
		totalItems,
	};
}

export function buildBaseProps<T>({
	displayData,
	initialData,
	emptyMessage,
	dataTableId,
	className,
	size,
}: BasePropsParams<T>) {
	return {
		displayData,
		initialData,
		emptyMessage: <TableEmptyState emptyMessage={emptyMessage} />,
		dataTableId,
		className,
		size,
	};
}

export function buildStyleProps<T>({ striped, hoverable, rowClassName }: StylePropsParams<T>) {
	return {
		striped,
		hoverable,
		...(rowClassName ? { rowClassName } : {}),
	};
}

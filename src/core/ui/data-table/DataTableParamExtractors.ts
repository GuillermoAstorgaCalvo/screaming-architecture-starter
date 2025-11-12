import type {
	ColumnParamsForBuilder,
	FilterParamsForBuilder,
	PaginationParamsForBuilder,
	RendererPropsParams,
	SortSelectionParamsForBuilder,
} from './DataTableTypes';

export function extractFilterParams<T>(params: RendererPropsParams<T>): FilterParamsForBuilder {
	const { filter, setGlobalSearch, globalSearchPlaceholder, enableGlobalFilter } = params;
	return {
		filter,
		setGlobalSearch,
		globalSearchPlaceholder,
		enableGlobalFilter,
	};
}

export function extractColumnParams<T>(params: RendererPropsParams<T>): ColumnParamsForBuilder<T> {
	const { columns, columnWidths, enableColumnResize, handleColumnResize, getRowId } = params;
	return {
		columns,
		columnWidths,
		enableColumnResize,
		handleColumnResize,
		...(getRowId ? { getRowId } : {}),
	};
}

export function extractSortSelectionParams<T>(
	params: RendererPropsParams<T>
): SortSelectionParamsForBuilder<T> {
	const {
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
	} = params;
	return {
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
	};
}

export function extractPaginationParams<T>(
	params: RendererPropsParams<T>
): PaginationParamsForBuilder {
	const {
		enablePagination,
		totalPages,
		currentPage,
		setPage,
		showPaginationInfo,
		startIndex,
		endIndex,
		totalItems,
	} = params;
	return {
		enablePagination,
		totalPages,
		currentPage,
		setPage,
		showPaginationInfo,
		startIndex,
		endIndex,
		totalItems,
	};
}

import {
	buildColumnParams,
	buildDataAndDisplayParams,
	buildFilterParams,
	buildPaginationParams,
	buildSortAndSelectionParams,
	buildStyleParams,
} from '@core/ui/data-display/data-table/helpers/DataTableParamBuilders';
import { extractTableProps } from '@core/ui/data-display/data-table/helpers/DataTableStateBuilders';
import type { useDataTableState } from '@core/ui/data-display/data-table/hooks/useDataTableState';
import type {
	DataTableStateOptions,
	RendererPropsParams,
} from '@core/ui/data-display/data-table/types/DataTableTypes';
import type { DataTableProps } from '@src-types/ui/dataTable';

function buildDataAndDisplayParamsForRenderer<T>(
	props: Readonly<DataTableProps<T>>,
	tableState: ReturnType<typeof useDataTableState<T>>
) {
	return buildDataAndDisplayParams({
		displayData: tableState.displayData,
		initialData: props.data,
		emptyMessage: props.emptyMessage,
	});
}

function buildFilterParamsForRenderer<T>(
	props: Readonly<DataTableProps<T>>,
	stateOptions: DataTableStateOptions<T>,
	tableState: ReturnType<typeof useDataTableState<T>>
) {
	return buildFilterParams({
		filter: tableState.filter,
		setGlobalSearch: tableState.setGlobalSearch,
		globalSearchPlaceholder: props.globalSearchPlaceholder,
		enableGlobalFilter: stateOptions.enableGlobalFilter,
	});
}

function buildColumnParamsForRenderer<T>(
	props: Readonly<DataTableProps<T>>,
	tableState: ReturnType<typeof useDataTableState<T>>
) {
	return buildColumnParams({
		columns: tableState.columns,
		columnWidths: tableState.columnWidths,
		enableColumnResize: props.enableColumnResize,
		handleColumnResize: tableState.handleColumnResize,
		getRowId: props.getRowId,
	});
}

function buildSortAndSelectionParamsForRenderer<T>(
	props: Readonly<DataTableProps<T>>,
	stateOptions: DataTableStateOptions<T>,
	tableState: ReturnType<typeof useDataTableState<T>>
) {
	return buildSortAndSelectionParams({
		sort: tableState.sort,
		handleSort: tableState.handleSort,
		enableSorting: stateOptions.enableSorting,
		enableRowSelection: props.enableRowSelection,
		rowIds: tableState.rowIds,
		handleSelectAll: tableState.handleSelectAll,
		allRowIdsSelected: tableState.allRowIdsSelected,
		someRowIdsSelected: tableState.someRowIdsSelected,
		selectAllLabel: props.selectAllLabel,
		selectedRowIds: tableState.selectedRowIds,
		toggleRow: tableState.toggleRow,
	});
}

function buildStyleParamsForRenderer<T>(props: Readonly<DataTableProps<T>>) {
	return buildStyleParams({
		size: props.size,
		dataTableId: props.dataTableId,
		className: props.className,
		striped: props.striped,
		hoverable: props.hoverable,
		rowClassName: props.rowClassName,
	});
}

function buildPaginationParamsForRenderer<T>(
	props: Readonly<DataTableProps<T>>,
	stateOptions: DataTableStateOptions<T>,
	tableState: ReturnType<typeof useDataTableState<T>>
) {
	return buildPaginationParams({
		enablePagination: stateOptions.enablePagination,
		totalPages: tableState.totalPages,
		currentPage: tableState.currentPage,
		setPage: tableState.setPage,
		showPaginationInfo: props.showPaginationInfo,
		startIndex: tableState.startIndex,
		endIndex: tableState.endIndex,
		totalItems: tableState.totalItems,
	});
}

/**
 * Builds all renderer params from props, state options, and table state
 */
export function buildRendererParams<T>(
	props: Readonly<DataTableProps<T>>,
	stateOptions: DataTableStateOptions<T>,
	tableState: ReturnType<typeof useDataTableState<T>>
): RendererPropsParams<T> {
	const dataAndDisplay = buildDataAndDisplayParamsForRenderer(props, tableState);
	const filter = buildFilterParamsForRenderer(props, stateOptions, tableState);
	const columns = buildColumnParamsForRenderer(props, tableState);
	const sortAndSelection = buildSortAndSelectionParamsForRenderer(props, stateOptions, tableState);
	const style = buildStyleParamsForRenderer(props);
	const pagination = buildPaginationParamsForRenderer(props, stateOptions, tableState);

	return {
		...dataAndDisplay,
		...filter,
		...columns,
		...sortAndSelection,
		...style,
		...pagination,
		tableProps: extractTableProps(props),
	};
}

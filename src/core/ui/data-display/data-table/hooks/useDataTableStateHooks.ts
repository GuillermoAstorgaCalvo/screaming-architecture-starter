import { useDataTable } from './useDataTable';
import { useDataTableColumns } from './useDataTableColumns';
import { useDataTableFilter } from './useDataTableFilter';
import { useDataTableSort } from './useDataTableSort';
import { buildColumnStateOptions } from './useDataTableStateBuilders.column';
import { buildFilterStateOptions } from './useDataTableStateBuilders.filter';
import { buildSortStateOptions } from './useDataTableStateBuilders.sort';
import type {
	UseColumnStateOptions,
	UseDataTableStateHooksOptions,
	UseFilterStateOptions,
	UseSortStateOptions,
	UseTableStateOptions,
} from './useDataTableStateBuilders.types';
import { useDataTableDataTransformation } from './useDataTableStateHelpers';

/**
 * Hook for managing column state
 */
export function useColumnState<T>({
	initialColumns,
	enableColumnReorder,
	onColumnsReorder,
}: UseColumnStateOptions<T>) {
	const columnOptions: Parameters<typeof useDataTableColumns<T>>[0] = {
		columns: initialColumns,
	};
	if (enableColumnReorder && onColumnsReorder) {
		columnOptions.onColumnsReorder = onColumnsReorder;
	}
	return useDataTableColumns(columnOptions);
}

/**
 * Hook for managing sort state
 */
export function useSortState<T>({ initialSort, onSortChange }: UseSortStateOptions<T>) {
	const sortOptions: Parameters<typeof useDataTableSort<T>>[0] = {};
	if (initialSort) {
		sortOptions.initialSort = initialSort;
	}
	if (onSortChange) {
		sortOptions.onSortChange = onSortChange;
	}
	return useDataTableSort(sortOptions);
}

/**
 * Hook for managing filter state
 */
export function useFilterState({ initialFilter, onFilterChange }: UseFilterStateOptions) {
	const filterOptions: Parameters<typeof useDataTableFilter>[0] = {};
	if (initialFilter) {
		filterOptions.initialFilter = initialFilter;
	}
	if (onFilterChange) {
		filterOptions.onFilterChange = onFilterChange;
	}
	return useDataTableFilter(filterOptions);
}

/**
 * Hook for managing core table state (pagination, selection, display)
 */
export function useTableState<T>({
	initialData,
	filteredData,
	sortedData,
	columns,
	getRowId,
	enablePagination,
	initialPage,
	pageSize,
	onPageChange,
	controlledSelectedIds,
	onSelectionChange,
}: UseTableStateOptions<T>) {
	const tableOptions: Parameters<typeof useDataTable<T>>[0] = {
		initialData,
		filteredData,
		sortedData,
		columns,
		getRowId,
		enablePagination,
		initialPage,
		pageSize,
	};
	if (onPageChange) {
		tableOptions.onPageChange = onPageChange;
	}
	if (controlledSelectedIds) {
		tableOptions.controlledSelectedIds = controlledSelectedIds;
	}
	if (onSelectionChange) {
		tableOptions.onSelectionChange = onSelectionChange;
	}
	return useDataTable(tableOptions);
}

/**
 * Hook for initializing all data table state hooks
 */
export function useDataTableStateHooks<T>({
	initialColumns,
	initialData,
	enableColumnReorder,
	onColumnsReorder,
	initialSort,
	onSortChange,
	initialFilter,
	onFilterChange,
}: UseDataTableStateHooksOptions<T>) {
	const { columns, columnWidths, setColumnWidth } = useColumnState(
		buildColumnStateOptions(initialColumns, enableColumnReorder, onColumnsReorder)
	);

	const { sort, toggleSort } = useSortState(buildSortStateOptions(initialSort, onSortChange));
	const { filter, setGlobalSearch } = useFilterState(
		buildFilterStateOptions(initialFilter, onFilterChange)
	);

	const { filteredData, sortedData } = useDataTableDataTransformation({
		initialData,
		filter,
		columns,
		sort,
	});

	return {
		columns,
		columnWidths,
		setColumnWidth,
		sort,
		toggleSort,
		filter,
		setGlobalSearch,
		filteredData,
		sortedData,
	};
}

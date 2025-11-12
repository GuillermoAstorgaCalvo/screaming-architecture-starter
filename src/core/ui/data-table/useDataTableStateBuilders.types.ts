import type { ColumnSort, DataTableColumn, DataTableFilter } from '@src-types/ui/dataTable';

export interface UseColumnStateOptions<T> {
	initialColumns: DataTableColumn<T>[];
	enableColumnReorder: boolean;
	onColumnsReorder?: (columnIds: string[]) => void;
}

export interface UseSortStateOptions<T> {
	initialSort?: ColumnSort<T>;
	onSortChange?: (sort: ColumnSort<T> | null) => void;
}

export interface UseFilterStateOptions {
	initialFilter?: DataTableFilter;
	onFilterChange?: (filter: DataTableFilter) => void;
}

export interface UseTableStateOptions<T> {
	initialData: T[];
	filteredData: T[];
	sortedData: T[];
	columns: DataTableColumn<T>[];
	getRowId: ((row: T, index: number) => string) | undefined;
	enablePagination: boolean;
	initialPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	controlledSelectedIds?: string[];
	onSelectionChange?: (selectedRowIds: string[]) => void;
}

export interface UseDataTableStateHooksOptions<T> {
	initialColumns: DataTableColumn<T>[];
	initialData: T[];
	enableColumnReorder: boolean;
	onColumnsReorder?: (columnIds: string[]) => void;
	initialSort?: ColumnSort<T>;
	onSortChange?: (sort: ColumnSort<T> | null) => void;
	initialFilter?: DataTableFilter;
	onFilterChange?: (filter: DataTableFilter) => void;
}

export interface BuildTableStateOptionsParams<T> {
	initialData: T[];
	filteredData: T[];
	sortedData: T[];
	columns: DataTableColumn<T>[];
	getRowId: ((row: T, index: number) => string) | undefined;
	enablePagination: boolean;
	initialPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	controlledSelectedIds?: string[];
	onSelectionChange?: (selectedRowIds: string[]) => void;
}

export interface BuildStateHooksOptionsParams<T> {
	initialColumns: DataTableColumn<T>[];
	initialData: T[];
	enableColumnReorder: boolean;
	onColumnsReorder?: (columnIds: string[]) => void;
	initialSort?: ColumnSort<T>;
	onSortChange?: (sort: ColumnSort<T> | null) => void;
	initialFilter?: DataTableFilter;
	onFilterChange?: (filter: DataTableFilter) => void;
}

export interface BuildTableStateParamsOptions<T> {
	initialData: T[];
	filteredData: T[];
	sortedData: T[];
	columns: DataTableColumn<T>[];
	getRowId: ((row: T, index: number) => string) | undefined;
	enablePagination: boolean;
	initialPage: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	controlledSelectedIds?: string[];
	onSelectionChange?: (selectedRowIds: string[]) => void;
}

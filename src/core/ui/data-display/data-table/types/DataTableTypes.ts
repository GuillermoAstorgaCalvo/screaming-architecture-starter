import type { useDataTableState } from '@core/ui/data-display/data-table/hooks/useDataTableState';
import type { StandardSize } from '@src-types/ui/base';
import type { DataTableProps } from '@src-types/ui/dataTable';
import type { ReactNode } from 'react';

export const DEFAULT_PAGE_SIZE = 10;

export interface DataTableStateOptions<T> {
	columns: DataTableProps<T>['columns'];
	data: DataTableProps<T>['data'];
	getRowId: DataTableProps<T>['getRowId'];
	enableSorting: boolean;
	enableGlobalFilter: boolean;
	enablePagination: boolean;
	enableColumnReorder: boolean;
	initialSort: DataTableProps<T>['initialSort'];
	onSortChange: DataTableProps<T>['onSortChange'];
	initialFilter: DataTableProps<T>['initialFilter'];
	onFilterChange: DataTableProps<T>['onFilterChange'];
	initialPage: number;
	pageSize: number;
	onPageChange: DataTableProps<T>['onPageChange'];
	selectedRowIds: DataTableProps<T>['selectedRowIds'];
	onSelectionChange: DataTableProps<T>['onSelectionChange'];
	onColumnsReorder: DataTableProps<T>['onColumnsReorder'];
}

export interface FilterProps {
	filter: { globalSearch?: string };
	setGlobalSearch: (value: string) => void;
	globalSearchPlaceholder: string;
	enableGlobalFilter: boolean;
}

export interface SortAndSelectionProps<T> {
	sort: ReturnType<typeof useDataTableState<T>>['sort'];
	handleSort: (id: string, enableSorting: boolean) => void;
	enableSorting: boolean;
	enableRowSelection: boolean;
	rowIds: string[];
	handleSelectAll: (rowIds: string[], enableRowSelection: boolean) => void;
	allRowIdsSelected: boolean;
	someRowIdsSelected: boolean;
	selectAllLabel: string;
	selectedRowIds: Set<string>;
	toggleRow: (rowId: string) => void;
}

export interface ColumnProps<T> {
	columns: ReturnType<typeof useDataTableState<T>>['columns'];
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	handleColumnResize: (id: string, w: number, enableColumnResize: boolean) => void;
	getRowId?: (row: T, index: number) => string;
}

export interface PaginationProps {
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	setPage: (page: number) => void;
	showPaginationInfo: boolean;
	startIndex: number;
	endIndex: number;
	totalItems: number;
}

export interface RendererPropsParams<T> {
	displayData: T[];
	initialData: T[];
	filter: { globalSearch?: string };
	setGlobalSearch: (value: string) => void;
	emptyMessage: ReactNode;
	globalSearchPlaceholder: string;
	dataTableId: string | undefined;
	className: string | undefined;
	columns: ReturnType<typeof useDataTableState<T>>['columns'];
	size: StandardSize;
	sort: ReturnType<typeof useDataTableState<T>>['sort'];
	handleSort: (id: string, enableSorting: boolean) => void;
	enableSorting: boolean;
	enableRowSelection: boolean;
	rowIds: string[];
	handleSelectAll: (rowIds: string[], enableRowSelection: boolean) => void;
	allRowIdsSelected: boolean;
	someRowIdsSelected: boolean;
	selectAllLabel: string;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	handleColumnResize: (id: string, w: number, enableColumnResize: boolean) => void;
	getRowId: DataTableProps<T>['getRowId'];
	striped: boolean;
	hoverable: boolean;
	rowClassName: DataTableProps<T>['rowClassName'];
	selectedRowIds: Set<string>;
	toggleRow: (rowId: string) => void;
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	setPage: (page: number) => void;
	showPaginationInfo: boolean;
	startIndex: number;
	endIndex: number;
	totalItems: number;
	enableGlobalFilter: boolean;
	tableProps: Record<string, unknown>;
}

export interface BasePropsParams<T> {
	displayData: T[];
	initialData: T[];
	emptyMessage: ReactNode;
	dataTableId: string | undefined;
	className: string | undefined;
	size: StandardSize;
}

export interface StylePropsParams<T> {
	striped: boolean;
	hoverable: boolean;
	rowClassName: DataTableProps<T>['rowClassName'];
}

export interface FilterParamsForBuilder {
	filter: { globalSearch?: string };
	setGlobalSearch: (value: string) => void;
	globalSearchPlaceholder: string;
	enableGlobalFilter: boolean;
}

export interface ColumnParamsForBuilder<T> {
	columns: ReturnType<typeof useDataTableState<T>>['columns'];
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	handleColumnResize: (id: string, w: number, enableColumnResize: boolean) => void;
	getRowId?: (row: T, index: number) => string;
}

export interface SortSelectionParamsForBuilder<T> {
	sort: ReturnType<typeof useDataTableState<T>>['sort'];
	handleSort: (id: string, enableSorting: boolean) => void;
	enableSorting: boolean;
	enableRowSelection: boolean;
	rowIds: string[];
	handleSelectAll: (rowIds: string[], enableRowSelection: boolean) => void;
	allRowIdsSelected: boolean;
	someRowIdsSelected: boolean;
	selectAllLabel: string;
	selectedRowIds: Set<string>;
	toggleRow: (rowId: string) => void;
}

export interface PaginationParamsForBuilder {
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	setPage: (page: number) => void;
	showPaginationInfo: boolean;
	startIndex: number;
	endIndex: number;
	totalItems: number;
}

export interface DataAndDisplayParams<T> {
	displayData: T[];
	initialData: T[];
	emptyMessage: ReactNode | undefined;
}

export interface FilterParams {
	filter: { globalSearch?: string };
	setGlobalSearch: (value: string) => void;
	globalSearchPlaceholder: string | undefined;
	enableGlobalFilter: boolean;
}

export interface ColumnParams<T> {
	columns: ReturnType<typeof useDataTableState<T>>['columns'];
	columnWidths: Map<string, number>;
	enableColumnResize: boolean | undefined;
	handleColumnResize: (id: string, w: number, enableColumnResize: boolean) => void;
	getRowId: DataTableProps<T>['getRowId'];
}

export interface SortAndSelectionParams<T> {
	sort: ReturnType<typeof useDataTableState<T>>['sort'];
	handleSort: (id: string, enableSorting: boolean) => void;
	enableSorting: boolean;
	enableRowSelection: boolean | undefined;
	rowIds: string[];
	handleSelectAll: (rowIds: string[], enableRowSelection: boolean) => void;
	allRowIdsSelected: boolean;
	someRowIdsSelected: boolean;
	selectAllLabel: string | undefined;
	selectedRowIds: Set<string>;
	toggleRow: (rowId: string) => void;
}

export interface StyleParams<T> {
	size: StandardSize | undefined;
	dataTableId: string | undefined;
	className: string | undefined;
	striped: boolean | undefined;
	hoverable: boolean | undefined;
	rowClassName: DataTableProps<T>['rowClassName'];
}

export interface PaginationParams {
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	setPage: (page: number) => void;
	showPaginationInfo: boolean | undefined;
	startIndex: number;
	endIndex: number;
	totalItems: number;
}

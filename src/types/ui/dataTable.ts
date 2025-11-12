import type { ReactNode } from 'react';

import type { StandardSize } from './base';
import type { TableColumn, TableProps } from './data';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort configuration for a column
 */
export interface ColumnSort<T = unknown> {
	/** Column ID to sort by */
	columnId: string;
	/** Sort direction */
	direction: SortDirection;
	/** Optional custom sort function */
	sortFn?: (a: T, b: T) => number;
}

/**
 * Filter configuration
 */
export interface DataTableFilter {
	/** Global search filter value */
	globalSearch?: string;
	/** Column-specific filters */
	columnFilters?: Record<string, string>;
	/** Advanced filters (select, multi-select, date, date-range) */
	advancedFilters?: Record<string, string | string[] | { start: string; end: string }>;
	/** Custom filter function */
	customFilter?: (row: unknown) => boolean;
}

/**
 * Column resize configuration
 */
export interface ColumnResize {
	columnId: string;
	width: number;
}

/**
 * DataTable column definition (extends TableColumn with additional features)
 */
export interface DataTableColumn<T = unknown> extends TableColumn<T> {
	/** Whether the column is sortable @default false */
	sortable?: boolean;
	/** Whether the column is filterable @default false */
	filterable?: boolean;
	/** Whether the column is resizable @default true */
	resizable?: boolean;
	/** Whether the column can be reordered @default true */
	reorderable?: boolean;
	/** Initial width for the column */
	initialWidth?: number;
	/** Minimum width for the column */
	minWidth?: number;
	/** Maximum width for the column */
	maxWidth?: number;
	/** Custom filter function for this column */
	columnFilterFn?: (row: T, filterValue: string) => boolean;
	/** Custom sort function for this column */
	columnSortFn?: (a: T, b: T, direction: SortDirection) => number;
}

/**
 * DataTable component props
 */
export interface DataTableProps<T = unknown> extends Omit<TableProps<T>, 'columns'> {
	/** Array of column definitions with enhanced features */
	columns: DataTableColumn<T>[];
	/** Array of row data */
	data: T[];
	/** Whether to enable column sorting @default true */
	enableSorting?: boolean;
	/** Whether to enable global search filtering @default true */
	enableGlobalFilter?: boolean;
	/** Whether to enable column-specific filtering @default false */
	enableColumnFilter?: boolean;
	/** Whether to enable pagination @default true */
	enablePagination?: boolean;
	/** Whether to enable row selection @default false */
	enableRowSelection?: boolean;
	/** Whether to enable column resizing @default true */
	enableColumnResize?: boolean;
	/** Whether to enable column reordering @default false */
	enableColumnReorder?: boolean;
	/** Initial sort configuration */
	initialSort?: ColumnSort<T>;
	/** Initial filter configuration */
	initialFilter?: DataTableFilter;
	/** Initial page number (1-indexed) @default 1 */
	initialPage?: number;
	/** Number of items per page @default 10 */
	pageSize?: number;
	/** Selected row IDs */
	selectedRowIds?: string[];
	/** Callback when selection changes */
	onSelectionChange?: (selectedRowIds: string[]) => void;
	/** Callback when sort changes */
	onSortChange?: (sort: ColumnSort<T> | null) => void;
	/** Callback when filter changes */
	onFilterChange?: (filter: DataTableFilter) => void;
	/** Callback when page changes */
	onPageChange?: (page: number) => void;
	/** Callback when columns are reordered */
	onColumnsReorder?: (columnIds: string[]) => void;
	/** Custom empty state message */
	emptyMessage?: ReactNode;
	/** Size of the table @default 'md' */
	size?: StandardSize;
	/** Whether to show striped rows @default false */
	striped?: boolean;
	/** Whether to show hover effect @default true */
	hoverable?: boolean;
	/** Optional className for table rows */
	rowClassName?: string | ((row: T, index: number) => string);
	/** Optional ID for the data table */
	dataTableId?: string;
	/** Placeholder for global search input */
	globalSearchPlaceholder?: string;
	/** Label for select all checkbox */
	selectAllLabel?: string;
	/** Whether to show pagination info (e.g., "Showing 1-10 of 100") */
	showPaginationInfo?: boolean;
}

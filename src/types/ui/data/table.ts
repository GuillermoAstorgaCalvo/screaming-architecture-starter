import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Table column definition
 */
export interface TableColumn<T = unknown> {
	/** Unique identifier for the column */
	id: string;
	/** Column header label */
	header: ReactNode;
	/** Function to extract cell value from row data */
	accessor: (row: T) => ReactNode;
	/** Optional column width */
	width?: string;
	/** Whether the column is sortable */
	sortable?: boolean;
	/** Optional custom header renderer */
	headerRenderer?: (column: TableColumn<T>) => ReactNode;
	/** Optional custom cell renderer */
	cellRenderer?: (value: ReactNode, row: T) => ReactNode;
}

/**
 * Table component props
 */
export interface TableProps<T = unknown> extends HTMLAttributes<HTMLTableElement> {
	/** Array of column definitions */
	columns: TableColumn<T>[];
	/** Array of row data */
	data: T[];
	/** Optional unique key extractor for rows */
	getRowId?: (row: T, index: number) => string;
	/** Whether to show striped rows @default false */
	striped?: boolean;
	/** Whether to show hover effect @default true */
	hoverable?: boolean;
	/** Size of the table @default 'md' */
	size?: StandardSize;
	/** Optional empty state message */
	emptyMessage?: ReactNode;
	/** Optional className for table rows */
	rowClassName?: string | ((row: T, index: number) => string);
}

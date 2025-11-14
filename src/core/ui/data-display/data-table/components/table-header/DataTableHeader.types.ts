import type { StandardSize } from '@src-types/ui/base';
import type { ColumnSort, DataTableColumn } from '@src-types/ui/dataTable';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataTableHeaderProps<T> {
	columns: DataTableColumn<T>[];
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	enableRowSelection: boolean;
	onSelectAll: () => void;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	selectAllLabel?: string;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

export interface DataTableHeaderCellProps<T> {
	column: DataTableColumn<T>;
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

export interface HeaderContentProps<T> {
	column: DataTableColumn<T>;
	isSortable: boolean;
	sortDirection: SortDirection;
	onSort: (columnId: string) => void;
}

export interface HeaderRowProps<T> {
	columns: DataTableColumn<T>[];
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	enableRowSelection: boolean;
	onSelectAll: () => void;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	selectAllLabel: string;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

export interface ColumnCellsProps<T> {
	columns: DataTableColumn<T>[];
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

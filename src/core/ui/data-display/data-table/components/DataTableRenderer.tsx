import { DataTableContent } from '@core/ui/data-display/data-table/components/DataTableContent';
import { DataTableNoResults } from '@core/ui/data-display/data-table/components/DataTableNoResults';
import type { StandardSize } from '@src-types/ui/base';
import type { ColumnSort, DataTableColumn } from '@src-types/ui/dataTable';
import type { ReactNode } from 'react';

interface DataTableRendererProps<T> {
	displayData: T[];
	initialData: T[];
	enableGlobalFilter: boolean;
	globalSearch: string;
	onGlobalSearchChange: (value: string) => void;
	globalSearchPlaceholder: string;
	emptyMessage: string | ReactNode;
	dataTableId: string | undefined;
	className: string | undefined;
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
	onColumnResize: (columnId: string, width: number) => void;
	getRowId?: (row: T, index: number) => string;
	striped: boolean;
	hoverable: boolean;
	rowClassName?: string | ((row: T, index: number) => string);
	selectedRowIds: Set<string>;
	onRowToggle: (rowId: string) => void;
	enablePagination: boolean;
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	showPaginationInfo: boolean;
	startIndex: number;
	endIndex: number;
	totalItems: number;
	tableProps: Record<string, unknown>;
}

export function DataTableRenderer<T>(props: Readonly<DataTableRendererProps<T>>) {
	const {
		displayData,
		initialData,
		enableGlobalFilter,
		globalSearch,
		onGlobalSearchChange,
		globalSearchPlaceholder,
		emptyMessage,
		...contentProps
	} = props;

	if (displayData.length === 0 && initialData.length > 0) {
		return (
			<DataTableNoResults
				enableGlobalFilter={enableGlobalFilter}
				globalSearch={globalSearch}
				onGlobalSearchChange={onGlobalSearchChange}
				placeholder={globalSearchPlaceholder}
			/>
		);
	}
	if (initialData.length === 0) {
		return emptyMessage;
	}

	return (
		<DataTableContent
			{...contentProps}
			displayData={displayData}
			getRowId={contentProps.getRowId}
			enableGlobalFilter={enableGlobalFilter}
			globalSearch={globalSearch}
			onGlobalSearchChange={onGlobalSearchChange}
			globalSearchPlaceholder={globalSearchPlaceholder}
			rowClassName={
				typeof contentProps.rowClassName === 'function' ? contentProps.rowClassName : undefined
			}
		/>
	);
}

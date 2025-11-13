import { DataTableFilterSection } from '@core/ui/data-display/data-table/components/DataTableFilterSection';
import { DataTablePaginationSection } from '@core/ui/data-display/data-table/components/DataTablePaginationSection';
import { DataTableTable } from '@core/ui/data-display/data-table/components/DataTableTable';
import type { StandardSize } from '@src-types/ui/base';
import type { ColumnSort, DataTableColumn, DataTableProps } from '@src-types/ui/dataTable';

interface DataTableContentProps<T> {
	dataTableId: string | undefined;
	enableGlobalFilter: boolean;
	globalSearch: string;
	onGlobalSearchChange: (value: string) => void;
	globalSearchPlaceholder: string;
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
	displayData: T[];
	getRowId: ((row: T, index: number) => string) | undefined;
	striped: boolean;
	hoverable: boolean;
	rowClassName: ((row: T, index: number) => string) | undefined;
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
	tableProps: Omit<DataTableProps<T>, 'columns' | 'data'>;
}

function renderFilterSection<T>(props: Readonly<DataTableContentProps<T>>) {
	return (
		<DataTableFilterSection
			enableGlobalFilter={props.enableGlobalFilter}
			globalSearch={props.globalSearch}
			onGlobalSearchChange={props.onGlobalSearchChange}
			globalSearchPlaceholder={props.globalSearchPlaceholder}
		/>
	);
}

function renderTableSection<T>(props: Readonly<DataTableContentProps<T>>) {
	return (
		<DataTableTable
			className={props.className}
			columns={props.columns}
			size={props.size}
			sort={props.sort}
			onSort={props.onSort}
			enableRowSelection={props.enableRowSelection}
			onSelectAll={props.onSelectAll}
			isAllSelected={props.isAllSelected}
			isSomeSelected={props.isSomeSelected}
			selectAllLabel={props.selectAllLabel}
			columnWidths={props.columnWidths}
			enableColumnResize={props.enableColumnResize}
			onColumnResize={props.onColumnResize}
			displayData={props.displayData}
			getRowId={props.getRowId}
			striped={props.striped}
			hoverable={props.hoverable}
			rowClassName={props.rowClassName}
			selectedRowIds={props.selectedRowIds}
			onRowToggle={props.onRowToggle}
			tableProps={props.tableProps}
		/>
	);
}

function renderPaginationSection<T>(props: Readonly<DataTableContentProps<T>>) {
	return (
		<DataTablePaginationSection
			enablePagination={props.enablePagination}
			totalPages={props.totalPages}
			currentPage={props.currentPage}
			onPageChange={props.onPageChange}
			showPaginationInfo={props.showPaginationInfo}
			startIndex={props.startIndex}
			endIndex={props.endIndex}
			totalItems={props.totalItems}
			size={props.size}
		/>
	);
}

export function DataTableContent<T>(props: Readonly<DataTableContentProps<T>>) {
	return (
		<div className="space-y-4" id={props.dataTableId}>
			{renderFilterSection(props)}
			{renderTableSection(props)}
			{renderPaginationSection(props)}
		</div>
	);
}

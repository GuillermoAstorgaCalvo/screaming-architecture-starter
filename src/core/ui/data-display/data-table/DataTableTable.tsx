import { getTableClasses } from '@core/ui/table/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { ColumnSort, DataTableColumn, DataTableProps } from '@src-types/ui/dataTable';
import type { ReactElement } from 'react';

import { DataTableBody, type DataTableBodyProps } from './DataTableBody';
import { DataTableHeader, type DataTableHeaderProps } from './DataTableHeader';

interface DataTableTableProps<T> {
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
	tableProps: Omit<DataTableProps<T>, 'columns' | 'data'>;
}

interface BuildHeaderPropsParams<T> {
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
}

/**
 * Builds props for DataTableHeader component
 */
function buildHeaderProps<T>(params: BuildHeaderPropsParams<T>): DataTableHeaderProps<T> {
	return {
		columns: params.columns,
		size: params.size,
		sort: params.sort,
		onSort: params.onSort,
		enableRowSelection: params.enableRowSelection,
		onSelectAll: params.onSelectAll,
		isAllSelected: params.isAllSelected,
		isSomeSelected: params.isSomeSelected,
		selectAllLabel: params.selectAllLabel,
		columnWidths: params.columnWidths,
		enableColumnResize: params.enableColumnResize,
		onColumnResize: params.onColumnResize,
	};
}

interface BuildBodyPropsParams<T> {
	columns: DataTableColumn<T>[];
	displayData: T[];
	getRowId: ((row: T, index: number) => string) | undefined;
	striped: boolean;
	hoverable: boolean;
	size: StandardSize;
	rowClassName: ((row: T, index: number) => string) | undefined;
	enableRowSelection: boolean;
	selectedRowIds: Set<string>;
	onRowToggle: (rowId: string) => void;
	columnWidths: Map<string, number>;
}

/**
 * Builds props for DataTableBody component
 */
function buildBodyProps<T>(params: BuildBodyPropsParams<T>): DataTableBodyProps<T> {
	const bodyProps: DataTableBodyProps<T> = {
		columns: params.columns,
		data: params.displayData,
		striped: params.striped,
		hoverable: params.hoverable,
		size: params.size,
		enableRowSelection: params.enableRowSelection,
		selectedRowIds: params.selectedRowIds,
		onRowToggle: params.onRowToggle,
		columnWidths: params.columnWidths,
	};

	if (params.getRowId) {
		bodyProps.getRowId = params.getRowId;
	}

	if (params.rowClassName) {
		bodyProps.rowClassName = params.rowClassName;
	}

	return bodyProps;
}

interface RenderTableElementParams<T> {
	className: string | undefined;
	tableProps: Omit<DataTableProps<T>, 'columns' | 'data'>;
	headerProps: DataTableHeaderProps<T>;
	bodyProps: DataTableBodyProps<T>;
}

/**
 * Renders the table element with header and body
 */
function renderTableElement<T>({
	className,
	tableProps,
	headerProps,
	bodyProps,
}: RenderTableElementParams<T>) {
	return (
		<table className={getTableClasses(className)} {...tableProps}>
			<DataTableHeader {...headerProps} />
			<DataTableBody {...bodyProps} />
		</table>
	);
}

/**
 * Renders the table wrapper with overflow handling
 */
function renderTableWrapper(tableElement: ReactElement) {
	return <div className="overflow-x-auto">{tableElement}</div>;
}

/**
 * Extracts header-related props from DataTableTableProps
 */
function extractHeaderProps<T>(props: Readonly<DataTableTableProps<T>>): BuildHeaderPropsParams<T> {
	return {
		columns: props.columns,
		size: props.size,
		sort: props.sort,
		onSort: props.onSort,
		enableRowSelection: props.enableRowSelection,
		onSelectAll: props.onSelectAll,
		isAllSelected: props.isAllSelected,
		isSomeSelected: props.isSomeSelected,
		selectAllLabel: props.selectAllLabel,
		columnWidths: props.columnWidths,
		enableColumnResize: props.enableColumnResize,
		onColumnResize: props.onColumnResize,
	};
}

/**
 * Extracts body-related props from DataTableTableProps
 */
function extractBodyProps<T>(props: Readonly<DataTableTableProps<T>>): BuildBodyPropsParams<T> {
	return {
		columns: props.columns,
		displayData: props.displayData,
		getRowId: props.getRowId,
		striped: props.striped,
		hoverable: props.hoverable,
		size: props.size,
		rowClassName: props.rowClassName,
		enableRowSelection: props.enableRowSelection,
		selectedRowIds: props.selectedRowIds,
		onRowToggle: props.onRowToggle,
		columnWidths: props.columnWidths,
	};
}

/**
 * DataTableTable - Renders the table element with header and body
 */
export function DataTableTable<T>(props: Readonly<DataTableTableProps<T>>) {
	const headerProps = buildHeaderProps(extractHeaderProps(props));
	const bodyProps = buildBodyProps(extractBodyProps(props));

	const tableElement = renderTableElement({
		className: props.className,
		tableProps: props.tableProps,
		headerProps,
		bodyProps,
	});

	return renderTableWrapper(tableElement);
}

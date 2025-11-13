import {
	getCellClasses,
	getTableRowId,
	type RowClassName,
} from '@core/ui/data-display/table/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import type { CSSProperties, ReactNode } from 'react';

export interface DataTableBodyProps<T> {
	columns: DataTableColumn<T>[];
	data: T[];
	getRowId?: (row: T, index: number) => string;
	striped: boolean;
	hoverable: boolean;
	size: StandardSize;
	rowClassName?: RowClassName<T>;
	enableRowSelection: boolean;
	selectedRowIds: Set<string>;
	onRowToggle: (rowId: string) => void;
	columnWidths: Map<string, number>;
}

interface DataTableRowProps<T> {
	row: T;
	index: number;
	rowId: string;
	columns: DataTableColumn<T>[];
	striped: boolean;
	hoverable: boolean;
	size: StandardSize;
	rowClassName?: RowClassName<T>;
	enableRowSelection: boolean;
	isSelected: boolean;
	onRowToggle: (rowId: string) => void;
	columnWidths: Map<string, number>;
}

function getCellStyle<T>(
	column: DataTableColumn<T>,
	columnWidths: Map<string, number>
): CSSProperties {
	const columnWidth = columnWidths.get(column.id);
	const style: CSSProperties = {};
	if (columnWidth) {
		style.width = `${columnWidth}px`;
		style.minWidth = `${columnWidth}px`;
	} else if (column.width) {
		style.width = column.width;
	}
	return style;
}

interface RenderCellParams<T> {
	column: DataTableColumn<T>;
	row: T;
	size: StandardSize;
	columnWidths: Map<string, number>;
}

function renderCell<T>({ column, row, size, columnWidths }: RenderCellParams<T>): ReactNode {
	const value = column.accessor(row);
	const cellContent = column.cellRenderer ? column.cellRenderer(value, row) : value;
	const style = getCellStyle(column, columnWidths);

	return (
		<td key={column.id} className={getCellClasses(size)} style={style}>
			{cellContent}
		</td>
	);
}

function DataTableRow<T>({
	row,
	index,
	rowId,
	columns,
	striped,
	hoverable,
	size,
	rowClassName,
	enableRowSelection,
	isSelected,
	onRowToggle,
	columnWidths,
}: Readonly<DataTableRowProps<T>>) {
	const rowClasses = [
		'border-b border-border transition-colors',
		striped && index % 2 === 1 ? 'even:bg-muted' : '',
		hoverable ? 'hover:bg-muted' : '',
		typeof rowClassName === 'function' ? rowClassName(row, index) : (rowClassName ?? ''),
		isSelected ? 'bg-primary/10 dark:bg-primary/20' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<tr className={rowClasses}>
			{enableRowSelection ? (
				<td className={getCellClasses(size)}>
					<input
						type="checkbox"
						checked={isSelected}
						onChange={() => onRowToggle(rowId)}
						aria-label={`Select row ${index + 1}`}
						className="cursor-pointer"
					/>
				</td>
			) : null}
			{columns.map(column => renderCell({ column, row, size, columnWidths }))}
		</tr>
	);
}

/**
 * DataTableBody - Enhanced table body with row selection
 */
export function DataTableBody<T>({
	columns,
	data,
	getRowId,
	striped,
	hoverable,
	size,
	rowClassName,
	enableRowSelection,
	selectedRowIds,
	onRowToggle,
	columnWidths,
}: Readonly<DataTableBodyProps<T>>) {
	return (
		<tbody>
			{data.map((row, index) => {
				const rowId = getTableRowId(row, index, getRowId);
				const isSelected = selectedRowIds.has(rowId);

				return (
					<DataTableRow
						key={rowId}
						row={row}
						index={index}
						rowId={rowId}
						columns={columns}
						striped={striped}
						hoverable={hoverable}
						size={size}
						rowClassName={rowClassName}
						enableRowSelection={enableRowSelection}
						isSelected={isSelected}
						onRowToggle={onRowToggle}
						columnWidths={columnWidths}
					/>
				);
			})}
		</tbody>
	);
}

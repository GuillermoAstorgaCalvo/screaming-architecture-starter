import type { ColumnCellsProps } from '@core/ui/data-display/data-table/components/DataTableHeader.types';
import { DataTableHeaderCell } from '@core/ui/data-display/data-table/components/DataTableHeaderCell';

/**
 * ColumnCells - Renders all column header cells
 */
export function ColumnCells<T>({
	columns,
	size,
	sort,
	onSort,
	columnWidths,
	enableColumnResize,
	onColumnResize,
}: Readonly<ColumnCellsProps<T>>) {
	return (
		<>
			{columns.map(column => (
				<DataTableHeaderCell
					key={column.id}
					column={column}
					size={size}
					sort={sort}
					onSort={onSort}
					columnWidths={columnWidths}
					enableColumnResize={enableColumnResize}
					{...(onColumnResize && { onColumnResize })}
				/>
			))}
		</>
	);
}

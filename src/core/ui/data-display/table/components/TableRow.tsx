import { TableCell } from '@core/ui/data-display/table/components/TableCell';
import { getRowClasses, type RowClassName } from '@core/ui/data-display/table/helpers/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { TableColumn } from '@src-types/ui/data/table';

// ============================================================================
// Row Component
// ============================================================================

type TableRowProps<T> = Readonly<{
	row: T;
	index: number;
	columns: TableColumn<T>[];
	size: StandardSize;
	striped: boolean;
	hoverable: boolean;
	rowClassName?: RowClassName<T>;
}>;

export function TableRow<T>({
	row,
	index,
	columns,
	size,
	striped,
	hoverable,
	rowClassName,
}: TableRowProps<T>) {
	return (
		<tr className={getRowClasses({ striped, hoverable, rowClassName, row, index })}>
			{columns.map(column => (
				<TableCell key={column.id} column={column} row={row} size={size} />
			))}
		</tr>
	);
}

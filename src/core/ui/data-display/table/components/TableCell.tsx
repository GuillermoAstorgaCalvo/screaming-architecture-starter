import { getCellClasses } from '@core/ui/data-display/table/helpers/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { TableColumn } from '@src-types/ui/data/table';

// ============================================================================
// Cell Component
// ============================================================================

type TableCellProps<T> = Readonly<{
	column: TableColumn<T>;
	row: T;
	size: StandardSize;
}>;

export function TableCell<T>({ column, row, size }: TableCellProps<T>) {
	const value = column.accessor(row);
	const cellContent = column.cellRenderer ? column.cellRenderer(value, row) : value;
	return <td className={getCellClasses(size)}>{cellContent}</td>;
}

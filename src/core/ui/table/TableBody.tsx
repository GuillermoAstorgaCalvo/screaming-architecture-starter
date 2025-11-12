import type { StandardSize } from '@src-types/ui/base';
import type { TableColumn } from '@src-types/ui/data';

import { getTableRowId, type RowClassName } from './TableHelpers';
import { TableRow } from './TableRow';

// ============================================================================
// Body Component
// ============================================================================

type TableBodyProps<T> = Readonly<{
	columns: TableColumn<T>[];
	data: T[];
	getRowId?: ((row: T, index: number) => string) | undefined;
	striped: boolean;
	hoverable: boolean;
	size: StandardSize;
	rowClassName?: RowClassName<T>;
}>;

export function TableBody<T>({
	columns,
	data,
	getRowId,
	striped,
	hoverable,
	size,
	rowClassName,
}: TableBodyProps<T>) {
	return (
		<tbody>
			{data.map((row, index) => (
				<TableRow
					key={getTableRowId(row, index, getRowId)}
					row={row}
					index={index}
					columns={columns}
					size={size}
					striped={striped}
					hoverable={hoverable}
					rowClassName={rowClassName}
				/>
			))}
		</tbody>
	);
}

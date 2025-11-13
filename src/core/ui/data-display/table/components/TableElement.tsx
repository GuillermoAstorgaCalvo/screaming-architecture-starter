import { TableBody } from '@core/ui/data-display/table/components/TableBody';
import { TableHeader } from '@core/ui/data-display/table/components/TableHeader';
import {
	getTableClasses,
	type RowClassName,
} from '@core/ui/data-display/table/helpers/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { TableColumn } from '@src-types/ui/data/table';

// ============================================================================
// Table Element Component
// ============================================================================

type TableElementProps<T> = Readonly<{
	columns: TableColumn<T>[];
	data: T[];
	getRowId?: ((row: T, index: number) => string) | undefined;
	striped: boolean;
	hoverable: boolean;
	size: StandardSize;
	rowClassName?: RowClassName<T>;
	className?: string | undefined;
}>;

export function TableElement<T>({
	columns,
	data,
	getRowId,
	striped,
	hoverable,
	size,
	rowClassName,
	className,
	...props
}: TableElementProps<T>) {
	return (
		<table className={getTableClasses(className)} {...props}>
			<TableHeader columns={columns} size={size} />
			<TableBody
				columns={columns}
				data={data}
				getRowId={getRowId}
				striped={striped}
				hoverable={hoverable}
				size={size}
				rowClassName={rowClassName}
			/>
		</table>
	);
}

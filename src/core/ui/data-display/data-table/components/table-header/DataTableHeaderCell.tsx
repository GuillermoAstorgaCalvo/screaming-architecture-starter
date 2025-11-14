import type { DataTableHeaderCellProps } from '@core/ui/data-display/data-table/components/table-header/DataTableHeader.types';
import { HeaderContent } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderContent';
import {
	getColumnStyle,
	renderColumnResizer,
} from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderHelpers';
import { getHeaderClasses } from '@core/ui/data-display/table/helpers/TableHelpers';

/**
 * DataTableHeaderCell - Individual header cell with sorting and resizing support
 */
export function DataTableHeaderCell<T>({
	column,
	size,
	sort,
	onSort,
	columnWidths,
	enableColumnResize,
	onColumnResize,
}: Readonly<DataTableHeaderCellProps<T>>) {
	const isSortable = column.sortable ?? false;
	const isSorted = sort?.columnId === column.id;
	const sortDirection = isSorted ? sort.direction : null;
	const style = getColumnStyle(column, columnWidths);
	const canResize =
		enableColumnResize && (column.resizable ?? true) && onColumnResize !== undefined;

	return (
		<th scope="col" className={getHeaderClasses(size)} style={style}>
			<div className="flex items-center gap-2">
				<HeaderContent
					column={column}
					isSortable={isSortable}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				{canResize
					? renderColumnResizer(column, onColumnResize as (id: string, w: number) => void)
					: null}
			</div>
		</th>
	);
}

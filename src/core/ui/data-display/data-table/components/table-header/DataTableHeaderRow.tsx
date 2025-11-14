import { ColumnCells } from '@core/ui/data-display/data-table/components/table-header/DataTableColumnCells';
import type { HeaderRowProps } from '@core/ui/data-display/data-table/components/table-header/DataTableHeader.types';
import { SelectionCheckbox } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderComponents';

/**
 * HeaderRow - Table header row with selection checkbox and column cells
 */
export function HeaderRow<T>({
	columns,
	size,
	sort,
	onSort,
	enableRowSelection,
	onSelectAll,
	isAllSelected,
	isSomeSelected,
	selectAllLabel,
	columnWidths,
	enableColumnResize,
	onColumnResize,
}: Readonly<HeaderRowProps<T>>) {
	return (
		<tr>
			{enableRowSelection ? (
				<SelectionCheckbox
					size={size}
					isAllSelected={isAllSelected}
					isSomeSelected={isSomeSelected}
					onSelectAll={onSelectAll}
					selectAllLabel={selectAllLabel}
				/>
			) : null}
			<ColumnCells
				columns={columns}
				size={size}
				sort={sort}
				onSort={onSort}
				columnWidths={columnWidths}
				enableColumnResize={enableColumnResize}
				{...(onColumnResize && { onColumnResize })}
			/>
		</tr>
	);
}

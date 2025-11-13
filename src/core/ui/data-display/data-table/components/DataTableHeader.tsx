import {
	SelectionCheckbox,
	SortButton,
} from '@core/ui/data-display/data-table/components/DataTableHeaderComponents';
import {
	getColumnStyle,
	renderColumnResizer,
} from '@core/ui/data-display/data-table/components/DataTableHeaderHelpers';
import { getHeaderClasses } from '@core/ui/data-display/table/helpers/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { ColumnSort, DataTableColumn } from '@src-types/ui/dataTable';

type SortDirection = 'asc' | 'desc' | null;

export interface DataTableHeaderProps<T> {
	columns: DataTableColumn<T>[];
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	enableRowSelection: boolean;
	onSelectAll: () => void;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	selectAllLabel?: string;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

interface DataTableHeaderCellProps<T> {
	column: DataTableColumn<T>;
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

interface HeaderContentProps<T> {
	column: DataTableColumn<T>;
	isSortable: boolean;
	sortDirection: SortDirection;
	onSort: (columnId: string) => void;
}

function HeaderContent<T>({
	column,
	isSortable,
	sortDirection,
	onSort,
}: Readonly<HeaderContentProps<T>>) {
	return isSortable ? (
		<SortButton column={column} sortDirection={sortDirection} onSort={onSort} />
	) : (
		<span className="flex-1">{column.header}</span>
	);
}

function DataTableHeaderCell<T>({
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

interface HeaderRowProps<T> {
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
	onColumnResize?: (columnId: string, width: number) => void;
}

interface ColumnCellsProps<T> {
	columns: DataTableColumn<T>[];
	size: StandardSize;
	sort: ColumnSort<T> | null;
	onSort: (columnId: string) => void;
	columnWidths: Map<string, number>;
	enableColumnResize: boolean;
	onColumnResize?: (columnId: string, width: number) => void;
}

function ColumnCells<T>({
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

function HeaderRow<T>({
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

/**
 * DataTableHeader - Enhanced table header with sorting and selection
 */
export function DataTableHeader<T>(props: Readonly<DataTableHeaderProps<T>>) {
	const { selectAllLabel = 'Select all rows', ...rowProps } = props;
	return (
		<thead>
			<HeaderRow {...rowProps} selectAllLabel={selectAllLabel} />
		</thead>
	);
}

import { getHeaderClasses } from '@core/ui/table/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import type { MouseEvent as ReactMouseEvent } from 'react';

type SortDirection = 'asc' | 'desc' | null;

function getSortIcon(direction: SortDirection): string {
	if (direction === 'asc') return '↑';
	if (direction === 'desc') return '↓';
	return '⇅';
}

interface SortButtonProps<T> {
	column: DataTableColumn<T>;
	sortDirection: SortDirection;
	onSort: (columnId: string) => void;
}

export function SortButton<T>({ column, sortDirection, onSort }: Readonly<SortButtonProps<T>>) {
	return (
		<button
			type="button"
			onClick={() => onSort(column.id)}
			className="flex items-center gap-1 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
			aria-label={`Sort by ${typeof column.header === 'string' ? column.header : 'column'}`}
		>
			<span className="flex-1">{column.header}</span>
			<span className="text-xs" aria-hidden="true">
				{getSortIcon(sortDirection)}
			</span>
		</button>
	);
}

interface SelectionCheckboxProps {
	size: StandardSize;
	isAllSelected: boolean;
	isSomeSelected: boolean;
	onSelectAll: () => void;
	selectAllLabel: string;
}

export function SelectionCheckbox({
	size,
	isAllSelected,
	isSomeSelected,
	onSelectAll,
	selectAllLabel,
}: Readonly<SelectionCheckboxProps>) {
	return (
		<th scope="col" className={getHeaderClasses(size)} style={{ width: '48px' }}>
			<input
				type="checkbox"
				checked={isAllSelected}
				ref={input => {
					if (input) {
						input.indeterminate = isSomeSelected;
					}
				}}
				onChange={onSelectAll}
				aria-label={selectAllLabel}
				className="cursor-pointer"
			/>
		</th>
	);
}

interface ColumnResizerProps {
	readonly columnId: string;
	readonly onResize: (columnId: string, width: number) => void;
	readonly minWidth?: number;
	readonly maxWidth?: number;
}

export function ColumnResizer({
	columnId,
	onResize,
	minWidth,
	maxWidth,
}: Readonly<ColumnResizerProps>) {
	const handleMouseDown = (e: ReactMouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const startX = e.clientX;
		const th = (e.currentTarget as HTMLElement).closest('th');
		if (!th) return;

		const startWidth = th.offsetWidth;

		const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
			const diff = moveEvent.clientX - startX;
			let newWidth = startWidth + diff;

			if (minWidth !== undefined) {
				newWidth = Math.max(newWidth, minWidth);
			}
			if (maxWidth !== undefined) {
				newWidth = Math.min(newWidth, maxWidth);
			}

			onResize(columnId, newWidth);
		};

		const handleMouseUp = () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	return (
		<button
			type="button"
			onMouseDown={handleMouseDown}
			className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 bg-transparent border-0 p-0"
			style={{ right: '-2px' }}
			aria-label={`Resize column ${columnId}`}
		/>
	);
}

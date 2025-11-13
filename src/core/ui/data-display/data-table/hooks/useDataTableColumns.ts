import type { DataTableColumn } from '@src-types/ui/dataTable';
import { type Dispatch, type SetStateAction, useCallback, useState } from 'react';

export interface UseDataTableColumnsOptions<T> {
	columns: DataTableColumn<T>[];
	onColumnsReorder?: (columnIds: string[]) => void;
}

export interface UseDataTableColumnsReturn<T> {
	columns: DataTableColumn<T>[];
	columnWidths: Map<string, number>;
	setColumnWidth: (columnId: string, width: number) => void;
	resetColumnWidth: (columnId: string) => void;
	resetAllColumnWidths: () => void;
	moveColumn: (fromIndex: number, toIndex: number) => void;
	getColumnWidth: (columnId: string) => number | undefined;
}

function createInitialWidths<T>(columns: DataTableColumn<T>[]): Map<string, number> {
	const widths = new Map<string, number>();
	for (const col of columns) {
		if (col.initialWidth) {
			widths.set(col.id, col.initialWidth);
		}
	}
	return widths;
}

function updateWidthMap(
	prev: Map<string, number>,
	columnId: string,
	width: number | undefined
): Map<string, number> {
	const newWidths = new Map(prev);
	if (width === undefined) {
		newWidths.delete(columnId);
	} else {
		newWidths.set(columnId, width);
	}
	return newWidths;
}

function reorderColumns<T>(
	columns: DataTableColumn<T>[],
	fromIndex: number,
	toIndex: number
): DataTableColumn<T>[] {
	const newColumns = [...columns];
	const [movedColumn] = newColumns.splice(fromIndex, 1);
	if (movedColumn) {
		newColumns.splice(toIndex, 0, movedColumn);
	}
	return newColumns;
}

function getColumnInitialWidth<T>(
	columns: DataTableColumn<T>[],
	columnId: string
): number | undefined {
	return columns.find(c => c.id === columnId)?.initialWidth;
}

interface ColumnMoveOptions {
	fromIndex: number;
	toIndex: number;
	onReorder?: (columnIds: string[]) => void;
}

function handleColumnMove<T>(
	prev: DataTableColumn<T>[],
	options: ColumnMoveOptions
): DataTableColumn<T>[] {
	const cols = reorderColumns(prev, options.fromIndex, options.toIndex);
	options.onReorder?.(cols.map(c => c.id));
	return cols;
}

function useColumnWidthHandlers<T>(
	columns: DataTableColumn<T>[],
	setColumnWidths: Dispatch<SetStateAction<Map<string, number>>>
) {
	const setColumnWidth = useCallback(
		(columnId: string, width: number) =>
			setColumnWidths(prev => updateWidthMap(prev, columnId, width)),
		[setColumnWidths]
	);

	const resetColumnWidth = useCallback(
		(columnId: string) =>
			setColumnWidths(prev =>
				updateWidthMap(prev, columnId, getColumnInitialWidth(columns, columnId))
			),
		[columns, setColumnWidths]
	);

	const resetAllColumnWidths = useCallback(
		() => setColumnWidths(createInitialWidths(columns)),
		[columns, setColumnWidths]
	);

	return { setColumnWidth, resetColumnWidth, resetAllColumnWidths };
}

function useColumnOrderHandlers<T>(
	onColumnsReorder: ((columnIds: string[]) => void) | undefined,
	setColumns: Dispatch<SetStateAction<DataTableColumn<T>[]>>
) {
	const moveColumn = useCallback(
		(fromIndex: number, toIndex: number) => {
			const options: ColumnMoveOptions = { fromIndex, toIndex };
			if (onColumnsReorder) {
				options.onReorder = onColumnsReorder;
			}
			setColumns(prev => handleColumnMove(prev, options));
		},
		[onColumnsReorder, setColumns]
	);

	return { moveColumn };
}

/**
 * Hook for managing DataTable column state (resizing and reordering)
 */
export function useDataTableColumns<T = unknown>({
	columns: initialColumns,
	onColumnsReorder,
}: UseDataTableColumnsOptions<T>): UseDataTableColumnsReturn<T> {
	const [columns, setColumns] = useState(initialColumns);
	const [columnWidths, setColumnWidths] = useState(() => createInitialWidths(initialColumns));

	const { setColumnWidth, resetColumnWidth, resetAllColumnWidths } = useColumnWidthHandlers(
		columns,
		setColumnWidths
	);
	const { moveColumn } = useColumnOrderHandlers(onColumnsReorder, setColumns);
	const getColumnWidth = useCallback(
		(columnId: string) => columnWidths.get(columnId),
		[columnWidths]
	);

	return {
		columns,
		columnWidths,
		setColumnWidth,
		resetColumnWidth,
		resetAllColumnWidths,
		moveColumn,
		getColumnWidth,
	};
}

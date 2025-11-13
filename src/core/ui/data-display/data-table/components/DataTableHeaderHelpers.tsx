import { ColumnResizer } from '@core/ui/data-display/data-table/components/DataTableHeaderComponents';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import type { CSSProperties } from 'react';

export function getColumnStyle<T>(
	column: DataTableColumn<T>,
	columnWidths: Map<string, number>
): CSSProperties {
	const columnWidth = columnWidths.get(column.id);
	const style: CSSProperties = {};
	if (columnWidth) {
		style.width = `${columnWidth}px`;
		style.minWidth = `${columnWidth}px`;
	} else if (column.width) {
		style.width = column.width;
	}
	return style;
}

export function renderColumnResizer<T>(
	column: DataTableColumn<T>,
	onColumnResize: (columnId: string, width: number) => void
) {
	const props = {
		columnId: column.id,
		onResize: onColumnResize,
		...(column.minWidth !== undefined && { minWidth: column.minWidth }),
		...(column.maxWidth !== undefined && { maxWidth: column.maxWidth }),
	};
	return <ColumnResizer {...props} />;
}

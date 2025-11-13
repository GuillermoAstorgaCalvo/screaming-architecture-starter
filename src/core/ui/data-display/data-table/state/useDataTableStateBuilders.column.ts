import type { UseColumnStateOptions } from '@core/ui/data-display/data-table/types/useDataTableStateBuilders.types';
import type { DataTableColumn } from '@src-types/ui/dataTable';

/**
 * Builds options for column state hook
 */
export function buildColumnStateOptions<T>(
	initialColumns: DataTableColumn<T>[],
	enableColumnReorder: boolean,
	onColumnsReorder?: (columnIds: string[]) => void
): UseColumnStateOptions<T> {
	const options: UseColumnStateOptions<T> = {
		initialColumns,
		enableColumnReorder,
	};
	if (onColumnsReorder) {
		options.onColumnsReorder = onColumnsReorder;
	}
	return options;
}

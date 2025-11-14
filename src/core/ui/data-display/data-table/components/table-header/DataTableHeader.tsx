import type { DataTableHeaderProps } from '@core/ui/data-display/data-table/components/DataTableHeader.types';
import { HeaderRow } from '@core/ui/data-display/data-table/components/DataTableHeaderRow';

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

export type { DataTableHeaderProps } from '@core/ui/data-display/data-table/components/DataTableHeader.types';

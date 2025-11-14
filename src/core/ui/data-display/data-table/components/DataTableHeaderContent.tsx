import type { HeaderContentProps } from '@core/ui/data-display/data-table/components/DataTableHeader.types';
import { SortButton } from '@core/ui/data-display/data-table/components/DataTableHeaderComponents';

/**
 * HeaderContent - Renders either a sortable button or plain header text
 */
export function HeaderContent<T>({
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

import { getHeaderClasses } from '@core/ui/data-display/table/helpers/TableHelpers';
import type { StandardSize } from '@src-types/ui/base';
import type { TableColumn } from '@src-types/ui/data/table';

// ============================================================================
// Header Component
// ============================================================================

type TableHeaderProps<T> = Readonly<{
	columns: TableColumn<T>[];
	size: StandardSize;
}>;

export function TableHeader<T>({ columns, size }: TableHeaderProps<T>) {
	return (
		<thead>
			<tr>
				{columns.map(column => {
					const headerContent = column.headerRenderer
						? column.headerRenderer(column)
						: column.header;
					return (
						<th
							key={column.id}
							scope="col"
							className={getHeaderClasses(size)}
							{...(column.width && { style: { width: column.width } })}
						>
							{headerContent}
						</th>
					);
				})}
			</tr>
		</thead>
	);
}

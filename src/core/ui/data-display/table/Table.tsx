import { TableElement } from '@core/ui/data-display/table/components/TableElement';
import { TableEmptyState } from '@core/ui/data-display/table/components/TableEmptyState';
import type { TableProps } from '@src-types/ui/data/table';

/**
 * Table - Data table component
 *
 * Features:
 * - Accessible: proper semantic HTML and ARIA attributes
 * - Size variants: sm, md, lg
 * - Striped rows option
 * - Hoverable rows option
 * - Customizable column definitions
 * - Custom cell and header renderers
 * - Empty state support
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: (row) => row.name },
 *     { id: 'age', header: 'Age', accessor: (row) => row.age },
 *   ]}
 *   data={[
 *     { name: 'John', age: 30 },
 *     { name: 'Jane', age: 25 },
 *   ]}
 *   striped
 *   hoverable
 * />
 * ```
 */
export default function Table<T = unknown>({
	columns,
	data,
	getRowId,
	striped = false,
	hoverable = true,
	size = 'md',
	emptyMessage = 'No data available',
	rowClassName,
	className,
	...props
}: Readonly<TableProps<T>>) {
	if (data.length === 0) return <TableEmptyState emptyMessage={emptyMessage} />;

	return (
		<div className="overflow-x-auto">
			<TableElement
				columns={columns}
				data={data}
				getRowId={getRowId}
				striped={striped}
				hoverable={hoverable}
				size={size}
				rowClassName={rowClassName}
				className={className}
				{...props}
			/>
		</div>
	);
}

import type { DataTableProps } from '@src-types/ui/dataTable';

import { DataTableRenderer } from './DataTableRenderer';
import { buildRendererParams } from './DataTableRendererParamBuilders';
import { buildRendererProps } from './DataTableRendererPropsBuilders';
import { buildStateOptions } from './DataTableStateBuilders';
import { useDataTableState } from './useDataTableState';

/**
 * DataTable - Enhanced data table component with sorting, filtering, pagination, selection, and column management
 *
 * Features:
 * - Built-in column sorting (asc/desc)
 * - Global search filtering
 * - Column-specific filtering
 * - Integrated pagination
 * - Row selection (single/multiple)
 * - Column resizing
 * - Column reordering
 * - Accessible: proper ARIA attributes
 * - Size variants: sm, md, lg
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: (row) => row.name, sortable: true },
 *     { id: 'age', header: 'Age', accessor: (row) => row.age, sortable: true },
 *   ]}
 *   data={users}
 *   enableSorting
 *   enableGlobalFilter
 *   enablePagination
 *   enableRowSelection
 *   pageSize={10}
 * />
 * ```
 */
export default function DataTable<T = unknown>(props: Readonly<DataTableProps<T>>) {
	const stateOptions = buildStateOptions(props);
	const tableState = useDataTableState(stateOptions);
	const rendererParams = buildRendererParams(props, stateOptions, tableState);
	const rendererProps = buildRendererProps(rendererParams);

	return <DataTableRenderer {...rendererProps} />;
}

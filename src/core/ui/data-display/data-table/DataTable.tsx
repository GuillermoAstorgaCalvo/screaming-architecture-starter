import { DataTableRenderer } from '@core/ui/data-display/data-table/components/DataTableRenderer';
import { buildRendererParams } from '@core/ui/data-display/data-table/helpers/DataTableRendererParamBuilders';
import { buildRendererProps } from '@core/ui/data-display/data-table/helpers/DataTableRendererPropsBuilders';
import { buildStateOptions } from '@core/ui/data-display/data-table/helpers/DataTableStateBuilders';
import { useDataTableState } from '@core/ui/data-display/data-table/hooks/useDataTableState';
import type { DataTableProps } from '@src-types/ui/dataTable';

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

import DataTable from '@core/ui/data-display/data-table/DataTable';
import {
	TABLE_COLUMNS,
	TABLE_DATA,
} from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DataTableShowcase() {
	return (
		<ShowcaseSection
			title="DataTable"
			description="Advanced data table with filtering, sorting, pagination"
			tags={['data', 'table', 'filter', 'sort', 'pagination']}
		>
			<DataTable
				columns={TABLE_COLUMNS.map(col => ({ ...col, sortable: true }))}
				data={TABLE_DATA}
				enableSorting
				enableGlobalFilter
				enablePagination
				pageSize={10}
			/>
		</ShowcaseSection>
	);
}

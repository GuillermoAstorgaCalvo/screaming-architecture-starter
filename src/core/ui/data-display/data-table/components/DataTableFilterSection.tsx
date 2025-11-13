import { DataTableFilter } from '@core/ui/data-display/data-table/components/DataTableFilter';

interface DataTableFilterSectionProps {
	enableGlobalFilter: boolean;
	globalSearch: string;
	onGlobalSearchChange: (value: string) => void;
	globalSearchPlaceholder: string;
}

/**
 * DataTableFilterSection - Renders the global filter section for DataTable
 */
export function DataTableFilterSection({
	enableGlobalFilter,
	globalSearch,
	onGlobalSearchChange,
	globalSearchPlaceholder,
}: Readonly<DataTableFilterSectionProps>) {
	if (!enableGlobalFilter) return null;

	return (
		<DataTableFilter
			globalSearch={globalSearch}
			onGlobalSearchChange={onGlobalSearchChange}
			placeholder={globalSearchPlaceholder}
		/>
	);
}

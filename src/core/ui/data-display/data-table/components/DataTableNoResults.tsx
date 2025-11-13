import { DataTableFilter } from '@core/ui/data-display/data-table/components/DataTableFilter';

interface DataTableNoResultsProps {
	enableGlobalFilter: boolean;
	globalSearch: string;
	onGlobalSearchChange: (value: string) => void;
	placeholder: string;
}

export function DataTableNoResults({
	enableGlobalFilter,
	globalSearch,
	onGlobalSearchChange,
	placeholder,
}: Readonly<DataTableNoResultsProps>) {
	return (
		<div className="space-y-4">
			{enableGlobalFilter ? (
				<DataTableFilter
					globalSearch={globalSearch}
					onGlobalSearchChange={onGlobalSearchChange}
					placeholder={placeholder}
				/>
			) : null}
			<div className="text-center py-8 text-gray-500 dark:text-gray-400">
				No results found. Try adjusting your filters.
			</div>
		</div>
	);
}

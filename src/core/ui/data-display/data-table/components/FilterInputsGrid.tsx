import { FilterInput } from '@core/ui/data-display/data-table/components/FilterInput';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

export interface FilterInputsGridProps {
	filters: AdvancedFilter[];
	onFilterChange: (filterId: string, value: unknown) => void;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

/**
 * FilterInputsGrid - Renders a grid of filter inputs
 */
export function FilterInputsGrid({
	filters,
	onFilterChange,
	disabled = false,
	size = 'md',
}: Readonly<FilterInputsGridProps>) {
	return (
		<div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{filters.map(filter => (
				<div key={filter.id} className="flex flex-col">
					<label
						htmlFor={`filter-${filter.id}`}
						className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						{filter.label}
					</label>
					<FilterInput filter={filter} onChange={onFilterChange} disabled={disabled} size={size} />
				</div>
			))}
		</div>
	);
}

import { FilterInput } from '@core/ui/data-display/data-table/components/advanced-filter/FilterInput';
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
		<div className="mb-md grid gap-md md:grid-cols-2 lg:grid-cols-3">
			{filters.map(filter => (
				<div key={filter.id} className="flex flex-col">
					<label
						htmlFor={`filter-${filter.id}`}
						className="mb-sm text-sm font-medium text-text-secondary dark:text-text-secondary"
					>
						{filter.label}
					</label>
					<FilterInput filter={filter} onChange={onFilterChange} disabled={disabled} size={size} />
				</div>
			))}
		</div>
	);
}

import { getActiveFilterValues } from '@core/ui/data-display/data-table/helpers/filterDisplay';
import { getActiveFilters } from '@core/ui/data-display/data-table/helpers/filterValidation';
import {
	resetFilter,
	updateFilterValue,
} from '@core/ui/data-display/data-table/helpers/filterValueOperations';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { useCallback, useMemo, useState } from 'react';

export interface UseAdvancedFilterBarProps {
	filters: AdvancedFilter[];
	onFiltersChange?: ((filters: AdvancedFilter[]) => void) | undefined;
}

/**
 * Hook for managing advanced filter bar state and handlers
 */
export function useAdvancedFilterBar({ filters, onFiltersChange }: UseAdvancedFilterBarProps) {
	const [isBuilderOpen, setIsBuilderOpen] = useState(false);

	const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);

	const activeFilterValues = useMemo(() => getActiveFilterValues(activeFilters), [activeFilters]);

	const handleFilterChange = useCallback(
		(filterId: string, newValue: unknown) => {
			const updatedFilters = filters.map(filter =>
				filter.id === filterId ? updateFilterValue(filter, newValue) : filter
			);
			onFiltersChange?.(updatedFilters);
		},
		[filters, onFiltersChange]
	);

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const updatedFilters = filters.map(filter =>
				filter.id === filterId ? resetFilter(filter) : filter
			);
			onFiltersChange?.(updatedFilters);
		},
		[filters, onFiltersChange]
	);

	const handleClearAllFilters = useCallback(() => {
		const clearedFilters = filters.map(filter => resetFilter(filter));
		onFiltersChange?.(clearedFilters);
	}, [filters, onFiltersChange]);

	const toggleBuilder = useCallback(() => {
		setIsBuilderOpen(prev => !prev);
	}, []);

	return {
		isBuilderOpen,
		activeFilterValues,
		handleFilterChange,
		handleRemoveFilter,
		handleClearAllFilters,
		toggleBuilder,
	};
}

import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { useCallback, useState } from 'react';

import { createNewFilter, getDefaultFilterType } from './filterBuilderHelpers';

interface UseFilterBuilderOptions {
	readonly filters: AdvancedFilter[];
	readonly onFiltersChange?: ((filters: AdvancedFilter[]) => void) | undefined;
}

export function useFilterBuilder({ filters, onFiltersChange }: UseFilterBuilderOptions) {
	const [newFilterType, setNewFilterType] =
		useState<AdvancedFilter['type']>(getDefaultFilterType());
	const [newFilterLabel, setNewFilterLabel] = useState('');

	const handleAddFilter = useCallback(() => {
		const trimmedLabel = newFilterLabel.trim();
		if (!trimmedLabel || !onFiltersChange) {
			return;
		}

		try {
			const newFilter = createNewFilter(trimmedLabel, newFilterType);
			onFiltersChange([...filters, newFilter]);
			setNewFilterLabel('');
			setNewFilterType(getDefaultFilterType());
		} catch (error) {
			// Error handling for invalid filter creation
			console.error('Failed to create filter:', error);
		}
	}, [newFilterLabel, newFilterType, filters, onFiltersChange]);

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			if (!onFiltersChange) {
				return;
			}
			onFiltersChange(filters.filter(f => f.id !== filterId));
		},
		[filters, onFiltersChange]
	);

	return {
		newFilterType,
		newFilterLabel,
		setNewFilterType,
		setNewFilterLabel,
		handleAddFilter,
		handleRemoveFilter,
	};
}

import { useCallback } from 'react';

import type { SearchHandlersParams } from './useTransfer.types';

/**
 * Creates search change handlers
 */
export function useSearchHandlers(params: SearchHandlersParams) {
	const {
		setSourceSearchValue,
		setTargetSearchValue,
		setSelectedSourceValues,
		setSelectedTargetValues,
	} = params;

	const handleSourceSearchChange = useCallback(
		(value: string) => {
			setSourceSearchValue(value);
			setSelectedSourceValues(new Set()); // Clear selection when searching
		},
		[setSourceSearchValue, setSelectedSourceValues]
	);

	const handleTargetSearchChange = useCallback(
		(value: string) => {
			setTargetSearchValue(value);
			setSelectedTargetValues(new Set()); // Clear selection when searching
		},
		[setTargetSearchValue, setSelectedTargetValues]
	);

	return { handleSourceSearchChange, handleTargetSearchChange };
}

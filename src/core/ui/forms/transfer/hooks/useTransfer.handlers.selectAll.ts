import type { SelectAllHandlersParams } from '@core/ui/forms/transfer/types/useTransfer.types';
import { useCallback } from 'react';

/**
 * Creates select all/none handlers
 */
export function useSelectAllHandlers<T>(params: SelectAllHandlersParams<T>) {
	const {
		disabled,
		filteredSourceOptions,
		filteredTargetOptions,
		setSelectedSourceValues,
		setSelectedTargetValues,
	} = params;

	const handleSourceSelectAll = useCallback(() => {
		if (disabled) return;
		const allValues = new Set(
			filteredSourceOptions.filter(opt => !opt.disabled).map(opt => opt.value)
		);
		setSelectedSourceValues(allValues);
	}, [disabled, filteredSourceOptions, setSelectedSourceValues]);

	const handleSourceSelectNone = useCallback(() => {
		if (disabled) return;
		setSelectedSourceValues(new Set());
	}, [disabled, setSelectedSourceValues]);

	const handleTargetSelectAll = useCallback(() => {
		if (disabled) return;
		const allValues = new Set(
			filteredTargetOptions.filter(opt => !opt.disabled).map(opt => opt.value)
		);
		setSelectedTargetValues(allValues);
	}, [disabled, filteredTargetOptions, setSelectedTargetValues]);

	const handleTargetSelectNone = useCallback(() => {
		if (disabled) return;
		setSelectedTargetValues(new Set());
	}, [disabled, setSelectedTargetValues]);

	return {
		handleSourceSelectAll,
		handleSourceSelectNone,
		handleTargetSelectAll,
		handleTargetSelectNone,
	};
}

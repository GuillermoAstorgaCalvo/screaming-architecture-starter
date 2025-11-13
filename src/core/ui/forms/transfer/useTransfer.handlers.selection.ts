import { useCallback } from 'react';

/**
 * Creates selection toggle handlers
 */
export function useSelectionHandlers(
	disabled: boolean,
	setSelectedSourceValues: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void,
	setSelectedTargetValues: (value: Set<string> | ((prev: Set<string>) => Set<string>)) => void
) {
	const handleSourceItemToggle = useCallback(
		(value: string) => {
			if (disabled) return;
			setSelectedSourceValues(prev => {
				const next = new Set(prev);
				if (next.has(value)) {
					next.delete(value);
				} else {
					next.add(value);
				}
				return next;
			});
		},
		[disabled, setSelectedSourceValues]
	);

	const handleTargetItemToggle = useCallback(
		(value: string) => {
			if (disabled) return;
			setSelectedTargetValues(prev => {
				const next = new Set(prev);
				if (next.has(value)) {
					next.delete(value);
				} else {
					next.add(value);
				}
				return next;
			});
		},
		[disabled, setSelectedTargetValues]
	);

	return { handleSourceItemToggle, handleTargetItemToggle };
}

import { useMemo } from 'react';

import { createNumberInputHandlers } from './NumberInputHandlers';
import type { UseNumberInputHandlersOptions } from './useNumberInput.types';

/**
 * Hook to create memoized handlers for number input
 *
 * @param options - Options for creating handlers
 * @returns Memoized handlers for increment, decrement, and input change
 *
 * @internal
 */
export function useNumberInputHandlers({
	valueAndCapability,
	min,
	max,
	step,
	disabled,
	onChange,
}: Readonly<UseNumberInputHandlersOptions>) {
	return useMemo(
		() =>
			createNumberInputHandlers({
				valueAndCapability,
				min,
				max,
				step,
				disabled,
				onChange,
			}),
		[valueAndCapability, min, max, step, disabled, onChange]
	);
}

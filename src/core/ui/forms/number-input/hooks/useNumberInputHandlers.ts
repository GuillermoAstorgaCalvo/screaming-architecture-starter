import { createNumberInputHandlers } from '@core/ui/forms/number-input/helpers/NumberInputHandlers';
import type { UseNumberInputHandlersOptions } from '@core/ui/forms/number-input/types/useNumberInput.types';
import { useMemo } from 'react';

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

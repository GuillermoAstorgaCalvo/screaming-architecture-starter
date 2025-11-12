import { useMemo } from 'react';

import type { NumberInputFieldProps } from './NumberInputTypes';
import type { UseNumberInputFieldPropsOptions } from './useNumberInput.types';

/**
 * Hook to build memoized field props for the NumberInputField component
 *
 * @param options - Options containing state, extracted props, value/capability, and handlers
 * @returns Memoized field props object
 *
 * @internal
 */
export function useNumberInputFieldProps({
	state,
	extracted,
	valueAndCapability,
	handlers,
}: Readonly<UseNumberInputFieldPropsOptions>): Readonly<NumberInputFieldProps> {
	const { canIncrement, canDecrement } = valueAndCapability;
	return useMemo(
		() => ({
			id: state.finalId,
			className: state.inputClasses,
			hasError: state.hasError,
			ariaDescribedBy: state.ariaDescribedBy,
			disabled: extracted.disabled,
			required: extracted.required,
			min: extracted.min,
			max: extracted.max,
			step: extracted.step,
			onIncrement: handlers.handleIncrement,
			onDecrement: handlers.handleDecrement,
			canIncrement,
			canDecrement,
			props: { ...extracted.rest, onChange: handlers.handleInputChange },
		}),
		[state, extracted, canIncrement, canDecrement, handlers]
	);
}

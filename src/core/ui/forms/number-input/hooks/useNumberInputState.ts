import {
	generateNumberInputId,
	getAriaDescribedBy,
} from '@core/ui/forms/number-input/helpers/NumberInputAccessibility';
import { getNumberInputClasses } from '@core/ui/forms/number-input/helpers/NumberInputClasses';
import type {
	UseNumberInputStateOptions,
	UseNumberInputStateReturn,
} from '@core/ui/forms/number-input/types/NumberInputTypes';
import { useId, useMemo } from 'react';

/**
 * Hook to compute number input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for number input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function useNumberInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseNumberInputStateOptions>): UseNumberInputStateReturn {
	const generatedId = useId();
	const finalId = useMemo(
		() => generateNumberInputId(generatedId, inputId, label),
		[generatedId, inputId, label]
	);
	const hasError = Boolean(error);
	const ariaDescribedBy = useMemo(
		() => (finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined),
		[finalId, error, helperText]
	);
	const inputClasses = useMemo(
		() =>
			getNumberInputClasses({
				size,
				hasError,
				className,
			}),
		[size, hasError, className]
	);
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

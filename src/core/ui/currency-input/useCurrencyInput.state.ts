import { useId } from 'react';

import {
	generateCurrencyInputId,
	getAriaDescribedBy,
	getCurrencyInputClasses,
} from './CurrencyInputHelpers';
import type {
	UseCurrencyInputStateOptions,
	UseCurrencyInputStateReturn,
} from './CurrencyInputTypes';

/**
 * Hook to compute currency input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for currency input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function useCurrencyInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
	currency: _currency,
}: Readonly<UseCurrencyInputStateOptions & { currency: string }>): UseCurrencyInputStateReturn {
	const generatedId = useId();
	const finalId = generateCurrencyInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getCurrencyInputClasses({
		size,
		hasError,
		hasCurrencySymbol: true,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

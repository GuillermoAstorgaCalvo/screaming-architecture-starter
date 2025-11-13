import {
	generateSearchInputId,
	getAriaDescribedBy,
	getSearchInputClasses,
} from '@core/ui/forms/search-input/helpers/SearchInputHelpers';
import type {
	UseSearchInputStateOptions,
	UseSearchInputStateReturn,
} from '@core/ui/forms/search-input/types/SearchInputTypes';
import { useId } from 'react';

/**
 * Hook to compute search input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size, error state, and clear button presence.
 *
 * @param options - Configuration options for search input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function useSearchInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
	hasClearButton,
}: Readonly<UseSearchInputStateOptions>): UseSearchInputStateReturn {
	const generatedId = useId();
	const finalId = generateSearchInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getSearchInputClasses({
		size,
		hasError,
		hasClearButton,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

import {
	generateTagInputId,
	getAriaDescribedBy,
	getTagInputClasses,
} from '@core/ui/forms/tag-input/helpers/TagInputHelpers';
import type {
	UseTagInputStateOptions,
	UseTagInputStateReturn,
} from '@core/ui/forms/tag-input/types/TagInputTypes';
import { useId } from 'react';

/**
 * Hook to compute tag input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for tag input state
 * @returns Computed tag input state including ID, error flag, ARIA attributes, and classes
 */
export function useTagInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseTagInputStateOptions>): UseTagInputStateReturn {
	const generatedId = useId();
	const finalId = generateTagInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getTagInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

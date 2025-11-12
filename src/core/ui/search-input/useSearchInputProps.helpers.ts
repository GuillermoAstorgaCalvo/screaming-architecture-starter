import type { ChangeEvent } from 'react';

import type { SearchInputFieldProps, UseSearchInputStateReturn } from './SearchInputTypes';
import type { ExtractedSearchInputProps } from './useSearchInputProps.extract';

/**
 * Determines whether the clear button should be visible
 *
 * The clear button is shown when:
 * - showClearButtonProp is not explicitly false
 * - The current value (value or defaultValue) is not empty
 *
 * @param value - Current controlled value
 * @param defaultValue - Default uncontrolled value
 * @param showClearButtonProp - Explicit clear button visibility prop
 * @returns Whether the clear button should be shown
 *
 * @internal
 */
export function shouldShowClearButton(
	value: string | undefined,
	defaultValue: string | undefined,
	showClearButtonProp: boolean | undefined
): boolean {
	const currentValue = value ?? defaultValue ?? '';
	return showClearButtonProp !== false && currentValue !== '';
}

/**
 * Builds field props object for the SearchInputField component
 *
 * Combines computed state with extracted props and handlers to create
 * the final field props object that will be passed to the SearchInputField component.
 *
 * @param options - Options containing state, extracted props, and handlers
 * @returns Complete field props object
 *
 * @internal
 */
export function buildFieldProps({
	state,
	extracted,
	showClearButton,
	onChange,
}: Readonly<{
	state: UseSearchInputStateReturn;
	extracted: ExtractedSearchInputProps;
	showClearButton: boolean;
	onChange?: ((value: string) => void) | undefined;
}>): Readonly<SearchInputFieldProps> {
	const handleClear = () => onChange?.('');
	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value);

	return {
		id: state.finalId,
		className: state.inputClasses,
		hasError: state.hasError,
		ariaDescribedBy: state.ariaDescribedBy,
		disabled: extracted.disabled,
		required: extracted.required,
		value: extracted.value,
		onClear: handleClear,
		showClearButton,
		props: {
			...extracted.rest,
			onChange: handleInputChange,
		},
	};
}

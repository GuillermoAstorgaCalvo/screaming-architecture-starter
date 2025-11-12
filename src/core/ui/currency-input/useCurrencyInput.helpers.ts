import type { StandardSize } from '@src-types/ui/base';
import type { CurrencyInputProps } from '@src-types/ui/forms-specialized';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

import type { CurrencyInputFieldProps, UseCurrencyInputStateReturn } from './CurrencyInputTypes';

interface BuildCurrencyInputFieldPropsOptions {
	readonly state: UseCurrencyInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly currency: string;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
		>
	>;
}

/**
 * Builds the field props object for the currency input field component.
 *
 * @param options - Options containing state, disabled, required, currency, and rest props
 * @returns Currency input field props ready for use in the field component
 */
export function buildCurrencyInputFieldProps(
	options: Readonly<BuildCurrencyInputFieldPropsOptions>
): Readonly<CurrencyInputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		currency: options.currency,
		props: options.rest,
	};
}

interface ExtractCurrencyInputPropsReturn {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly inputId?: string | undefined;
	readonly className?: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly currency: string;
	readonly value?: string | number | readonly string[] | undefined;
	readonly defaultValue?: string | number | readonly string[] | undefined;
	readonly onChange?: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
			| 'value'
			| 'defaultValue'
			| 'onChange'
		>
	>;
}

/**
 * Extracts and separates currency input props into categorized groups.
 *
 * Separates component-specific props (label, error, size, etc.) from standard
 * input HTML attributes, providing defaults where appropriate.
 *
 * @param props - Currency input component props
 * @returns Extracted and categorized props
 */
export function extractCurrencyInputProps(
	props: Readonly<CurrencyInputProps>
): ExtractCurrencyInputPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		inputId,
		className,
		disabled,
		required,
		currency = 'USD',
		value,
		defaultValue,
		onChange,
		...rest
	} = props;
	return {
		label,
		error,
		helperText,
		size,
		fullWidth,
		inputId,
		className,
		disabled,
		required,
		currency,
		value,
		defaultValue,
		onChange,
		rest,
	};
}

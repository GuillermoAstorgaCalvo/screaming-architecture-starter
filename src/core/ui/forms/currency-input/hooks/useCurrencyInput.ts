import { createCurrencyChangeHandler } from '@core/ui/forms/currency-input/helpers/useCurrencyInput.handlers';
import {
	buildCurrencyInputFieldProps,
	extractCurrencyInputProps,
} from '@core/ui/forms/currency-input/helpers/useCurrencyInput.helpers';
import { useCurrencyInputState } from '@core/ui/forms/currency-input/helpers/useCurrencyInput.state';
import type {
	CurrencyInputFieldProps,
	UseCurrencyInputStateReturn,
} from '@core/ui/forms/currency-input/types/CurrencyInputTypes';
import type { CurrencyInputProps } from '@src-types/ui/forms-specialized';

export interface UseCurrencyInputPropsOptions {
	readonly props: Readonly<CurrencyInputProps>;
}

export interface UseCurrencyInputPropsReturn {
	readonly state: UseCurrencyInputStateReturn;
	readonly fieldProps: Readonly<CurrencyInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to process CurrencyInput component props and return state and field props
 *
 * Extracts and processes CurrencyInput component props, computes state using
 * useCurrencyInputState, handles currency formatting, and builds field props.
 * Returns all necessary data for rendering the CurrencyInput component.
 *
 * @param options - Options containing CurrencyInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useCurrencyInputProps({
	props,
}: Readonly<UseCurrencyInputPropsOptions>): UseCurrencyInputPropsReturn {
	const extracted = extractCurrencyInputProps(props);
	const state = useCurrencyInputState({
		inputId: extracted.inputId,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		size: extracted.size,
		className: extracted.className,
		currency: extracted.currency,
	});
	const handleChange = createCurrencyChangeHandler({ onChange: extracted.onChange });
	const fieldProps = buildCurrencyInputFieldProps({
		state,
		disabled: extracted.disabled,
		required: extracted.required,
		currency: extracted.currency,
		rest: {
			...extracted.rest,
			...(extracted.value !== undefined &&
				typeof extracted.value !== 'object' && { value: String(extracted.value) }),
			...(extracted.defaultValue !== undefined &&
				typeof extracted.defaultValue !== 'object' && {
					defaultValue: String(extracted.defaultValue),
				}),
			onChange: handleChange,
		},
	});
	return {
		state,
		fieldProps,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		required: extracted.required,
		fullWidth: extracted.fullWidth,
	};
}

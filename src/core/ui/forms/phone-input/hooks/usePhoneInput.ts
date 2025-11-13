import {
	generatePhoneInputId,
	getAriaDescribedBy,
	getDefaultCountryCode,
	getPhoneInputClasses,
} from '@core/ui/forms/phone-input/helpers/PhoneInputHelpers';
import type {
	PhoneInputFieldProps,
	UsePhoneInputStateOptions,
	UsePhoneInputStateReturn,
} from '@core/ui/forms/phone-input/types/PhoneInputTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { PhoneInputProps } from '@src-types/ui/forms-specialized';
import { type InputHTMLAttributes, useId, useState } from 'react';

export interface UsePhoneInputPropsOptions {
	readonly props: Readonly<PhoneInputProps>;
}

export interface UsePhoneInputPropsReturn {
	readonly state: UsePhoneInputStateReturn;
	readonly fieldProps: Readonly<PhoneInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to compute phone input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for phone input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function usePhoneInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UsePhoneInputStateOptions>): UsePhoneInputStateReturn {
	const generatedId = useId();
	const finalId = generatePhoneInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getPhoneInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

interface BuildPhoneInputFieldPropsOptions {
	readonly state: UsePhoneInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly countryCode: string;
	readonly onCountryCodeChange: (code: string) => void;
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

function buildPhoneInputFieldProps(
	options: Readonly<BuildPhoneInputFieldPropsOptions>
): Readonly<PhoneInputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		countryCode: options.countryCode,
		onCountryCodeChange: options.onCountryCodeChange,
		props: options.rest,
	};
}

interface ExtractPhoneInputPropsReturn {
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly fullWidth: boolean;
	readonly inputId?: string | undefined;
	readonly className?: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly defaultCountryCode?: string | undefined;
	readonly onCountryCodeChangeProp?: ((code: string) => void) | undefined;
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

function extractPhoneInputProps(props: Readonly<PhoneInputProps>): ExtractPhoneInputPropsReturn {
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
		defaultCountryCode,
		onCountryCodeChange: onCountryCodeChangeProp,
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
		defaultCountryCode,
		onCountryCodeChangeProp,
		rest,
	};
}

/**
 * Hook to process PhoneInput component props and return state and field props
 *
 * Extracts and processes PhoneInput component props, computes state using
 * usePhoneInputState, manages country code state, and builds field props.
 * Returns all necessary data for rendering the PhoneInput component.
 *
 * @param options - Options containing PhoneInput component props
 * @returns Processed state, field props, and extracted props
 */
export function usePhoneInputProps({
	props,
}: Readonly<UsePhoneInputPropsOptions>): UsePhoneInputPropsReturn {
	const extracted = extractPhoneInputProps(props);
	const defaultCountry = getDefaultCountryCode();
	const [countryCode, setCountryCode] = useState(
		extracted.defaultCountryCode ?? defaultCountry.dialCode
	);
	const state = usePhoneInputState({
		inputId: extracted.inputId,
		label: extracted.label,
		error: extracted.error,
		helperText: extracted.helperText,
		size: extracted.size,
		className: extracted.className,
	});
	const handleCountryCodeChange = (code: string) => {
		setCountryCode(code);
		if (extracted.onCountryCodeChangeProp) {
			extracted.onCountryCodeChangeProp(code);
		}
	};
	const fieldProps = buildPhoneInputFieldProps({
		state,
		disabled: extracted.disabled,
		required: extracted.required,
		countryCode,
		onCountryCodeChange: handleCountryCodeChange,
		rest: extracted.rest,
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

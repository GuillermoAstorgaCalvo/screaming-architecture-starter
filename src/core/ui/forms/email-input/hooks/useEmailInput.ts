import {
	generateEmailInputId,
	getAriaDescribedBy,
	getEmailInputClasses,
} from '@core/ui/forms/email-input/helpers/EmailInputHelpers';
import type {
	EmailInputFieldProps,
	UseEmailInputStateOptions,
	UseEmailInputStateReturn,
} from '@core/ui/forms/email-input/types/EmailInputTypes';
import type { EmailInputProps } from '@src-types/ui/forms-specialized';
import { type InputHTMLAttributes, useId } from 'react';

export interface UseEmailInputPropsOptions {
	readonly props: Readonly<EmailInputProps>;
}

export interface UseEmailInputPropsReturn {
	readonly state: UseEmailInputStateReturn;
	readonly fieldProps: Readonly<EmailInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to compute email input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for email input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function useEmailInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseEmailInputStateOptions>): UseEmailInputStateReturn {
	const generatedId = useId();
	const finalId = generateEmailInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getEmailInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

interface BuildEmailInputFieldPropsOptions {
	readonly state: UseEmailInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
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

function buildEmailInputFieldProps(
	options: Readonly<BuildEmailInputFieldPropsOptions>
): Readonly<EmailInputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		props: options.rest,
	};
}

/**
 * Hook to process EmailInput component props and return state and field props
 *
 * Extracts and processes EmailInput component props, computes state using
 * useEmailInputState, and builds field props. Returns all necessary data
 * for rendering the EmailInput component.
 *
 * @param options - Options containing EmailInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useEmailInputProps({
	props,
}: Readonly<UseEmailInputPropsOptions>): UseEmailInputPropsReturn {
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
		...rest
	} = props;

	const state = useEmailInputState({
		inputId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps = buildEmailInputFieldProps({
		state,
		disabled,
		required,
		rest,
	});

	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

import type { PasswordInputProps } from '@src-types/ui/forms-specialized';
import { type InputHTMLAttributes, useId, useState } from 'react';

import {
	generatePasswordInputId,
	getAriaDescribedBy,
	getPasswordInputClasses,
} from './PasswordInputHelpers';
import type {
	PasswordInputFieldProps,
	UsePasswordInputStateOptions,
	UsePasswordInputStateReturn,
} from './PasswordInputTypes';

export interface UsePasswordInputPropsOptions {
	readonly props: Readonly<PasswordInputProps>;
}

export interface UsePasswordInputPropsReturn {
	readonly state: UsePasswordInputStateReturn;
	readonly fieldProps: Readonly<PasswordInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to compute password input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for password input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function usePasswordInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UsePasswordInputStateOptions>): UsePasswordInputStateReturn {
	const generatedId = useId();
	const finalId = generatePasswordInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getPasswordInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

interface BuildPasswordInputFieldPropsOptions {
	readonly state: UsePasswordInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly showPassword: boolean;
	readonly onToggleVisibility: () => void;
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

function buildPasswordInputFieldProps(
	options: Readonly<BuildPasswordInputFieldPropsOptions>
): Readonly<PasswordInputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		showPassword: options.showPassword,
		onToggleVisibility: options.onToggleVisibility,
		props: options.rest,
	};
}

/**
 * Hook to process PasswordInput component props and return state and field props
 *
 * Extracts and processes PasswordInput component props, computes state using
 * usePasswordInputState, manages password visibility state, and builds field props.
 * Returns all necessary data for rendering the PasswordInput component.
 *
 * @param options - Options containing PasswordInput component props
 * @returns Processed state, field props, and extracted props
 */
export function usePasswordInputProps({
	props,
}: Readonly<UsePasswordInputPropsOptions>): UsePasswordInputPropsReturn {
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

	const [showPassword, setShowPassword] = useState(false);

	const state = usePasswordInputState({
		inputId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps = buildPasswordInputFieldProps({
		state,
		disabled,
		required,
		showPassword,
		onToggleVisibility: () => {
			setShowPassword(prev => !prev);
		},
		rest,
	});

	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

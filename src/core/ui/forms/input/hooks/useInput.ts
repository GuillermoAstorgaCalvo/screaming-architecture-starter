import type { InputProps } from '@src-types/ui/forms';
import { type InputHTMLAttributes, type ReactNode, useId } from 'react';

import { generateInputId, getAriaDescribedBy, getInputClasses } from './InputHelpers';
import type { InputFieldProps, UseInputStateOptions, UseInputStateReturn } from './InputTypes';

export interface UseInputPropsOptions {
	readonly props: Readonly<InputProps>;
}

export interface UseInputPropsReturn {
	readonly state: UseInputStateReturn;
	readonly fieldProps: Readonly<InputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to compute input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size, error state, and icon presence.
 *
 * @param options - Configuration options for input state
 * @returns Computed input state including ID, error flag, ARIA attributes, and classes
 */
export function useInputState({
	inputId,
	label,
	error,
	helperText,
	size,
	leftIcon,
	rightIcon,
	className,
}: Readonly<UseInputStateOptions>): UseInputStateReturn {
	const generatedId = useId();
	const finalId = generateInputId(generatedId, inputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getInputClasses({
		size,
		hasError,
		hasLeftIcon: Boolean(leftIcon),
		hasRightIcon: Boolean(rightIcon),
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

interface BuildInputFieldPropsOptions {
	readonly state: UseInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly leftIcon?: ReactNode;
	readonly rightIcon?: ReactNode;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			'size' | 'id' | 'className' | 'disabled' | 'required' | 'aria-invalid' | 'aria-describedby'
		>
	>;
}

/**
 * Builds field props object for the InputField component
 *
 * Combines computed state with additional props to create the final
 * field props object that will be passed to the InputField component.
 *
 * @param options - Options containing state and field-specific props
 * @returns Complete field props object
 *
 * @internal
 */
function buildInputFieldProps(
	options: Readonly<BuildInputFieldPropsOptions>
): Readonly<InputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		leftIcon: options.leftIcon,
		rightIcon: options.rightIcon,
		props: options.rest,
	};
}

/**
 * Hook to process Input component props and return state and field props
 *
 * Extracts and processes Input component props, computes state using
 * useInputState, and builds field props. Returns all necessary data
 * for rendering the Input component including label, error, helper text,
 * and layout options.
 *
 * @example
 * ```tsx
 * function MyInput() {
 *   const { state, fieldProps, label, error, helperText, required, fullWidth } =
 *     useInputProps({
 *       props: {
 *         label: 'Email',
 *         type: 'email',
 *         error: 'Invalid email',
 *       },
 *     });
 *   // Use returned values to render Input component
 * }
 * ```
 *
 * @param options - Options containing Input component props
 * @returns Processed state, field props, and extracted props
 */
export function useInputProps({ props }: Readonly<UseInputPropsOptions>): UseInputPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		leftIcon,
		rightIcon,
		inputId,
		className,
		disabled,
		required,
		...rest
	} = props;
	const state = useInputState({
		inputId,
		label,
		error,
		helperText,
		size,
		leftIcon,
		rightIcon,
		className,
	});
	const fieldProps = buildInputFieldProps({ state, disabled, required, leftIcon, rightIcon, rest });
	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

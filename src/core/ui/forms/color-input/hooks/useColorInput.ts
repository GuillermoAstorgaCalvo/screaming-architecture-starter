import {
	generateColorInputId,
	getAriaDescribedBy,
	getColorInputClasses,
} from '@core/ui/forms/color-input/helpers/ColorInputHelpers';
import type {
	ColorInputFieldProps,
	UseColorInputStateOptions,
	UseColorInputStateReturn,
} from '@core/ui/forms/color-input/types/ColorInputTypes';
import type { ColorInputProps } from '@src-types/ui/forms';
import { type InputHTMLAttributes, useId } from 'react';

export interface UseColorInputPropsOptions {
	readonly props: Readonly<ColorInputProps>;
}

export interface UseColorInputPropsReturn {
	readonly state: UseColorInputStateReturn;
	readonly fieldProps: Readonly<ColorInputFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

/**
 * Hook to compute color input state (ID, error state, ARIA attributes, and classes)
 *
 * Generates a unique ID for the color input if not provided, determines error state,
 * builds ARIA described-by attributes, and computes CSS classes based on
 * size and error state.
 *
 * @param options - Configuration options for color input state
 * @returns Computed color input state including ID, error flag, ARIA attributes, and classes
 */
export function useColorInputState({
	colorInputId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseColorInputStateOptions>): UseColorInputStateReturn {
	const generatedId = useId();
	const finalId = generateColorInputId(generatedId, colorInputId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const inputClasses = getColorInputClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, inputClasses };
}

interface BuildColorInputFieldPropsOptions {
	readonly state: UseColorInputStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly value?: string | undefined;
	readonly defaultValue?: string | undefined;
	readonly onChange?: ((color: string) => void) | undefined;
	readonly rest: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'type'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'value'
			| 'defaultValue'
			| 'onChange'
		>
	>;
}

/**
 * Builds field props object for the ColorInputField component
 *
 * Combines computed state with additional props to create the final
 * field props object that will be passed to the ColorInputField component.
 *
 * @param options - Options containing state and field-specific props
 * @returns Complete field props object
 *
 * @internal
 */
function buildColorInputFieldProps(
	options: Readonly<BuildColorInputFieldPropsOptions>
): Readonly<ColorInputFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.inputClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		value: options.value,
		defaultValue: options.defaultValue,
		onChange: options.onChange,
		props: options.rest,
	};
}

/**
 * Hook to process ColorInput component props and return state and field props
 *
 * Extracts and processes ColorInput component props, computes state using
 * useColorInputState, and builds field props. Returns all necessary data
 * for rendering the ColorInput component including label, error, helper text,
 * and layout options.
 *
 * @example
 * ```tsx
 * function MyColorInput() {
 *   const { state, fieldProps, label, error, helperText, required, fullWidth } =
 *     useColorInputProps({
 *       props: {
 *         label: 'Theme Color',
 *         value: '#ff0000',
 *         error: 'Invalid color',
 *       },
 *     });
 *   // Use returned values to render ColorInput component
 * }
 * ```
 *
 * @param options - Options containing ColorInput component props
 * @returns Processed state, field props, and extracted props
 */
export function useColorInputProps({
	props,
}: Readonly<UseColorInputPropsOptions>): UseColorInputPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		colorInputId,
		className,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		...rest
	} = props;
	const state = useColorInputState({
		colorInputId,
		label,
		error,
		helperText,
		size,
		className,
	});
	const fieldProps = buildColorInputFieldProps({
		state,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		rest,
	});
	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

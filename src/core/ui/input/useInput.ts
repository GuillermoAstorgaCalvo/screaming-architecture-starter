import type { InputProps } from '@src-types/ui';
import { type InputHTMLAttributes, type ReactNode, useId } from 'react';

import { generateInputId, getAriaDescribedBy, getInputClasses } from './InputHelpers';
import type { InputFieldProps, UseInputStateOptions, UseInputStateReturn } from './InputParts';

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

interface BuildFieldPropsOptions {
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

function buildFieldProps(options: Readonly<BuildFieldPropsOptions>): Readonly<InputFieldProps> {
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
	const fieldProps = buildFieldProps({ state, disabled, required, leftIcon, rightIcon, rest });
	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

import {
	generateTextareaId,
	getAriaDescribedBy,
	getTextareaClasses,
} from '@core/ui/forms/textarea/helpers/TextareaHelpers';
import type {
	TextareaFieldProps,
	UseTextareaStateOptions,
	UseTextareaStateReturn,
} from '@core/ui/forms/textarea/types/TextareaTypes';
import type { TextareaProps } from '@src-types/ui/forms';
import { type TextareaHTMLAttributes, useId } from 'react';

export interface UseTextareaPropsOptions {
	readonly props: Readonly<TextareaProps>;
}

export interface UseTextareaPropsReturn {
	readonly state: UseTextareaStateReturn;
	readonly fieldProps: Readonly<TextareaFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export function useTextareaState({
	textareaId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseTextareaStateOptions>): UseTextareaStateReturn {
	const generatedId = useId();
	const finalId = generateTextareaId(generatedId, textareaId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const textareaClasses = getTextareaClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, textareaClasses };
}

interface BuildFieldPropsOptions {
	readonly state: UseTextareaStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly rest: Readonly<
		Omit<
			TextareaHTMLAttributes<HTMLTextAreaElement>,
			'size' | 'id' | 'className' | 'disabled' | 'required' | 'aria-invalid' | 'aria-describedby'
		>
	>;
}

function buildFieldProps(options: Readonly<BuildFieldPropsOptions>): Readonly<TextareaFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.textareaClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		props: options.rest,
	};
}

export function useTextareaProps({
	props,
}: Readonly<UseTextareaPropsOptions>): UseTextareaPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		textareaId,
		className,
		disabled,
		required,
		...rest
	} = props;
	const state = useTextareaState({
		textareaId,
		label,
		error,
		helperText,
		size,
		className,
	});
	const fieldProps = buildFieldProps({ state, disabled, required, rest });
	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

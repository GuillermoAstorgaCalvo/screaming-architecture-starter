import {
	generateSelectId,
	getAriaDescribedBy,
	getSelectClasses,
} from '@core/ui/forms/select/helpers/SelectHelpers';
import type {
	SelectFieldProps,
	UseSelectStateOptions,
	UseSelectStateReturn,
} from '@core/ui/forms/select/types/SelectTypes';
import type { SelectProps } from '@src-types/ui/forms';
import { type ReactNode, type SelectHTMLAttributes, useId } from 'react';

export interface UseSelectPropsOptions {
	readonly props: Readonly<SelectProps>;
}

export interface UseSelectPropsReturn {
	readonly state: UseSelectStateReturn;
	readonly fieldProps: Readonly<SelectFieldProps>;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly required?: boolean | undefined;
	readonly fullWidth: boolean;
}

export function useSelectState({
	selectId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseSelectStateOptions>): UseSelectStateReturn {
	const generatedId = useId();
	const finalId = generateSelectId(generatedId, selectId, label);
	const hasError = Boolean(error);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const selectClasses = getSelectClasses({
		size,
		hasError,
		className,
	});
	return { finalId, hasError, ariaDescribedBy, selectClasses };
}

interface BuildFieldPropsOptions {
	readonly state: UseSelectStateReturn;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly children: ReactNode;
	readonly rest: Readonly<
		Omit<
			SelectHTMLAttributes<HTMLSelectElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'children'
		>
	>;
}

function buildFieldProps(options: Readonly<BuildFieldPropsOptions>): Readonly<SelectFieldProps> {
	return {
		id: options.state.finalId,
		className: options.state.selectClasses,
		hasError: options.state.hasError,
		ariaDescribedBy: options.state.ariaDescribedBy,
		disabled: options.disabled,
		required: options.required,
		children: options.children,
		props: options.rest,
	};
}

export function useSelectProps({ props }: Readonly<UseSelectPropsOptions>): UseSelectPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		selectId,
		className,
		disabled,
		required,
		children,
		...rest
	} = props;
	const state = useSelectState({
		selectId,
		label,
		error,
		helperText,
		size,
		className,
	});
	const fieldProps = buildFieldProps({ state, disabled, required, children, rest });
	return { state, fieldProps, label, error, helperText, required, fullWidth };
}

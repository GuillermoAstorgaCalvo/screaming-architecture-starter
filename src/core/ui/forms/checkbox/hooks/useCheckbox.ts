import {
	generateCheckboxId,
	getAriaDescribedBy,
	getCheckboxClasses,
} from '@core/ui/forms/checkbox/helpers/CheckboxHelpers';
import type { CheckboxContentProps } from '@core/ui/forms/checkbox/types/CheckboxTypes';
import type { CheckboxProps } from '@src-types/ui/forms';
import { type InputHTMLAttributes, useId } from 'react';

export interface UseCheckboxPropsOptions {
	readonly props: Readonly<CheckboxProps>;
}

export interface UseCheckboxPropsReturn {
	readonly contentProps: Readonly<CheckboxContentProps>;
}

type CheckboxFieldPropsType = Readonly<
	Omit<
		InputHTMLAttributes<HTMLInputElement>,
		| 'size'
		| 'type'
		| 'id'
		| 'className'
		| 'disabled'
		| 'required'
		| 'aria-describedby'
		| 'checked'
		| 'defaultChecked'
	>
>;

function buildCheckboxFieldProps(
	rest: Omit<
		CheckboxProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'checkboxId'
		| 'className'
		| 'disabled'
		| 'required'
		| 'checked'
		| 'defaultChecked'
	>
): CheckboxFieldPropsType {
	return rest as CheckboxFieldPropsType;
}

interface BuildCheckboxContentPropsOptions {
	props: CheckboxProps;
	finalId: string | undefined;
	checkboxClasses: string;
	ariaDescribedBy: string | undefined;
	fieldProps: CheckboxFieldPropsType;
}

function buildCheckboxContentProps(
	options: BuildCheckboxContentPropsOptions
): CheckboxContentProps {
	const { props, finalId, checkboxClasses, ariaDescribedBy, fieldProps } = options;
	return {
		checkboxId: finalId,
		checkboxClasses,
		ariaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		fieldProps,
	};
}

export function useCheckboxProps({
	props,
}: Readonly<UseCheckboxPropsOptions>): UseCheckboxPropsReturn {
	const { label, error, helperText, size = 'md', checkboxId, className, ...rest } = props;
	const generatedId = useId();
	const finalId = generateCheckboxId(generatedId, checkboxId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const checkboxClasses = getCheckboxClasses({ size, className });
	const fieldProps = buildCheckboxFieldProps(rest);
	const contentProps = buildCheckboxContentProps({
		props,
		finalId,
		checkboxClasses,
		ariaDescribedBy,
		fieldProps,
	});
	return { contentProps };
}

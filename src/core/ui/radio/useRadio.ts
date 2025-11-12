import type { RadioProps } from '@src-types/ui/forms';
import { type InputHTMLAttributes, useId } from 'react';

import { generateRadioId, getAriaDescribedBy } from './RadioA11yHelpers';
import { getRadioClasses } from './RadioClassHelpers';
import type { RadioContentProps } from './RadioTypes';

export interface UseRadioPropsOptions {
	readonly props: Readonly<RadioProps>;
}

export interface UseRadioPropsReturn {
	readonly contentProps: Readonly<RadioContentProps>;
}

type RadioFieldPropsType = Readonly<
	Omit<
		InputHTMLAttributes<HTMLInputElement>,
		| 'size'
		| 'type'
		| 'id'
		| 'name'
		| 'value'
		| 'className'
		| 'disabled'
		| 'required'
		| 'aria-describedby'
		| 'checked'
		| 'defaultChecked'
	>
>;

function buildRadioFieldProps(
	rest: Omit<
		RadioProps,
		| 'label'
		| 'error'
		| 'helperText'
		| 'size'
		| 'fullWidth'
		| 'radioId'
		| 'className'
		| 'disabled'
		| 'required'
		| 'checked'
		| 'defaultChecked'
		| 'name'
		| 'value'
	>
): RadioFieldPropsType {
	return rest as RadioFieldPropsType;
}

interface BuildRadioContentPropsOptions {
	props: RadioProps;
	finalId: string | undefined;
	radioClasses: string;
	ariaDescribedBy: string | undefined;
	fieldProps: RadioFieldPropsType;
}

function buildRadioContentProps(options: BuildRadioContentPropsOptions): RadioContentProps {
	const { props, finalId, radioClasses, ariaDescribedBy, fieldProps } = options;
	return {
		radioId: finalId,
		name: props.name,
		value: props.value,
		radioClasses,
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

export function useRadioProps({ props }: Readonly<UseRadioPropsOptions>): UseRadioPropsReturn {
	const { label, error, helperText, size = 'md', radioId, className, ...rest } = props;
	const generatedId = useId();
	const finalId = generateRadioId(generatedId, radioId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;
	const radioClasses = getRadioClasses({ size, className });
	const fieldProps = buildRadioFieldProps(rest);
	const contentProps = buildRadioContentProps({
		props,
		finalId,
		radioClasses,
		ariaDescribedBy,
		fieldProps,
	});
	return { contentProps };
}

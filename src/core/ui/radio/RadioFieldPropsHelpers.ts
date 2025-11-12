import type { RadioContentProps, RadioFieldWithLabelProps } from './RadioTypes';

function extractRadioFieldWithLabelProperties(props: Readonly<RadioFieldWithLabelProps>) {
	return {
		radioId: props.radioId,
		name: props.name,
		value: props.value,
		radioClasses: props.radioClasses,
		ariaDescribedBy: props.ariaDescribedBy,
		disabled: props.disabled,
		required: props.required,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		fieldProps: props.fieldProps,
	};
}

export function buildRadioFieldPropsFromLabelProps(props: Readonly<RadioFieldWithLabelProps>) {
	const extracted = extractRadioFieldWithLabelProperties(props);
	return {
		id: extracted.radioId,
		name: extracted.name,
		value: extracted.value,
		className: extracted.radioClasses,
		ariaDescribedBy: extracted.ariaDescribedBy,
		disabled: extracted.disabled,
		required: extracted.required,
		checked: extracted.checked,
		defaultChecked: extracted.defaultChecked,
		props: extracted.fieldProps,
	};
}

function extractRadioContentProperties(props: Readonly<RadioContentProps>) {
	return {
		radioId: props.radioId,
		radioClasses: props.radioClasses,
		name: props.name,
		value: props.value,
		ariaDescribedBy: props.ariaDescribedBy,
		label: props.label,
		required: props.required,
		disabled: props.disabled,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		fieldProps: props.fieldProps,
	};
}

export function buildRadioFieldWithLabelProps(props: Readonly<RadioContentProps>) {
	const extracted = extractRadioContentProperties(props);
	return {
		radioId: extracted.radioId,
		radioClasses: extracted.radioClasses,
		name: extracted.name,
		value: extracted.value,
		ariaDescribedBy: extracted.ariaDescribedBy,
		label: extracted.label,
		required: extracted.required,
		disabled: extracted.disabled,
		checked: extracted.checked,
		defaultChecked: extracted.defaultChecked,
		fieldProps: extracted.fieldProps,
	};
}

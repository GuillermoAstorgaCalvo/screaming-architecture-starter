import type { RadioHandlers } from '@core/ui/forms/radio/helpers/RadioHandlers';
import type { RadioFieldProps } from '@core/ui/forms/radio/types/RadioTypes';
import type { RefObject } from 'react';

function extractRadioFieldProperties(props: Readonly<RadioFieldProps>) {
	return {
		id: props.id,
		name: props.name,
		value: props.value,
		className: props.className,
		disabled: props.disabled,
		required: props.required,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		ariaDescribedBy: props.ariaDescribedBy,
		inputProps: props.props,
	};
}

function buildRadioCoreProps(
	extracted: ReturnType<typeof extractRadioFieldProperties>,
	inputRef: RefObject<HTMLInputElement | null>
) {
	return {
		ref: inputRef,
		type: 'radio' as const,
		id: extracted.id,
		name: extracted.name,
		value: extracted.value,
		className: extracted.className,
		disabled: extracted.disabled,
		required: extracted.required,
		'aria-describedby': extracted.ariaDescribedBy,
		checked: extracted.checked,
		defaultChecked: extracted.defaultChecked,
	};
}

function buildRadioBaseInputProps(
	props: Readonly<RadioFieldProps>,
	inputRef: RefObject<HTMLInputElement | null>
) {
	const extracted = extractRadioFieldProperties(props);
	const coreProps = buildRadioCoreProps(extracted, inputRef);
	return {
		...coreProps,
		...extracted.inputProps,
	};
}

function mergeRadioHandlers(
	baseProps: ReturnType<typeof buildRadioBaseInputProps>,
	handlers: RadioHandlers
) {
	return {
		...baseProps,
		onChange: handlers.onChange,
		onClick: handlers.onClick,
		onInput: handlers.onInput,
	};
}

export function buildRadioInputProps(
	props: Readonly<RadioFieldProps>,
	handlers: RadioHandlers,
	inputRef: RefObject<HTMLInputElement | null>
) {
	const baseProps = buildRadioBaseInputProps(props, inputRef);
	return mergeRadioHandlers(baseProps, handlers);
}

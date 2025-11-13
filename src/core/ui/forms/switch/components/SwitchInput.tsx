import type { SwitchHandlers, SwitchInputProps } from '@core/ui/forms/switch/types/SwitchTypes';
import type { RefCallback } from 'react';

interface SwitchInputComponentProps {
	readonly id: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly isChecked: boolean;
	readonly lockedChecked: boolean | undefined;
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
	readonly inputProps: Readonly<SwitchInputProps>;
	readonly handlers: SwitchHandlers;
	readonly setInputRef: RefCallback<HTMLInputElement>;
}

function getInputCheckedState(
	disabled: boolean | undefined,
	lockedChecked: boolean | undefined,
	checked: boolean | undefined
): boolean | undefined {
	return disabled ? lockedChecked : (checked ?? undefined);
}

function getInputDefaultChecked(
	disabled: boolean | undefined,
	defaultChecked: boolean | undefined
): boolean | undefined {
	return disabled ? undefined : defaultChecked;
}

function getComputedInputValues(props: {
	readonly disabled: boolean | undefined;
	readonly lockedChecked: boolean | undefined;
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
}) {
	return {
		checkedValue: getInputCheckedState(props.disabled, props.lockedChecked, props.checked),
		defaultCheckedValue: getInputDefaultChecked(props.disabled, props.defaultChecked),
	};
}

function getBaseInputProps(props: {
	readonly id: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly isChecked: boolean;
	readonly checkedValue: boolean | undefined;
	readonly defaultCheckedValue: boolean | undefined;
}) {
	return {
		id: props.id,
		className: 'sr-only',
		disabled: props.disabled,
		required: props.required,
		'aria-describedby': props.ariaDescribedBy,
		'aria-checked': props.isChecked,
		checked: props.checkedValue,
		defaultChecked: props.defaultCheckedValue,
		readOnly: props.disabled,
	};
}

function createInputJSX(props: {
	readonly baseProps: ReturnType<typeof getBaseInputProps>;
	readonly inputProps: Readonly<SwitchInputProps>;
	readonly handlers: SwitchHandlers;
	readonly setInputRef: RefCallback<HTMLInputElement>;
}) {
	return (
		<input
			ref={props.setInputRef}
			type="checkbox"
			{...props.baseProps}
			{...props.inputProps}
			onChange={props.handlers.onChange}
			onClick={props.handlers.onClick}
			onMouseDown={props.handlers.onMouseDown}
		/>
	);
}

function computeBaseProps(props: {
	readonly id: string | undefined;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly isChecked: boolean;
	readonly lockedChecked: boolean | undefined;
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
}) {
	const { checkedValue, defaultCheckedValue } = getComputedInputValues({
		disabled: props.disabled,
		lockedChecked: props.lockedChecked,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
	});
	return getBaseInputProps({
		id: props.id,
		ariaDescribedBy: props.ariaDescribedBy,
		required: props.required,
		disabled: props.disabled,
		isChecked: props.isChecked,
		checkedValue,
		defaultCheckedValue,
	});
}

function prepareInputProps(props: Readonly<SwitchInputComponentProps>) {
	const {
		id,
		ariaDescribedBy,
		required,
		disabled,
		isChecked,
		lockedChecked,
		checked,
		defaultChecked,
		inputProps,
		handlers,
		setInputRef,
	} = props;
	const baseProps = computeBaseProps({
		id,
		ariaDescribedBy,
		required,
		disabled,
		isChecked,
		lockedChecked,
		checked,
		defaultChecked,
	});
	return { baseProps, inputProps, handlers, setInputRef };
}

function createInputElement(props: Readonly<SwitchInputComponentProps>) {
	const preparedProps = prepareInputProps(props);
	return createInputJSX(preparedProps);
}

export function SwitchInput(props: Readonly<SwitchInputComponentProps>) {
	return createInputElement(props);
}

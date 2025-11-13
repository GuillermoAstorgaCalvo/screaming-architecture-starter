import type { RefObject } from 'react';

import { buildSwitchHandlers, lockInputCheckedProperty } from './SwitchHandlers';
import type { SwitchFieldProps, SwitchInputProps } from './SwitchTypes';
import { useSwitchFieldState } from './useSwitchFieldState';

interface UseSwitchFieldReturn {
	readonly id: string | undefined;
	readonly switchClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
	readonly required: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly isChecked: boolean;
	readonly lockedChecked: boolean | undefined;
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
	readonly inputProps: Readonly<SwitchInputProps>;
	readonly handlers: ReturnType<typeof buildSwitchHandlers>;
	readonly setInputRef: (element: HTMLInputElement | null) => void;
}

function createSetInputRef(
	disabled: boolean | undefined,
	getLockedChecked: () => boolean,
	inputRef: RefObject<HTMLInputElement | null>
) {
	return (element: HTMLInputElement | null) => {
		if (element && disabled) lockInputCheckedProperty(element, getLockedChecked);
		inputRef.current = element;
	};
}

interface ComputeSwitchCheckedValuesConfig {
	readonly checked: boolean | undefined;
	readonly defaultChecked: boolean | undefined;
	readonly disabled: boolean | undefined;
	readonly getLockedChecked: () => boolean;
}

function computeSwitchCheckedValues(config: Readonly<ComputeSwitchCheckedValuesConfig>) {
	const { checked, defaultChecked, disabled, getLockedChecked } = config;
	const isChecked = checked ?? defaultChecked ?? false;
	const lockedChecked = disabled ? getLockedChecked() : undefined;
	return { isChecked, lockedChecked };
}

interface BuildSwitchFieldReturnConfig {
	readonly props: Readonly<SwitchFieldProps>;
	readonly handlers: ReturnType<typeof buildSwitchHandlers>;
	readonly setInputRef: (element: HTMLInputElement | null) => void;
	readonly isChecked: boolean;
	readonly lockedChecked: boolean | undefined;
}

function buildSwitchFieldReturn(
	config: Readonly<BuildSwitchFieldReturnConfig>
): UseSwitchFieldReturn {
	const { props, handlers, setInputRef, isChecked, lockedChecked } = config;
	return {
		id: props.id,
		switchClasses: props.switchClasses,
		thumbClasses: props.thumbClasses,
		ariaDescribedBy: props.ariaDescribedBy,
		required: props.required,
		disabled: props.disabled,
		isChecked,
		lockedChecked,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		inputProps: props.props,
		handlers,
		setInputRef,
	};
}

export function useSwitchField(props: Readonly<SwitchFieldProps>): UseSwitchFieldReturn {
	const { checked, defaultChecked, disabled, props: inputProps } = props;
	const { inputRef, getLockedChecked } = useSwitchFieldState({ checked, defaultChecked, disabled });
	const handlers = buildSwitchHandlers({ disabled, getLockedChecked, inputProps });
	const setInputRef = createSetInputRef(disabled, getLockedChecked, inputRef);
	const { isChecked, lockedChecked } = computeSwitchCheckedValues({
		checked,
		defaultChecked,
		disabled,
		getLockedChecked,
	});
	return buildSwitchFieldReturn({
		props,
		handlers,
		setInputRef,
		isChecked,
		lockedChecked,
	});
}

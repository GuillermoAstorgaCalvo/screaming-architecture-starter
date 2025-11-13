import type { ChangeEvent, FormEvent, InputHTMLAttributes, MouseEvent, RefObject } from 'react';

export interface RadioHandlers {
	readonly onChange: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined;
	readonly onClick: ((e: MouseEvent<HTMLInputElement>) => void) | undefined;
	readonly onInput: ((e: FormEvent<HTMLInputElement>) => void) | undefined;
}

export interface RadioHandlersConfig {
	readonly disabled: boolean | undefined;
	readonly checked: boolean | undefined;
	readonly previousCheckedRef: RefObject<boolean>;
	readonly inputProps: Readonly<
		Pick<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onClick' | 'onInput'>
	>;
}

function createChangeHandler(
	disabled: boolean | undefined,
	onChange: ((e: ChangeEvent<HTMLInputElement>) => void) | undefined
) {
	if (disabled || !onChange) {
		return undefined;
	}
	return onChange;
}

function createDisabledClickHandler(
	checked: boolean | undefined,
	previousCheckedRef: RefObject<boolean>
) {
	return (e: MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (checked === undefined) {
			e.currentTarget.checked = previousCheckedRef.current;
		}
	};
}

function createDisabledInputHandler(
	checked: boolean | undefined,
	previousCheckedRef: RefObject<boolean>
) {
	return (e: FormEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (checked === undefined) {
			e.currentTarget.checked = previousCheckedRef.current;
		}
	};
}

export function buildRadioHandlers(config: Readonly<RadioHandlersConfig>): RadioHandlers {
	const { disabled, checked, previousCheckedRef, inputProps } = config;
	return {
		onChange: createChangeHandler(disabled, inputProps.onChange),
		onClick: disabled
			? createDisabledClickHandler(checked, previousCheckedRef)
			: inputProps.onClick,
		onInput: disabled
			? createDisabledInputHandler(checked, previousCheckedRef)
			: inputProps.onInput,
	};
}

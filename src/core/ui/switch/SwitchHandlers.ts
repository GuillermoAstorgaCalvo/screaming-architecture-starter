import type { ChangeEvent, MouseEvent } from 'react';

import type { SwitchHandlers, SwitchHandlersConfig } from './SwitchTypes';

export function lockInputCheckedProperty(
	element: HTMLInputElement,
	getLockedValue: () => boolean
): void {
	const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'checked');
	if (descriptor?.set) {
		const originalSet = descriptor.set;
		Object.defineProperty(element, 'checked', {
			set(_value: boolean) {
				const lockedValue = getLockedValue();
				originalSet.call(element, lockedValue);
			},
			get() {
				return getLockedValue();
			},
			configurable: true,
		});
	}
}

export function createDisabledChangeHandler(getLockedChecked: () => boolean) {
	return (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const element = e.currentTarget;
		const lockedChecked = getLockedChecked();
		if (element.checked !== lockedChecked) {
			element.checked = lockedChecked;
		}
	};
}

export function createDisabledMouseHandler(getLockedChecked: () => boolean) {
	return (e: MouseEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const element = e.currentTarget;
		const lockedChecked = getLockedChecked();
		if (element.checked !== lockedChecked) {
			element.checked = lockedChecked;
		}
	};
}

export function createDisabledLabelHandlers() {
	return {
		onMouseDown: (e: MouseEvent<HTMLLabelElement>) => {
			e.preventDefault();
			e.stopPropagation();
		},
		onClick: (e: MouseEvent<HTMLLabelElement>) => {
			e.preventDefault();
			e.stopPropagation();
		},
	};
}

export function buildSwitchHandlers(config: Readonly<SwitchHandlersConfig>): SwitchHandlers {
	const { disabled, getLockedChecked, inputProps } = config;
	if (disabled) {
		return {
			onChange: createDisabledChangeHandler(getLockedChecked),
			onClick: createDisabledMouseHandler(getLockedChecked),
			onMouseDown: createDisabledMouseHandler(getLockedChecked),
			labelProps: createDisabledLabelHandlers(),
		};
	}
	return {
		onChange: inputProps.onChange,
		onClick: inputProps.onClick,
		onMouseDown: inputProps.onMouseDown,
		labelProps: {},
	};
}

import type { KeyboardEvent } from 'react';

import type { MultiSelectFieldProps } from './MultiSelectTypes';

export interface BackspaceKeyParams {
	readonly input: HTMLInputElement | null;
	readonly selectedValues: string[];
	readonly onRemoveChip: (value: string) => void;
}

export function isBackspaceKey(key: string): boolean {
	return key === 'Backspace';
}

export function hasSelectedValues(selectedValues: string[]): boolean {
	return selectedValues.length > 0;
}

export function getInputValue(input: HTMLInputElement | null): string {
	return input?.value ?? '';
}

export function isInputEmpty(inputValue: string): boolean {
	return inputValue === '';
}

export function getLastSelectedValue(selectedValues: string[]): string | undefined {
	return selectedValues.at(-1);
}

export function removeLastChip(
	event: KeyboardEvent<HTMLInputElement>,
	params: BackspaceKeyParams
): void {
	event.preventDefault();
	const lastValue = getLastSelectedValue(params.selectedValues);
	if (lastValue !== undefined) {
		params.onRemoveChip(lastValue);
	}
}

export function shouldHandleBackspace(params: BackspaceKeyParams, inputValue: string): boolean {
	return hasSelectedValues(params.selectedValues) && isInputEmpty(inputValue);
}

export function handleBackspaceKey(
	event: KeyboardEvent<HTMLInputElement>,
	params: BackspaceKeyParams
): boolean {
	if (!isBackspaceKey(event.key) || !hasSelectedValues(params.selectedValues)) {
		return false;
	}

	const inputValue = getInputValue(params.input);

	if (shouldHandleBackspace(params, inputValue)) {
		removeLastChip(event, params);
		return true;
	}

	return false;
}

export interface KeyDownHandlerParams {
	readonly selectedValues: string[];
	readonly onRemoveChip: (value: string) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly props: MultiSelectFieldProps['props'];
}

export function createBackspaceParams(
	event: KeyboardEvent<HTMLInputElement>,
	selectedValues: string[],
	onRemoveChip: (value: string) => void
): BackspaceKeyParams {
	return {
		input: event.currentTarget,
		selectedValues,
		onRemoveChip,
	};
}

export function callKeyDownHandlers(
	event: KeyboardEvent<HTMLInputElement>,
	handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void,
	propsOnKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
): void {
	handleKeyDown(event);
	propsOnKeyDown?.(event);
}

export function createKeyDownHandler(params: KeyDownHandlerParams) {
	return (e: KeyboardEvent<HTMLInputElement>) => {
		const backspaceParams = createBackspaceParams(e, params.selectedValues, params.onRemoveChip);
		if (handleBackspaceKey(e, backspaceParams)) {
			return;
		}
		callKeyDownHandlers(e, params.handleKeyDown, params.props.onKeyDown);
	};
}

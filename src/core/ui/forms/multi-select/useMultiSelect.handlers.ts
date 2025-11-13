import type { ChangeEvent, KeyboardEvent } from 'react';

const BLUR_DELAY_MS = 200;

export interface InputEventHandlersParams {
	readonly inputValue: string;
	readonly setInputValue: (value: string) => void;
	readonly setIsOpen: (open: boolean) => void;
	readonly handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface InputEventHandlers {
	readonly value: string;
	readonly onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly onFocus: () => void;
	readonly onBlur: () => void;
}

export function createInputEventHandlers(params: InputEventHandlersParams): InputEventHandlers {
	return {
		value: params.inputValue,
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			params.setInputValue(e.target.value);
		},
		onKeyDown: params.handleKeyDown,
		onFocus: () => {
			params.setIsOpen(true);
		},
		onBlur: () => {
			// Delay to allow option click to register
			setTimeout(() => {
				params.setIsOpen(false);
			}, BLUR_DELAY_MS);
		},
	};
}

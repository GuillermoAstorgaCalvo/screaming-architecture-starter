import { type KeyboardEvent, type RefObject, useCallback } from 'react';

/**
 * Focus and select text in an input element
 */
export function focusAndSelectInput(input: HTMLInputElement): void {
	input.focus();
	input.select();
}

/**
 * Schedule focus and select operation with a delay
 */
export function scheduleFocusAndSelect(input: HTMLInputElement): void {
	setTimeout(() => {
		focusAndSelectInput(input);
	}, 0);
}

/**
 * Get input element from ref if available
 */
export function getInputFromRef(
	inputRef: RefObject<HTMLInputElement | null>
): HTMLInputElement | null {
	return inputRef.current;
}

/**
 * Create focus handler with useCallback
 */
export function useFocusInput(inputRef: RefObject<HTMLInputElement | null>) {
	return useCallback(() => {
		const input = getInputFromRef(inputRef);
		if (input) {
			scheduleFocusAndSelect(input);
		}
	}, [inputRef]);
}

export interface CreateDisplayHandlersOptions {
	readonly disabled: boolean;
	readonly startEditing: () => void;
	readonly focusInput: () => void;
}

export interface DisplayHandlers {
	readonly handleDisplayClick: () => void;
	readonly handleDisplayKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Create event handlers for display mode
 */
export function createDisplayHandlers(
	options: Readonly<CreateDisplayHandlersOptions>
): DisplayHandlers {
	const { disabled, startEditing, focusInput } = options;

	const handleDisplayClick = () => {
		if (!disabled) {
			startEditing();
			focusInput();
		}
	};

	const handleDisplayKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			startEditing();
			focusInput();
		}
	};

	return {
		handleDisplayClick,
		handleDisplayKeyDown,
	};
}

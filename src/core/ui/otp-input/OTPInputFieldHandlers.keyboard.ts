import type { KeyboardEvent } from 'react';

import type { HandlerDependencies } from './OTPInputFieldHandlers.types';

function createBackspaceHandler(
	updateValue: (valueArray: string[]) => void,
	focusInput: (index: number) => void
) {
	const clearCurrentInput = (index: number, valueArray: string[]): void => {
		valueArray[index] = '';
		updateValue(valueArray);
	};

	const clearPreviousInput = (index: number, valueArray: string[]): void => {
		valueArray[index - 1] = '';
		updateValue(valueArray);
		focusInput(index - 1);
	};

	return (index: number, valueArray: string[]): void => {
		if (valueArray[index]) {
			clearCurrentInput(index, valueArray);
		} else if (index > 0) {
			clearPreviousInput(index, valueArray);
		}
	};
}

function createArrowKeyHandlers(length: number, focusInput: (index: number) => void) {
	const handleArrowLeft = (index: number): void => {
		if (index > 0) {
			focusInput(index - 1);
		}
	};

	const handleArrowRight = (index: number): void => {
		if (index < length - 1) {
			focusInput(index + 1);
		}
	};

	return (index: number, key: string): void => {
		if (key === 'ArrowLeft') {
			handleArrowLeft(index);
		} else if (key === 'ArrowRight') {
			handleArrowRight(index);
		}
	};
}

export function createKeyboardHandlers(deps: HandlerDependencies) {
	const { length, getValueArray, updateValue, focusInput } = deps;

	const handleBackspace = createBackspaceHandler(updateValue, focusInput);
	const handleArrowKeys = createArrowKeyHandlers(length, focusInput);

	const handleDeleteKey = (index: number, valueArray: string[]): void => {
		valueArray[index] = '';
		updateValue(valueArray);
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
		const valueArray = getValueArray();
		switch (e.key) {
			case 'Backspace': {
				e.preventDefault();
				handleBackspace(index, valueArray);
				break;
			}
			case 'ArrowLeft':
			case 'ArrowRight': {
				e.preventDefault();
				handleArrowKeys(index, e.key);
				break;
			}
			case 'Delete': {
				e.preventDefault();
				handleDeleteKey(index, valueArray);
				break;
			}
			case 'ArrowUp':
			case 'ArrowDown': {
				e.preventDefault();
				break;
			}
			default: {
				break;
			}
		}
	};

	return handleKeyDown;
}

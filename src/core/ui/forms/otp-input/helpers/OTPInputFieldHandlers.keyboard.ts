import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import type { KeyboardEvent } from 'react';

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

interface KeyHandlerContext {
	index: number;
	valueArray: string[];
	handleBackspace: (index: number, valueArray: string[]) => void;
	handleArrowKeysFn: (index: number, key: string) => void;
	updateValue: (valueArray: string[]) => void;
	e: KeyboardEvent<HTMLInputElement>;
}

function handleBackspaceKey(ctx: KeyHandlerContext): void {
	ctx.e.preventDefault();
	ctx.handleBackspace(ctx.index, ctx.valueArray);
}

function handleArrowKeys(ctx: KeyHandlerContext & { key: string }): void {
	ctx.e.preventDefault();
	ctx.handleArrowKeysFn(ctx.index, ctx.key);
}

function handleDeleteKey(ctx: KeyHandlerContext): void {
	ctx.e.preventDefault();
	ctx.valueArray[ctx.index] = '';
	ctx.updateValue(ctx.valueArray);
}

function handleVerticalArrows(e: KeyboardEvent<HTMLInputElement>): void {
	e.preventDefault();
}

export function createKeyboardHandlers(deps: HandlerDependencies) {
	const { length, getValueArray, updateValue, focusInput } = deps;

	const handleBackspace = createBackspaceHandler(updateValue, focusInput);
	const handleArrowKeysFn = createArrowKeyHandlers(length, focusInput);

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
		const valueArray = getValueArray();
		const { key } = e;
		const ctx: KeyHandlerContext = {
			index,
			valueArray,
			handleBackspace,
			handleArrowKeysFn,
			updateValue,
			e,
		};

		const keyHandlers: Record<string, () => void> = {
			Backspace: () => handleBackspaceKey(ctx),
			ArrowLeft: () => handleArrowKeys({ ...ctx, key }),
			ArrowRight: () => handleArrowKeys({ ...ctx, key }),
			Delete: () => handleDeleteKey(ctx),
			ArrowUp: () => handleVerticalArrows(e),
			ArrowDown: () => handleVerticalArrows(e),
		};

		const handler = keyHandlers[key];
		if (handler) {
			handler();
		}
	};

	return handleKeyDown;
}

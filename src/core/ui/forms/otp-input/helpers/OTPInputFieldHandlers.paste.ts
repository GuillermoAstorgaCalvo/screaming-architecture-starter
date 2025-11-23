import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import {
	checkAndTriggerComplete,
	extractDigits,
	findFirstEmptyIndex,
} from '@core/ui/forms/otp-input/helpers/OTPInputHelpers';
import type { ClipboardEvent } from 'react';

interface FillPastedDigitsOptions {
	readonly digits: string;
	readonly valueArray: string[];
	readonly startIndex: number;
	readonly length: number;
}

function fillPastedDigits(options: FillPastedDigitsOptions): void {
	const { digits, valueArray, startIndex, length } = options;
	let digitIndex = 0;
	for (let i = startIndex; i < length && digitIndex < digits.length; i++) {
		if (!valueArray[i]) {
			valueArray[i] = digits[digitIndex] ?? '';
			digitIndex++;
		}
	}
}

interface FindLastFilledIndexOptions {
	readonly valueArray: string[];
	readonly startIndex: number;
	readonly length: number;
	readonly digitsLength: number;
}

function findLastFilledIndex(options: FindLastFilledIndexOptions): number {
	const { valueArray, startIndex, length, digitsLength } = options;
	let lastFilledIndex = startIndex;
	for (let i = startIndex; i < length && i < startIndex + digitsLength; i++) {
		if (valueArray[i]) {
			lastFilledIndex = i;
		}
	}
	return lastFilledIndex;
}

interface ProcessPastedDigitsOptions {
	readonly digits: string;
	readonly valueArray: string[];
	readonly length: number;
	readonly onComplete: ((value: string) => void) | undefined;
	readonly updateValue: (valueArray: string[]) => void;
	readonly focusInput: (index: number) => void;
}

function processPastedDigits(options: ProcessPastedDigitsOptions): void {
	const { digits, valueArray, length, onComplete, updateValue, focusInput } = options;
	const startIndex = findFirstEmptyIndex(valueArray);
	// Check if all inputs are already filled
	// findFirstEmptyIndex returns 0 when all are filled, so check if valueArray[0] is truthy
	if (startIndex === 0 && valueArray[0] && valueArray.every(Boolean)) {
		return;
	}
	// Fill digits, skipping already filled slots
	fillPastedDigits({ digits, valueArray, startIndex, length });
	updateValue(valueArray);
	// Focus the last filled input, but clamp to last index
	const lastFilledIndex = findLastFilledIndex({
		valueArray,
		startIndex,
		length,
		digitsLength: digits.length,
	});
	focusInput(Math.min(lastFilledIndex, length - 1));
	checkAndTriggerComplete(valueArray, length, onComplete);
}

export function createPasteHandlers(deps: HandlerDependencies) {
	const { length, onComplete, getValueArray, updateValue, focusInput } = deps;

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
		e.preventDefault();
		const digits = extractDigits(e.clipboardData.getData('text'));
		if (digits.length > 0) {
			const valueArray = getValueArray();
			processPastedDigits({
				digits,
				valueArray,
				length,
				onComplete,
				updateValue,
				focusInput,
			});
		}
	};

	return handlePaste;
}

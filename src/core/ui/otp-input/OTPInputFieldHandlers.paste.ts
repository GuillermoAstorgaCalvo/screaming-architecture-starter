import type { ClipboardEvent } from 'react';

import type { HandlerDependencies } from './OTPInputFieldHandlers.types';
import {
	checkAndTriggerComplete,
	extractDigits,
	fillValueArrayFromDigits,
	findFirstEmptyIndex,
} from './OTPInputHelpers';

export function createPasteHandlers(deps: HandlerDependencies) {
	const { length, onComplete, getValueArray, updateValue, focusInput } = deps;

	const processPastedDigits = (digits: string, valueArray: string[]): void => {
		const startIndex = findFirstEmptyIndex(valueArray);
		fillValueArrayFromDigits({ valueArray, digits, startIndex, maxLength: length });
		updateValue(valueArray);
		focusInput(Math.min(startIndex + digits.length, length - 1));
		checkAndTriggerComplete(valueArray, length, onComplete);
	};

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
		e.preventDefault();
		const digits = extractDigits(e.clipboardData.getData('text'));
		if (digits.length > 0) {
			const valueArray = getValueArray();
			processPastedDigits(digits, valueArray);
		}
	};

	return handlePaste;
}

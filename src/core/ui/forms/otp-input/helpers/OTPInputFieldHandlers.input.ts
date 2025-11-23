import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import {
	checkAndTriggerComplete,
	extractDigits,
	fillValueArrayFromDigits,
	isValidOTPCharacter,
} from '@core/ui/forms/otp-input/helpers/OTPInputHelpers';

interface MultipleCharacterHandlerOptions {
	readonly length: number;
	readonly onComplete: ((value: string) => void) | undefined;
	readonly updateValue: (valueArray: string[]) => void;
	readonly focusInput: (index: number) => void;
}

function createMultipleCharacterHandler(options: MultipleCharacterHandlerOptions) {
	const { length, onComplete, updateValue, focusInput } = options;
	return (index: number, digits: string, valueArray: string[]): void => {
		fillValueArrayFromDigits({ valueArray, digits, startIndex: index, maxLength: length });
		updateValue(valueArray);
		checkAndTriggerComplete(valueArray, length, onComplete);
		const nextIndex = Math.min(index + digits.length, length - 1);
		focusInput(nextIndex);
	};
}

interface SingleCharacterHandlerOptions {
	length: number;
	onComplete: ((value: string) => void) | undefined;
	updateValue: (valueArray: string[]) => void;
	focusInput: (index: number) => void;
}

function createSingleCharacterHandler(options: SingleCharacterHandlerOptions) {
	const { length, onComplete, updateValue, focusInput } = options;

	const handleValidDigit = (index: number, digit: string, valueArray: string[]): void => {
		valueArray[index] = digit;
		updateValue(valueArray);
		if (index < length - 1) {
			focusInput(index + 1);
		} else {
			checkAndTriggerComplete(valueArray, length, onComplete);
		}
	};

	const handleEmptyInput = (index: number, valueArray: string[]): void => {
		valueArray[index] = '';
		updateValue(valueArray);
	};

	return (index: number, inputValue: string, valueArray: string[]): void => {
		if (isValidOTPCharacter(inputValue)) {
			handleValidDigit(index, inputValue, valueArray);
		} else if (inputValue === '') {
			handleEmptyInput(index, valueArray);
		}
	};
}

export function createInputHandlers(deps: HandlerDependencies) {
	const { length, onComplete, getValueArray, updateValue, focusInput } = deps;

	const fillMultipleCharacters = createMultipleCharacterHandler({
		length,
		onComplete,
		updateValue,
		focusInput,
	});
	const handleSingleCharacter = createSingleCharacterHandler({
		length,
		onComplete,
		updateValue,
		focusInput,
	});

	const handleMultipleCharacters = (
		index: number,
		inputValue: string,
		valueArray: string[]
	): void => {
		const digits = extractDigits(inputValue);
		if (digits.length > 0) {
			fillMultipleCharacters(index, digits, valueArray);
		}
	};

	const handleInput = (index: number, inputValue: string): void => {
		const valueArray = getValueArray();
		if (inputValue.length > 1) {
			handleMultipleCharacters(index, inputValue, valueArray);
		} else {
			handleSingleCharacter(index, inputValue, valueArray);
		}
	};

	return handleInput;
}

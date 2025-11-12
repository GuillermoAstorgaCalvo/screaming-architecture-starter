import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

export interface GetOTPInputClassesOptions {
	size: StandardSize;
	hasError: boolean;
	className?: string | undefined;
}

export function getOTPInputClasses(options: GetOTPInputClassesOptions): string {
	const baseClasses = INPUT_BASE_CLASSES;
	const sizeClasses = INPUT_SIZE_CLASSES[options.size];
	const stateClasses = options.hasError ? FORM_ERROR_CLASSES : FORM_NORMAL_CLASSES;

	return twMerge(
		baseClasses,
		sizeClasses,
		stateClasses,
		'text-center font-mono tracking-widest',
		options.className
	);
}

export function getAriaDescribedBy(
	inputId: string,
	error?: string,
	helperText?: string
): string | undefined {
	const ids: string[] = [];
	if (error) ids.push(`${inputId}-error`);
	if (helperText) ids.push(`${inputId}-helper`);
	return ids.length > 0 ? ids.join(' ') : undefined;
}

export function generateOTPInputId(
	generatedId: string,
	inputId?: string,
	label?: string
): string | undefined {
	if (inputId) {
		return inputId;
	}
	if (!label) {
		return undefined;
	}
	const cleanId = generatedId.replaceAll(':', '');
	return `otp-input-${cleanId}`;
}

/**
 * Validates that a value contains only digits
 */
export function isValidOTPCharacter(char: string): boolean {
	return /^\d$/.test(char);
}

/**
 * Extracts digits from a string (for paste support)
 */
export function extractDigits(value: string): string {
	return value.replaceAll(/\D/g, '');
}

/**
 * Finds the first empty index in the value array
 */
export function findFirstEmptyIndex(valueArray: string[]): number {
	for (const [index, value] of valueArray.entries()) {
		if (!value) {
			return index;
		}
	}
	return 0;
}

interface FillValueArrayOptions {
	valueArray: string[];
	digits: string;
	startIndex: number;
	maxLength: number;
}

/**
 * Fills the value array with digits starting from the specified index
 */
export function fillValueArrayFromDigits(options: FillValueArrayOptions): void {
	const { valueArray, digits, startIndex, maxLength } = options;
	for (let i = 0; i < digits.length && startIndex + i < maxLength; i++) {
		valueArray[startIndex + i] = digits[i] ?? '';
	}
}

/**
 * Checks if the value array is complete and triggers the onComplete callback
 */
export function checkAndTriggerComplete(
	valueArray: string[],
	length: number,
	onComplete?: (value: string) => void
): void {
	const newValue = valueArray.join('');
	if (newValue.length === length) {
		onComplete?.(newValue);
	}
}

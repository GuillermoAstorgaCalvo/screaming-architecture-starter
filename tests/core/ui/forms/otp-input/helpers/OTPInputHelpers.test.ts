/**
 * OTPInputHelpers Tests
 *
 * Tests for helper functions:
 * - getOTPInputClasses
 * - getAriaDescribedBy
 * - generateOTPInputId
 * - isValidOTPCharacter
 * - extractDigits
 * - findFirstEmptyIndex
 * - fillValueArrayFromDigits
 * - checkAndTriggerComplete
 */

import {
	checkAndTriggerComplete,
	extractDigits,
	fillValueArrayFromDigits,
	findFirstEmptyIndex,
	generateOTPInputId,
	getAriaDescribedBy,
	getOTPInputClasses,
	isValidOTPCharacter,
} from '@core/ui/forms/otp-input/helpers/OTPInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getOTPInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getOTPInputClasses).toBe('function');
	});

	it('should return a string', () => {
		const classes = getOTPInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should include error classes when hasError is true', () => {
		const classesWithError = getOTPInputClasses({
			size: 'md',
			hasError: true,
		});
		const classesWithoutError = getOTPInputClasses({
			size: 'md',
			hasError: false,
		});

		expect(classesWithError).not.toBe(classesWithoutError);
	});

	it('should handle different sizes', () => {
		const smClasses = getOTPInputClasses({
			size: 'sm',
			hasError: false,
		});
		const mdClasses = getOTPInputClasses({
			size: 'md',
			hasError: false,
		});
		const lgClasses = getOTPInputClasses({
			size: 'lg',
			hasError: false,
		});

		expect(smClasses).toBeDefined();
		expect(mdClasses).toBeDefined();
		expect(lgClasses).toBeDefined();
		expect(smClasses).not.toBe(mdClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-otp-class';
		const classes = getOTPInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});

		expect(classes).toContain(customClass);
	});

	it('should include OTP-specific classes', () => {
		const classes = getOTPInputClasses({
			size: 'md',
			hasError: false,
		});

		// Should include text-center, font-mono, tracking-widest
		expect(classes).toContain('text-center');
		expect(classes).toContain('font-mono');
		expect(classes).toContain('tracking-widest');
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('test-id');
		expect(result).toBeUndefined();
	});

	it('should return error ID when error is provided', () => {
		const result = getAriaDescribedBy('test-id', 'Invalid OTP');
		expect(result).toBe('test-id-error');
	});

	it('should return helper text ID when helperText is provided', () => {
		const result = getAriaDescribedBy('test-id', undefined, 'Enter 6 digits');
		expect(result).toBe('test-id-helper');
	});

	it('should return both IDs when error and helperText are provided', () => {
		const result = getAriaDescribedBy('test-id', 'Invalid OTP', 'Enter 6 digits');
		expect(result).toContain('test-id-error');
		expect(result).toContain('test-id-helper');
		expect(result?.split(' ')).toHaveLength(2);
	});

	it('should handle empty string error as no error', () => {
		const result = getAriaDescribedBy('test-id', '');
		expect(result).toBeUndefined();
	});

	it('should handle empty string helperText as no helperText', () => {
		const result = getAriaDescribedBy('test-id', undefined, '');
		expect(result).toBeUndefined();
	});
});

describe('generateOTPInputId', () => {
	it('should be a function', () => {
		expect(typeof generateOTPInputId).toBe('function');
	});

	it('should return provided inputId when available', () => {
		const result = generateOTPInputId('generated-id', 'custom-id');
		expect(result).toBe('custom-id');
	});

	it('should generate ID from label when inputId is not provided', () => {
		const result = generateOTPInputId('generated-id', undefined, 'OTP Code');
		expect(result).toBe('otp-input-generated-id');
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generateOTPInputId('generated-id');
		expect(result).toBeUndefined();
	});

	it('should clean generated ID by removing colons', () => {
		const result = generateOTPInputId('generated:id:with:colons', undefined, 'OTP');
		expect(result).toBe('otp-input-generatedidwithcolons');
	});

	it('should prioritize inputId over label', () => {
		const result = generateOTPInputId('generated-id', 'custom-id', 'OTP Code');
		expect(result).toBe('custom-id');
	});
});

describe('isValidOTPCharacter', () => {
	it('should be a function', () => {
		expect(typeof isValidOTPCharacter).toBe('function');
	});

	it('should return true for single digits', () => {
		for (let i = 0; i <= 9; i++) {
			expect(isValidOTPCharacter(String(i))).toBe(true);
		}
	});

	it('should return false for letters', () => {
		expect(isValidOTPCharacter('a')).toBe(false);
		expect(isValidOTPCharacter('A')).toBe(false);
		expect(isValidOTPCharacter('z')).toBe(false);
	});

	it('should return false for special characters', () => {
		expect(isValidOTPCharacter('!')).toBe(false);
		expect(isValidOTPCharacter('@')).toBe(false);
		expect(isValidOTPCharacter('#')).toBe(false);
		expect(isValidOTPCharacter(' ')).toBe(false);
	});

	it('should return false for multiple digits', () => {
		expect(isValidOTPCharacter('12')).toBe(false);
		expect(isValidOTPCharacter('123')).toBe(false);
	});

	it('should return false for empty string', () => {
		expect(isValidOTPCharacter('')).toBe(false);
	});
});

describe('extractDigits', () => {
	it('should be a function', () => {
		expect(typeof extractDigits).toBe('function');
	});

	it('should extract digits from string with only digits', () => {
		expect(extractDigits('123456')).toBe('123456');
	});

	it('should extract digits from mixed string', () => {
		expect(extractDigits('1a2b3c')).toBe('123');
		expect(extractDigits('abc123def')).toBe('123');
	});

	it('should return empty string when no digits present', () => {
		expect(extractDigits('abc')).toBe('');
		expect(extractDigits('!@#')).toBe('');
	});

	it('should handle empty string', () => {
		expect(extractDigits('')).toBe('');
	});

	it('should handle string with spaces and special characters', () => {
		expect(extractDigits('1 2-3.4')).toBe('1234');
		expect(extractDigits('(123) 456-7890')).toBe('1234567890');
	});

	it('should preserve digit order', () => {
		expect(extractDigits('9a8b7c6d5e4f3g2h1i0j')).toBe('9876543210');
	});
});

describe('findFirstEmptyIndex', () => {
	it('should be a function', () => {
		expect(typeof findFirstEmptyIndex).toBe('function');
	});

	it('should return 0 for empty array', () => {
		const arr: string[] = [];
		expect(findFirstEmptyIndex(arr)).toBe(0);
	});

	it('should return 0 when first element is empty', () => {
		const arr = ['', '1', '2', '3'];
		expect(findFirstEmptyIndex(arr)).toBe(0);
	});

	it('should find first empty index', () => {
		const arr = ['1', '', '3', '4'];
		expect(findFirstEmptyIndex(arr)).toBe(1);
	});

	it('should return 0 when all elements are filled', () => {
		const arr = ['1', '2', '3', '4'];
		expect(findFirstEmptyIndex(arr)).toBe(0);
	});

	it('should handle array with all empty strings', () => {
		const arr = ['', '', '', ''];
		expect(findFirstEmptyIndex(arr)).toBe(0);
	});

	it('should find empty index in middle of array', () => {
		const arr = ['1', '2', '', '4', '5'];
		expect(findFirstEmptyIndex(arr)).toBe(2);
	});
});

describe('fillValueArrayFromDigits', () => {
	it('should be a function', () => {
		expect(typeof fillValueArrayFromDigits).toBe('function');
	});

	it('should fill array with digits starting from startIndex', () => {
		const arr = ['', '', '', '', '', ''];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '123',
			startIndex: 0,
			maxLength: 6,
		});

		expect(arr).toEqual(['1', '2', '3', '', '', '']);
	});

	it('should fill array starting from specified index', () => {
		const arr = ['1', '', '', '', '', ''];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '456',
			startIndex: 1,
			maxLength: 6,
		});

		expect(arr).toEqual(['1', '4', '5', '6', '', '']);
	});

	it('should clamp to maxLength', () => {
		const arr = ['', '', '', '', '', ''];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '123456789',
			startIndex: 0,
			maxLength: 6,
		});

		expect(arr).toEqual(['1', '2', '3', '4', '5', '6']);
	});

	it('should not exceed array bounds', () => {
		const arr = ['1', '2', '', ''];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '3456',
			startIndex: 2,
			maxLength: 4,
		});

		expect(arr).toEqual(['1', '2', '3', '4']);
	});

	it('should handle empty digits string', () => {
		const arr = ['1', '2', '', ''];
		const original = [...arr];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '',
			startIndex: 2,
			maxLength: 4,
		});

		expect(arr).toEqual(original);
	});

	it('should overwrite existing values', () => {
		const arr = ['1', '2', '3', '4', '5', '6'];
		fillValueArrayFromDigits({
			valueArray: arr,
			digits: '789',
			startIndex: 2,
			maxLength: 6,
		});

		expect(arr).toEqual(['1', '2', '7', '8', '9', '6']);
	});
});

describe('checkAndTriggerComplete', () => {
	it('should be a function', () => {
		expect(typeof checkAndTriggerComplete).toBe('function');
	});

	it('should trigger onComplete when array is complete', () => {
		const onComplete = vi.fn();
		const arr = ['1', '2', '3', '4', '5', '6'];

		checkAndTriggerComplete(arr, 6, onComplete);

		expect(onComplete).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should not trigger onComplete when array is incomplete', () => {
		const onComplete = vi.fn();
		const arr = ['1', '2', '3', '', '', ''];

		checkAndTriggerComplete(arr, 6, onComplete);

		expect(onComplete).not.toHaveBeenCalled();
	});

	it('should not trigger onComplete when array exceeds length', () => {
		const onComplete = vi.fn();
		const arr = ['1', '2', '3', '4', '5', '6', '7'];

		checkAndTriggerComplete(arr, 6, onComplete);

		expect(onComplete).not.toHaveBeenCalled();
	});

	it('should work without onComplete callback', () => {
		const arr = ['1', '2', '3', '4', '5', '6'];

		expect(() => checkAndTriggerComplete(arr, 6)).not.toThrow();
	});

	it('should handle different OTP lengths', () => {
		const onComplete = vi.fn();
		const arr4 = ['1', '2', '3', '4'];
		const arr8 = ['1', '2', '3', '4', '5', '6', '7', '8'];

		checkAndTriggerComplete(arr4, 4, onComplete);
		expect(onComplete).toHaveBeenCalledWith('1234');

		onComplete.mockClear();
		checkAndTriggerComplete(arr8, 8, onComplete);
		expect(onComplete).toHaveBeenCalledWith('12345678');
	});

	it('should join array values correctly', () => {
		const onComplete = vi.fn();
		const arr = ['9', '8', '7', '6', '5', '4'];

		checkAndTriggerComplete(arr, 6, onComplete);

		expect(onComplete).toHaveBeenCalledWith('987654');
	});
});

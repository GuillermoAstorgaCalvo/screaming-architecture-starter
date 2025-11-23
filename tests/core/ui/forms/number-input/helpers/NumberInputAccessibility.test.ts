/**
 * NumberInputAccessibility Tests
 *
 * Tests for helper functions:
 * - getAriaDescribedBy
 * - generateNumberInputId
 */

import {
	generateNumberInputId,
	getAriaDescribedBy,
} from '@core/ui/forms/number-input/helpers/NumberInputAccessibility';
import { describe, expect, it } from 'vitest';

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('number-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const inputId = 'number-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const inputId = 'number-input-1';
		const helperText = 'Enter a number';
		const result = getAriaDescribedBy(inputId, undefined, helperText);
		expect(result).toBe(`${inputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const inputId = 'number-input-1';
		const error = 'Invalid number';
		const helperText = 'Enter a number';
		const result = getAriaDescribedBy(inputId, error, helperText);
		expect(result).toBe(`${inputId}-error ${inputId}-helper`);
	});

	it('should handle different inputId values', () => {
		const inputId = 'my-custom-number-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const inputId = 'number-input-1';
		const result = getAriaDescribedBy(inputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const inputId = 'number-input-1';
		const result = getAriaDescribedBy(inputId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const inputId = 'number-input-1';
		const result = getAriaDescribedBy(inputId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generateNumberInputId', () => {
	it('should be a function', () => {
		expect(typeof generateNumberInputId).toBe('function');
	});

	it('should return inputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateNumberInputId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return inputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateNumberInputId('generated:123', customId, 'Quantity Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generateNumberInputId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no inputId and empty label', () => {
		const result = generateNumberInputId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when inputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Quantity Label';
		const result = generateNumberInputId(generatedId, undefined, label);
		expect(result).toBe('number-input-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Quantity Label';
		const result = generateNumberInputId(generatedId, undefined, label);
		expect(result).toBe('number-input-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:quantity:input';
		const label = 'Quantity';
		const result = generateNumberInputId(generatedId, undefined, label);
		expect(result).toBe('number-input-formfieldquantityinput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Quantity Label';
		const result = generateNumberInputId(generatedId, undefined, label);
		expect(result).toBe('number-input-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Quantity Label';
		const result = generateNumberInputId(generatedId, undefined, label);
		expect(result).toBe('number-input-');
	});

	it('should prioritize inputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Quantity Label';
		const result = generateNumberInputId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

/**
 * EmailInputHelpers Tests
 *
 * Tests for helper functions:
 * - getEmailInputClasses
 * - getAriaDescribedBy
 * - generateEmailInputId
 */

import {
	generateEmailInputId,
	getAriaDescribedBy,
	getEmailInputClasses,
} from '@core/ui/forms/email-input/helpers/EmailInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getEmailInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getEmailInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getEmailInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getEmailInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getEmailInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getEmailInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getEmailInputClasses({ size: 'md', hasError: false });
		const lgClasses = getEmailInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getEmailInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getEmailInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-email-input-class';
		const classes = getEmailInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getEmailInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getEmailInputClasses({
			size: 'lg',
			hasError: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('email-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const inputId = 'email-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const inputId = 'email-input-1';
		const helperText = 'Enter your email address';
		const result = getAriaDescribedBy(inputId, undefined, helperText);
		expect(result).toBe(`${inputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const inputId = 'email-input-1';
		const error = 'Invalid email';
		const helperText = 'Enter your email address';
		const result = getAriaDescribedBy(inputId, error, helperText);
		expect(result).toBe(`${inputId}-error ${inputId}-helper`);
	});

	it('should handle different inputId values', () => {
		const inputId = 'my-custom-email-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const inputId = 'email-input-1';
		const result = getAriaDescribedBy(inputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const inputId = 'email-input-1';
		const result = getAriaDescribedBy(inputId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const inputId = 'email-input-1';
		const result = getAriaDescribedBy(inputId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generateEmailInputId', () => {
	it('should be a function', () => {
		expect(typeof generateEmailInputId).toBe('function');
	});

	it('should return inputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateEmailInputId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return inputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateEmailInputId('generated:123', customId, 'Email Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generateEmailInputId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no inputId and empty label', () => {
		const result = generateEmailInputId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when inputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Email Label';
		const result = generateEmailInputId(generatedId, undefined, label);
		expect(result).toBe('email-input-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Email Label';
		const result = generateEmailInputId(generatedId, undefined, label);
		expect(result).toBe('email-input-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:email:input';
		const label = 'Email';
		const result = generateEmailInputId(generatedId, undefined, label);
		expect(result).toBe('email-input-formfieldemailinput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Email Label';
		const result = generateEmailInputId(generatedId, undefined, label);
		expect(result).toBe('email-input-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Email Label';
		const result = generateEmailInputId(generatedId, undefined, label);
		expect(result).toBe('email-input-');
	});

	it('should prioritize inputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Email Label';
		const result = generateEmailInputId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

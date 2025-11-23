/**
 * PasswordInputHelpers Tests
 *
 * Tests for helper functions:
 * - getPasswordInputClasses
 * - getAriaDescribedBy
 * - generatePasswordInputId
 */

import {
	generatePasswordInputId,
	getAriaDescribedBy,
	getPasswordInputClasses,
} from '@core/ui/forms/password-input/helpers/PasswordInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getPasswordInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getPasswordInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getPasswordInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getPasswordInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getPasswordInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getPasswordInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getPasswordInputClasses({ size: 'md', hasError: false });
		const lgClasses = getPasswordInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getPasswordInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getPasswordInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-password-input-class';
		const classes = getPasswordInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getPasswordInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getPasswordInputClasses({
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
		const result = getAriaDescribedBy('password-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const inputId = 'password-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const inputId = 'password-input-1';
		const helperText = 'Must be at least 8 characters';
		const result = getAriaDescribedBy(inputId, undefined, helperText);
		expect(result).toBe(`${inputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const inputId = 'password-input-1';
		const error = 'Invalid password';
		const helperText = 'Must be at least 8 characters';
		const result = getAriaDescribedBy(inputId, error, helperText);
		expect(result).toBe(`${inputId}-error ${inputId}-helper`);
	});

	it('should handle different inputId values', () => {
		const inputId = 'my-custom-password-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(inputId, error);
		expect(result).toBe(`${inputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const inputId = 'password-input-1';
		const result = getAriaDescribedBy(inputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const inputId = 'password-input-1';
		const result = getAriaDescribedBy(inputId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const inputId = 'password-input-1';
		const result = getAriaDescribedBy(inputId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generatePasswordInputId', () => {
	it('should be a function', () => {
		expect(typeof generatePasswordInputId).toBe('function');
	});

	it('should return inputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generatePasswordInputId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return inputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generatePasswordInputId('generated:123', customId, 'Password Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generatePasswordInputId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no inputId and empty label', () => {
		const result = generatePasswordInputId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when inputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Password Label';
		const result = generatePasswordInputId(generatedId, undefined, label);
		expect(result).toBe('password-input-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Password Label';
		const result = generatePasswordInputId(generatedId, undefined, label);
		expect(result).toBe('password-input-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:password:input';
		const label = 'Password';
		const result = generatePasswordInputId(generatedId, undefined, label);
		expect(result).toBe('password-input-formfieldpasswordinput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Password Label';
		const result = generatePasswordInputId(generatedId, undefined, label);
		expect(result).toBe('password-input-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Password Label';
		const result = generatePasswordInputId(generatedId, undefined, label);
		expect(result).toBe('password-input-');
	});

	it('should prioritize inputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Password Label';
		const result = generatePasswordInputId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

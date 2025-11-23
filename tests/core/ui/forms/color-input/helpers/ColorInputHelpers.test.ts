/**
 * ColorInputHelpers Tests
 *
 * Tests for helper functions:
 * - getColorInputClasses
 * - getAriaDescribedBy
 * - generateColorInputId
 */

import {
	generateColorInputId,
	getAriaDescribedBy,
	getColorInputClasses,
} from '@core/ui/forms/color-input/helpers/ColorInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getColorInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getColorInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getColorInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getColorInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getColorInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getColorInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getColorInputClasses({ size: 'md', hasError: false });
		const lgClasses = getColorInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getColorInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getColorInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-color-input-class';
		const classes = getColorInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getColorInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getColorInputClasses({
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
		const result = getAriaDescribedBy('color-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const colorInputId = 'color-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(colorInputId, error);
		expect(result).toBe(`${colorInputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const colorInputId = 'color-input-1';
		const helperText = 'Choose a color';
		const result = getAriaDescribedBy(colorInputId, undefined, helperText);
		expect(result).toBe(`${colorInputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const colorInputId = 'color-input-1';
		const error = 'Invalid color';
		const helperText = 'Choose a color';
		const result = getAriaDescribedBy(colorInputId, error, helperText);
		expect(result).toBe(`${colorInputId}-error ${colorInputId}-helper`);
	});

	it('should handle different colorInputId values', () => {
		const colorInputId = 'my-custom-color-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(colorInputId, error);
		expect(result).toBe(`${colorInputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const colorInputId = 'color-input-1';
		const result = getAriaDescribedBy(colorInputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const colorInputId = 'color-input-1';
		const result = getAriaDescribedBy(colorInputId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const colorInputId = 'color-input-1';
		const result = getAriaDescribedBy(colorInputId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generateColorInputId', () => {
	it('should be a function', () => {
		expect(typeof generateColorInputId).toBe('function');
	});

	it('should return colorInputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateColorInputId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return colorInputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateColorInputId('generated:123', customId, 'Color Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no colorInputId and no label', () => {
		const result = generateColorInputId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no colorInputId and empty label', () => {
		const result = generateColorInputId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when colorInputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Color Label';
		const result = generateColorInputId(generatedId, undefined, label);
		expect(result).toBe('color-input-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Color Label';
		const result = generateColorInputId(generatedId, undefined, label);
		expect(result).toBe('color-input-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:color:input';
		const label = 'Color';
		const result = generateColorInputId(generatedId, undefined, label);
		expect(result).toBe('color-input-formfieldcolorinput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Color Label';
		const result = generateColorInputId(generatedId, undefined, label);
		expect(result).toBe('color-input-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Color Label';
		const result = generateColorInputId(generatedId, undefined, label);
		expect(result).toBe('color-input-');
	});

	it('should prioritize colorInputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Color Label';
		const result = generateColorInputId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

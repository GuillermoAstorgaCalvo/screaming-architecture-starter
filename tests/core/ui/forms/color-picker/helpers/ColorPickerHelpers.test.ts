/**
 * ColorPickerHelpers Tests
 *
 * Tests for helper functions:
 * - getColorPickerClasses
 * - getAriaDescribedBy
 * - generateColorPickerId
 */

import {
	generateColorPickerId,
	getAriaDescribedBy,
	getColorPickerClasses,
} from '@core/ui/forms/color-picker/helpers/ColorPickerHelpers';
import { describe, expect, it } from 'vitest';

describe('getColorPickerClasses', () => {
	it('should be a function', () => {
		expect(typeof getColorPickerClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getColorPickerClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getColorPickerClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getColorPickerClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getColorPickerClasses({ size: 'sm', hasError: false });
		const mdClasses = getColorPickerClasses({ size: 'md', hasError: false });
		const lgClasses = getColorPickerClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getColorPickerClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getColorPickerClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should include cursor-pointer class', () => {
		const classes = getColorPickerClasses({
			size: 'md',
			hasError: false,
		});
		expect(classes).toContain('cursor-pointer');
	});

	it('should include h-10 and w-10 classes', () => {
		const classes = getColorPickerClasses({
			size: 'md',
			hasError: false,
		});
		expect(classes).toContain('h-10');
		expect(classes).toContain('w-10');
	});

	it('should merge custom className', () => {
		const customClass = 'custom-color-picker-class';
		const classes = getColorPickerClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getColorPickerClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getColorPickerClasses({
			size: 'lg',
			hasError: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(classes).toContain('cursor-pointer');
		expect(classes).toContain('h-10');
		expect(classes).toContain('w-10');
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('color-picker-1', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const colorPickerId = 'color-picker-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(colorPickerId, error, undefined);
		expect(result).toBe(`${colorPickerId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const colorPickerId = 'color-picker-1';
		const helperText = 'Choose a color';
		const result = getAriaDescribedBy(colorPickerId, undefined, helperText);
		expect(result).toBe(`${colorPickerId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const colorPickerId = 'color-picker-1';
		const error = 'Invalid color';
		const helperText = 'Choose a color';
		const result = getAriaDescribedBy(colorPickerId, error, helperText);
		expect(result).toBe(`${colorPickerId}-error ${colorPickerId}-helper`);
	});

	it('should handle different colorPickerId values', () => {
		const colorPickerId = 'my-custom-color-picker';
		const error = 'Error message';
		const result = getAriaDescribedBy(colorPickerId, error, undefined);
		expect(result).toBe(`${colorPickerId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const colorPickerId = 'color-picker-1';
		const result = getAriaDescribedBy(colorPickerId, '', undefined);
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const colorPickerId = 'color-picker-1';
		const result = getAriaDescribedBy(colorPickerId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const colorPickerId = 'color-picker-1';
		const result = getAriaDescribedBy(colorPickerId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generateColorPickerId', () => {
	it('should be a function', () => {
		expect(typeof generateColorPickerId).toBe('function');
	});

	it('should return colorPickerId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateColorPickerId('generated:123', customId, undefined);
		expect(result).toBe(customId);
	});

	it('should return colorPickerId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateColorPickerId('generated:123', customId, 'Color Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no colorPickerId and no label', () => {
		const result = generateColorPickerId('generated:123', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('should return undefined when no colorPickerId and empty label', () => {
		const result = generateColorPickerId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return generatedId when label is provided and colorPickerId is not', () => {
		const generatedId = 'generated:123';
		const label = 'Color Label';
		const result = generateColorPickerId(generatedId, undefined, label);
		expect(result).toBe(generatedId);
	});

	it('should return generatedId as-is without modification', () => {
		const generatedId = 'generated:123:456';
		const label = 'Color Label';
		const result = generateColorPickerId(generatedId, undefined, label);
		expect(result).toBe(generatedId);
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:color:picker';
		const label = 'Color';
		const result = generateColorPickerId(generatedId, undefined, label);
		expect(result).toBe(generatedId);
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Color Label';
		const result = generateColorPickerId(generatedId, undefined, label);
		expect(result).toBe(generatedId);
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Color Label';
		const result = generateColorPickerId(generatedId, undefined, label);
		expect(result).toBe('');
	});

	it('should prioritize colorPickerId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Color Label';
		const result = generateColorPickerId(generatedId, customId, label);
		expect(result).toBe(customId);
	});

	it('should return undefined when colorPickerId is undefined and label is undefined', () => {
		const generatedId = 'generated:123';
		const result = generateColorPickerId(generatedId, undefined, undefined);
		expect(result).toBeUndefined();
	});
});

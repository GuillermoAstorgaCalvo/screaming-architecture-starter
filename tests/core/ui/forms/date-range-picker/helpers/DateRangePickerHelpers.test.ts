/**
 * DateRangePickerHelpers Tests
 *
 * Tests for helper functions:
 * - getDateRangePickerClasses
 * - getAriaDescribedBy
 * - generateDateRangePickerId
 * - generateStartDatePickerId
 * - generateEndDatePickerId
 */

import {
	generateDateRangePickerId,
	generateEndDatePickerId,
	generateStartDatePickerId,
	getAriaDescribedBy,
	getDateRangePickerClasses,
} from '@core/ui/forms/date-range-picker/helpers/DateRangePickerHelpers';
import { describe, expect, it } from 'vitest';

describe('getDateRangePickerClasses', () => {
	it('should be a function', () => {
		expect(typeof getDateRangePickerClasses).toBe('function');
	});

	it('should return classes for small size', () => {
		const classes = getDateRangePickerClasses({
			size: 'sm',
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size', () => {
		const classes = getDateRangePickerClasses({
			size: 'md',
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size', () => {
		const classes = getDateRangePickerClasses({
			size: 'lg',
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getDateRangePickerClasses({ size: 'sm' });
		const mdClasses = getDateRangePickerClasses({ size: 'md' });
		const lgClasses = getDateRangePickerClasses({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-date-range-picker-class';
		const classes = getDateRangePickerClasses({
			size: 'md',
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getDateRangePickerClasses({
			size: 'md',
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getDateRangePickerClasses({
			size: 'lg',
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
		const result = getAriaDescribedBy('date-range-picker-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(dateRangePickerId, error);
		expect(result).toBe(`${dateRangePickerId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const helperText = 'Select a date range';
		const result = getAriaDescribedBy(dateRangePickerId, undefined, helperText);
		expect(result).toBe(`${dateRangePickerId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const error = 'Invalid date range';
		const helperText = 'Select a date range';
		const result = getAriaDescribedBy(dateRangePickerId, error, helperText);
		expect(result).toBe(`${dateRangePickerId}-error ${dateRangePickerId}-helper`);
	});

	it('should handle different dateRangePickerId values', () => {
		const dateRangePickerId = 'my-custom-date-range-picker';
		const error = 'Error message';
		const result = getAriaDescribedBy(dateRangePickerId, error);
		expect(result).toBe(`${dateRangePickerId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const result = getAriaDescribedBy(dateRangePickerId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const result = getAriaDescribedBy(dateRangePickerId, undefined, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for both empty strings (falsy check)', () => {
		const dateRangePickerId = 'date-range-picker-1';
		const result = getAriaDescribedBy(dateRangePickerId, '', '');
		expect(result).toBeUndefined();
	});
});

describe('generateDateRangePickerId', () => {
	it('should be a function', () => {
		expect(typeof generateDateRangePickerId).toBe('function');
	});

	it('should return dateRangePickerId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateDateRangePickerId('generated:123', customId);
		expect(result).toBe(customId);
	});

	it('should return dateRangePickerId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateDateRangePickerId('generated:123', customId, 'Date Range Label');
		expect(result).toBe(customId);
	});

	it('should return undefined when no dateRangePickerId and no label', () => {
		const result = generateDateRangePickerId('generated:123');
		expect(result).toBeUndefined();
	});

	it('should return undefined when no dateRangePickerId and empty label', () => {
		const result = generateDateRangePickerId('generated:123', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when dateRangePickerId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Date Range Label';
		const result = generateDateRangePickerId(generatedId, undefined, label);
		expect(result).toBe('daterangepicker-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Date Range Label';
		const result = generateDateRangePickerId(generatedId, undefined, label);
		expect(result).toBe('daterangepicker-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:date:range:picker';
		const label = 'Date Range';
		const result = generateDateRangePickerId(generatedId, undefined, label);
		expect(result).toBe('daterangepicker-formfielddaterangepicker');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Date Range Label';
		const result = generateDateRangePickerId(generatedId, undefined, label);
		expect(result).toBe('daterangepicker-generated123');
	});

	it('should handle empty generatedId with label', () => {
		const generatedId = '';
		const label = 'Date Range Label';
		const result = generateDateRangePickerId(generatedId, undefined, label);
		expect(result).toBe('daterangepicker-');
	});

	it('should prioritize dateRangePickerId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Date Range Label';
		const result = generateDateRangePickerId(generatedId, customId, label);
		expect(result).toBe(customId);
	});
});

describe('generateStartDatePickerId', () => {
	it('should be a function', () => {
		expect(typeof generateStartDatePickerId).toBe('function');
	});

	it('should return undefined when baseId is undefined', () => {
		const result = generateStartDatePickerId(undefined);
		expect(result).toBeUndefined();
	});

	it('should append -start to baseId', () => {
		const baseId = 'date-range-picker-1';
		const result = generateStartDatePickerId(baseId);
		expect(result).toBe(`${baseId}-start`);
	});

	it('should handle different baseId values', () => {
		const baseId = 'my-custom-date-range-picker';
		const result = generateStartDatePickerId(baseId);
		expect(result).toBe(`${baseId}-start`);
	});

	it('should handle baseId with special characters', () => {
		const baseId = 'date-range_picker-123';
		const result = generateStartDatePickerId(baseId);
		expect(result).toBe(`${baseId}-start`);
	});
});

describe('generateEndDatePickerId', () => {
	it('should be a function', () => {
		expect(typeof generateEndDatePickerId).toBe('function');
	});

	it('should return undefined when baseId is undefined', () => {
		const result = generateEndDatePickerId(undefined);
		expect(result).toBeUndefined();
	});

	it('should append -end to baseId', () => {
		const baseId = 'date-range-picker-1';
		const result = generateEndDatePickerId(baseId);
		expect(result).toBe(`${baseId}-end`);
	});

	it('should handle different baseId values', () => {
		const baseId = 'my-custom-date-range-picker';
		const result = generateEndDatePickerId(baseId);
		expect(result).toBe(`${baseId}-end`);
	});

	it('should handle baseId with special characters', () => {
		const baseId = 'date-range_picker-123';
		const result = generateEndDatePickerId(baseId);
		expect(result).toBe(`${baseId}-end`);
	});
});

/**
 * TimePickerHelpers Tests
 *
 * Tests for helper functions:
 * - getTimePickerClasses
 * - getAriaDescribedBy
 * - generateTimePickerId
 */

import {
	generateTimePickerId,
	getAriaDescribedBy,
	getTimePickerClasses,
} from '@core/ui/forms/time-picker/helpers/TimePickerHelpers';
import { describe, expect, it } from 'vitest';

describe('getTimePickerClasses', () => {
	it('should be a function', () => {
		expect(typeof getTimePickerClasses).toBe('function');
	});

	it('should return a string', () => {
		const classes = getTimePickerClasses({
			size: 'md',
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should handle different sizes', () => {
		const smClasses = getTimePickerClasses({
			size: 'sm',
		});
		const mdClasses = getTimePickerClasses({
			size: 'md',
		});
		const lgClasses = getTimePickerClasses({
			size: 'lg',
		});

		expect(smClasses).toBeDefined();
		expect(mdClasses).toBeDefined();
		expect(lgClasses).toBeDefined();
		expect(smClasses).not.toBe(mdClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-timepicker-class';
		const classes = getTimePickerClasses({
			size: 'md',
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should handle undefined className', () => {
		const classes = getTimePickerClasses({
			size: 'md',
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error and no helperText', () => {
		const result = getAriaDescribedBy('test-id');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const result = getAriaDescribedBy('test-id', 'Error message');
		expect(result).toBe('test-id-error');
	});

	it('should return helper ID when only helperText is provided', () => {
		const result = getAriaDescribedBy('test-id', undefined, 'Helper text');
		expect(result).toBe('test-id-helper');
	});

	it('should return both IDs when both error and helperText are provided', () => {
		const result = getAriaDescribedBy('test-id', 'Error message', 'Helper text');
		expect(result).toBe('test-id-error test-id-helper');
	});

	it('should handle different timePicker IDs', () => {
		const result = getAriaDescribedBy('custom-timepicker-id', 'Error message');
		expect(result).toBe('custom-timepicker-id-error');
	});

	it('should handle empty string error', () => {
		const result = getAriaDescribedBy('test-id', '');
		expect(result).toBe('test-id-error');
	});

	it('should handle empty string helperText', () => {
		const result = getAriaDescribedBy('test-id', undefined, '');
		expect(result).toBe('test-id-helper');
	});
});

describe('generateTimePickerId', () => {
	it('should be a function', () => {
		expect(typeof generateTimePickerId).toBe('function');
	});

	it('should return provided timePickerId when given', () => {
		const result = generateTimePickerId('generated-id', 'custom-id', 'Label');
		expect(result).toBe('custom-id');
	});

	it('should return undefined when no timePickerId and no label', () => {
		const result = generateTimePickerId('generated-id', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when timePickerId is not provided', () => {
		const result = generateTimePickerId('generated-id', undefined, 'Select Time');
		expect(result).toBe('timepicker-generated-id');
	});

	it('should clean colons from generated ID', () => {
		const generatedId = 'R1:2:3';
		const result = generateTimePickerId(generatedId, undefined, 'Select Time');
		expect(result).toBe('timepicker-R123');
		expect(result).not.toContain(':');
	});

	it('should prioritize timePickerId over label', () => {
		const result = generateTimePickerId('generated-id', 'custom-id', 'Select Time');
		expect(result).toBe('custom-id');
	});

	it('should handle empty string label', () => {
		const result = generateTimePickerId('generated-id', undefined, '');
		expect(result).toBeUndefined();
	});

	it('should handle generated ID with special characters', () => {
		const generatedId = 'R1:2:3:4:5';
		const result = generateTimePickerId(generatedId, undefined, 'Select Time');
		expect(result).toBe('timepicker-R12345');
	});

	it('should handle multiple colons in generated ID', () => {
		const generatedId = 'R1:2:3:4:5:6:7';
		const result = generateTimePickerId(generatedId, undefined, 'Select Time');
		expect(result).toBe('timepicker-R1234567');
	});
});

/**
 * NumberInputClasses Tests
 *
 * Tests for helper function:
 * - getNumberInputClasses
 */

import { getNumberInputClasses } from '@core/ui/forms/number-input/helpers/NumberInputClasses';
import { describe, expect, it } from 'vitest';

describe('getNumberInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getNumberInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getNumberInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getNumberInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getNumberInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getNumberInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getNumberInputClasses({ size: 'md', hasError: false });
		const lgClasses = getNumberInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getNumberInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getNumberInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-number-input-class';
		const classes = getNumberInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getNumberInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should combine all props correctly', () => {
		const customClass = 'my-custom-class';
		const classes = getNumberInputClasses({
			size: 'lg',
			hasError: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

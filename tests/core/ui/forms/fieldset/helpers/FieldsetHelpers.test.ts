/**
 * Tests for FieldsetHelpers
 *
 * Tests fieldset variant functions, class generation, and type safety
 */

import {
	type FieldsetVariants,
	fieldsetVariants,
	getFieldsetVariantClasses,
} from '@core/ui/forms/fieldset/helpers/FieldsetHelpers';
import { describe, expect, it } from 'vitest';

describe('fieldsetVariants', () => {
	it('should be a function', () => {
		expect(typeof fieldsetVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = fieldsetVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = fieldsetVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return same base classes for all sizes', () => {
		const smClasses = fieldsetVariants({ size: 'sm' });
		const mdClasses = fieldsetVariants({ size: 'md' });
		const lgClasses = fieldsetVariants({ size: 'lg' });

		// All sizes should include base classes
		expect(smClasses).toContain('border');
		expect(mdClasses).toContain('border');
		expect(lgClasses).toContain('border');
	});

	it('should include disabled state classes', () => {
		const classes = fieldsetVariants();
		expect(classes).toContain('disabled:opacity-disabled');
		expect(classes).toContain('disabled:cursor-not-allowed');
	});

	it('should include border and rounded classes', () => {
		const classes = fieldsetVariants();
		expect(classes).toContain('border');
		expect(classes).toContain('rounded-md');
		expect(classes).toContain('p-4');
	});
});

describe('getFieldsetVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getFieldsetVariantClasses).toBe('function');
	});

	it('should return classes when called with no arguments', () => {
		const classes = getFieldsetVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge custom className with variant classes', () => {
		const customClass = 'custom-fieldset-class';
		const classes = getFieldsetVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should merge className correctly with size variant', () => {
		const customClass = 'my-custom-class';
		const classes = getFieldsetVariantClasses({ size: 'md', className: customClass });
		expect(classes).toContain(customClass);
		expect(classes).toContain('border');
	});

	it('should handle undefined className', () => {
		const classes = getFieldsetVariantClasses({ size: 'md' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should handle empty className string', () => {
		const classes = getFieldsetVariantClasses({ size: 'md', className: '' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should use default size when not provided', () => {
		const classes = getFieldsetVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different class strings for different props', () => {
		const defaultClasses = getFieldsetVariantClasses({});
		const withCustomClass = getFieldsetVariantClasses({ className: 'custom' });
		expect(defaultClasses).not.toBe(withCustomClass);
	});
});

describe('FieldsetVariants type', () => {
	it('should accept valid size values', () => {
		const validSizes: FieldsetVariants['size'][] = ['sm', 'md', 'lg', undefined];
		for (const size of validSizes) {
			if (size !== undefined) {
				const classes = fieldsetVariants({ size });
				expect(typeof classes).toBe('string');
			}
		}
	});
});

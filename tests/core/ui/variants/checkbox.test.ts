/**
 * Tests for checkbox variants
 *
 * Tests checkbox variant functions, class generation, and type safety
 */

import {
	type CheckboxVariants,
	checkboxVariants,
	getCheckboxVariantClasses,
} from '@core/ui/variants/checkbox';
import { describe, expect, it } from 'vitest';

describe('checkboxVariants', () => {
	it('should be a function', () => {
		expect(typeof checkboxVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = checkboxVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = checkboxVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = checkboxVariants({ size: 'sm' });
		const mdClasses = checkboxVariants({ size: 'md' });
		const lgClasses = checkboxVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getCheckboxVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getCheckboxVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getCheckboxVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-checkbox-class';
		const classes = getCheckboxVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should combine size and className', () => {
		const classes = getCheckboxVariantClasses({
			size: 'lg',
			className: 'custom-class',
		});
		expect(classes).toContain('custom-class');
	});
});

describe('CheckboxVariants type', () => {
	it('should export CheckboxVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: CheckboxVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

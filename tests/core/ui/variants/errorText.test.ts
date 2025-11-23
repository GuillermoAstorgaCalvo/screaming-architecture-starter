/**
 * Tests for errorText variants
 *
 * Tests errorText variant functions, class generation, and type safety
 */

import {
	type ErrorTextVariants,
	errorTextVariants,
	getErrorTextVariantClasses,
} from '@core/ui/variants/errorText';
import { describe, expect, it } from 'vitest';

describe('errorTextVariants', () => {
	it('should be a function', () => {
		expect(typeof errorTextVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = errorTextVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = errorTextVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = errorTextVariants({ size: 'sm' });
		const mdClasses = errorTextVariants({ size: 'md' });
		const lgClasses = errorTextVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getErrorTextVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getErrorTextVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getErrorTextVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-error-text-class';
		const classes = getErrorTextVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('ErrorTextVariants type', () => {
	it('should export ErrorTextVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ErrorTextVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

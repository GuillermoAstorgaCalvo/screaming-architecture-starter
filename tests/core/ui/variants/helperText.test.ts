/**
 * Tests for helperText variants
 *
 * Tests helperText variant functions, class generation, and type safety
 */

import {
	getHelperTextVariantClasses,
	type HelperTextVariants,
	helperTextVariants,
} from '@core/ui/variants/helperText';
import { describe, expect, it } from 'vitest';

describe('helperTextVariants', () => {
	it('should be a function', () => {
		expect(typeof helperTextVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = helperTextVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = helperTextVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = helperTextVariants({ size: 'sm' });
		const mdClasses = helperTextVariants({ size: 'md' });
		const lgClasses = helperTextVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getHelperTextVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getHelperTextVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getHelperTextVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-helper-text-class';
		const classes = getHelperTextVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('HelperTextVariants type', () => {
	it('should export HelperTextVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: HelperTextVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

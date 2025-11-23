/**
 * Tests for heading variants
 *
 * Tests heading variant functions, class generation, and type safety
 */

import {
	getHeadingVariantClasses,
	type HeadingVariants,
	headingVariants,
} from '@core/ui/variants/heading';
import { describe, expect, it } from 'vitest';

describe('headingVariants', () => {
	it('should be a function', () => {
		expect(typeof headingVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = headingVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = headingVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = headingVariants({ size: 'sm' });
		const mdClasses = headingVariants({ size: 'md' });
		const lgClasses = headingVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getHeadingVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getHeadingVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getHeadingVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-heading-class';
		const classes = getHeadingVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('HeadingVariants type', () => {
	it('should export HeadingVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: HeadingVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

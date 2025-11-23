/**
 * Tests for text variants
 *
 * Tests text variant functions, class generation, and type safety
 */

import { getTextVariantClasses, type TextVariants, textVariants } from '@core/ui/variants/text';
import { describe, expect, it } from 'vitest';

describe('textVariants', () => {
	it('should be a function', () => {
		expect(typeof textVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = textVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = textVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = textVariants({ size: 'sm' });
		const mdClasses = textVariants({ size: 'md' });
		const lgClasses = textVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getTextVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getTextVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getTextVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-text-class';
		const classes = getTextVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('TextVariants type', () => {
	it('should export TextVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: TextVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

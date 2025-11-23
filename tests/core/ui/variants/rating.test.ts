/**
 * Tests for rating variants
 *
 * Tests rating variant functions, class generation, and type safety
 */

import {
	getRatingVariantClasses,
	type RatingVariants,
	ratingVariants,
} from '@core/ui/variants/rating';
import { describe, expect, it } from 'vitest';

describe('ratingVariants', () => {
	it('should be a function', () => {
		expect(typeof ratingVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = ratingVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = ratingVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = ratingVariants({ size: 'sm' });
		const mdClasses = ratingVariants({ size: 'md' });
		const lgClasses = ratingVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getRatingVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getRatingVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getRatingVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-rating-class';
		const classes = getRatingVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('RatingVariants type', () => {
	it('should export RatingVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: RatingVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

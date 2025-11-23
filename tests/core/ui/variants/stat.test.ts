/**
 * Tests for stat variants
 *
 * Tests stat card variant functions, class generation, and type safety
 */

import {
	getStatCardIconSizeClasses,
	getStatCardLabelSizeClasses,
	getStatCardTrendSizeClasses,
	getStatCardValueSizeClasses,
	getStatCardVariantClasses,
	type StatCardVariants,
	statCardVariants,
} from '@core/ui/variants/stat';
import { describe, expect, it } from 'vitest';

const SHOULD_BE_A_FUNCTION = 'should be a function';
const SHOULD_RETURN_CLASSES_FOR_ALL_SIZES = 'should return classes for all sizes';
type StatCardSize = 'sm' | 'md' | 'lg';
const STAT_CARD_SIZES: Array<StatCardSize> = ['sm', 'md', 'lg'];

describe('statCardVariants', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof statCardVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = statCardVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		for (const size of STAT_CARD_SIZES) {
			const classes = statCardVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getStatCardVariantClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getStatCardVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getStatCardVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-stat-card-class';
		const classes = getStatCardVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('getStatCardValueSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getStatCardValueSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		for (const size of STAT_CARD_SIZES) {
			const classes = getStatCardValueSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getStatCardLabelSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getStatCardLabelSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		for (const size of STAT_CARD_SIZES) {
			const classes = getStatCardLabelSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getStatCardTrendSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getStatCardTrendSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		for (const size of STAT_CARD_SIZES) {
			const classes = getStatCardTrendSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('getStatCardIconSizeClasses', () => {
	it(SHOULD_BE_A_FUNCTION, () => {
		expect(typeof getStatCardIconSizeClasses).toBe('function');
	});

	it(SHOULD_RETURN_CLASSES_FOR_ALL_SIZES, () => {
		for (const size of STAT_CARD_SIZES) {
			const classes = getStatCardIconSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});
});

describe('StatCardVariants type', () => {
	it('should export StatCardVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: StatCardVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

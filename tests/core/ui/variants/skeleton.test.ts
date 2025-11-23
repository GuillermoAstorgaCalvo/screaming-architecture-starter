/**
 * Tests for skeleton variants
 *
 * Tests skeleton variant functions, class generation, and type safety
 */

import {
	getSkeletonVariantClasses,
	type SkeletonVariants,
	skeletonVariants,
} from '@core/ui/variants/skeleton';
import { describe, expect, it } from 'vitest';

describe('skeletonVariants', () => {
	it('should be a function', () => {
		expect(typeof skeletonVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = skeletonVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'text' | 'circular' | 'rectangular'> = [
			'text',
			'circular',
			'rectangular',
		];

		for (const variant of variants) {
			const classes = skeletonVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const textClasses = skeletonVariants({ variant: 'text' });
		const circularClasses = skeletonVariants({ variant: 'circular' });
		const rectangularClasses = skeletonVariants({ variant: 'rectangular' });

		expect(textClasses).not.toBe(circularClasses);
		expect(textClasses).not.toBe(rectangularClasses);
		expect(circularClasses).not.toBe(rectangularClasses);
	});
});

describe('getSkeletonVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getSkeletonVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getSkeletonVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-skeleton-class';
		const classes = getSkeletonVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('SkeletonVariants type', () => {
	it('should export SkeletonVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: SkeletonVariants = { variant: 'rectangular' };
		expect(_test).toBeDefined();
	});
});

/**
 * Tests for anchor variants
 *
 * Tests anchor variant functions, class generation, and type safety
 */

import {
	type AnchorVariants,
	anchorVariants,
	getAnchorVariantClasses,
} from '@core/ui/variants/anchor';
import { describe, expect, it } from 'vitest';

describe('anchorVariants', () => {
	it('should be a function', () => {
		expect(typeof anchorVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = anchorVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'subtle' | 'muted'> = ['default', 'subtle', 'muted'];

		for (const variant of variants) {
			const classes = anchorVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = anchorVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should combine variant and size correctly', () => {
		const classes = anchorVariants({ variant: 'subtle', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAnchorVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getAnchorVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getAnchorVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-anchor-class';
		const classes = getAnchorVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('AnchorVariants type', () => {
	it('should export AnchorVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: AnchorVariants = { variant: 'default', size: 'md' };
		expect(_test).toBeDefined();
	});
});

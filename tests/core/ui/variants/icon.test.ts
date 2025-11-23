/**
 * Tests for icon variants
 *
 * Tests icon variant functions, class generation, and type safety
 */

import { getIconVariantClasses, type IconVariants, iconVariants } from '@core/ui/variants/icon';
import { describe, expect, it } from 'vitest';

describe('iconVariants', () => {
	it('should be a function', () => {
		expect(typeof iconVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = iconVariants();
		expect(typeof classes).toBe('string');
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = iconVariants({ size });
			expect(typeof classes).toBe('string');
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = iconVariants({ size: 'sm' });
		const mdClasses = iconVariants({ size: 'md' });
		const lgClasses = iconVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getIconVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getIconVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getIconVariantClasses({});
		expect(typeof classes).toBe('string');
	});

	it('should merge className prop', () => {
		const customClass = 'custom-icon-class';
		const classes = getIconVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('IconVariants type', () => {
	it('should export IconVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: IconVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

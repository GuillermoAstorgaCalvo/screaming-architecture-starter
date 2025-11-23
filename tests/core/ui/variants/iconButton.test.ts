/**
 * Tests for iconButton variants
 *
 * Tests iconButton variant functions, class generation, and type safety
 */

import {
	getIconButtonVariantClasses,
	type IconButtonVariants,
	iconButtonVariants,
} from '@core/ui/variants/iconButton';
import { describe, expect, it } from 'vitest';

describe('iconButtonVariants', () => {
	it('should be a function', () => {
		expect(typeof iconButtonVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = iconButtonVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'ghost'> = ['default', 'ghost'];

		for (const variant of variants) {
			const classes = iconButtonVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = iconButtonVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = iconButtonVariants({ variant: 'default' });
		const ghostClasses = iconButtonVariants({ variant: 'ghost' });

		expect(defaultClasses).not.toBe(ghostClasses);
	});

	it('should combine variant and size correctly', () => {
		const classes = iconButtonVariants({ variant: 'ghost', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getIconButtonVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getIconButtonVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getIconButtonVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-icon-button-class';
		const classes = getIconButtonVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('IconButtonVariants type', () => {
	it('should export IconButtonVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: IconButtonVariants = { variant: 'default', size: 'md' };
		expect(_test).toBeDefined();
	});
});

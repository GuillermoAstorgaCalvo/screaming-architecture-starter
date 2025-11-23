/**
 * Tests for toggle variants
 *
 * Tests toggle variant functions, class generation, and type safety
 */

import {
	getToggleVariantClasses,
	type ToggleVariants,
	toggleVariants,
} from '@core/ui/variants/toggle';
import { describe, expect, it } from 'vitest';

describe('toggleVariants', () => {
	it('should be a function', () => {
		expect(typeof toggleVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = toggleVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'outline'> = ['default', 'outline'];

		for (const variant of variants) {
			const classes = toggleVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = toggleVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for pressed and unpressed states', () => {
		const pressedClasses = toggleVariants({ pressed: true });
		const unpressedClasses = toggleVariants({ pressed: false });

		expect(typeof pressedClasses).toBe('string');
		expect(typeof unpressedClasses).toBe('string');
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = toggleVariants({ variant: 'default' });
		const outlineClasses = toggleVariants({ variant: 'outline' });

		expect(defaultClasses).not.toBe(outlineClasses);
	});

	it('should combine variant, size, and pressed state correctly', () => {
		const classes = toggleVariants({ variant: 'outline', size: 'lg', pressed: true });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getToggleVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getToggleVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getToggleVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-toggle-class';
		const classes = getToggleVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('ToggleVariants type', () => {
	it('should export ToggleVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ToggleVariants = { variant: 'default', size: 'md', pressed: false };
		expect(_test).toBeDefined();
	});
});

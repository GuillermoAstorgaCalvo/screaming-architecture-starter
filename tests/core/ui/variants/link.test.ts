/**
 * Tests for link variants
 *
 * Tests link variant functions, class generation, and type safety
 */

import { getLinkVariantClasses, type LinkVariants, linkVariants } from '@core/ui/variants/link';
import { describe, expect, it } from 'vitest';

describe('linkVariants', () => {
	it('should be a function', () => {
		expect(typeof linkVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = linkVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'subtle' | 'muted'> = ['default', 'subtle', 'muted'];

		for (const variant of variants) {
			const classes = linkVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = linkVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = linkVariants({ variant: 'default' });
		const subtleClasses = linkVariants({ variant: 'subtle' });
		const mutedClasses = linkVariants({ variant: 'muted' });

		expect(defaultClasses).not.toBe(subtleClasses);
		expect(defaultClasses).not.toBe(mutedClasses);
		expect(subtleClasses).not.toBe(mutedClasses);
	});

	it('should combine variant and size correctly', () => {
		const classes = linkVariants({ variant: 'subtle', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getLinkVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getLinkVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getLinkVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-link-class';
		const classes = getLinkVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('LinkVariants type', () => {
	it('should export LinkVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: LinkVariants = { variant: 'default', size: 'md' };
		expect(_test).toBeDefined();
	});
});

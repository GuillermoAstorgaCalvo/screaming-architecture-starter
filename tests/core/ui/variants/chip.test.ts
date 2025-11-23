/**
 * Tests for chip variants
 *
 * Tests chip variant functions, class generation, and type safety
 */

import { type ChipVariants, chipVariants, getChipVariantClasses } from '@core/ui/variants/chip';
import { describe, expect, it } from 'vitest';

describe('chipVariants', () => {
	it('should be a function', () => {
		expect(typeof chipVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = chipVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = [
			'default',
			'primary',
			'success',
			'warning',
			'error',
			'info',
		];

		for (const variant of variants) {
			const classes = chipVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = chipVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = chipVariants({ variant: 'default' });
		const primaryClasses = chipVariants({ variant: 'primary' });
		const successClasses = chipVariants({ variant: 'success' });

		expect(defaultClasses).not.toBe(primaryClasses);
		expect(defaultClasses).not.toBe(successClasses);
		expect(primaryClasses).not.toBe(successClasses);
	});

	it('should combine variant and size correctly', () => {
		const classes = chipVariants({ variant: 'primary', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getChipVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getChipVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getChipVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-chip-class';
		const classes = getChipVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('ChipVariants type', () => {
	it('should export ChipVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ChipVariants = { variant: 'default', size: 'md' };
		expect(_test).toBeDefined();
	});
});

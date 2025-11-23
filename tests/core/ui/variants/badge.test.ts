/**
 * Tests for badge variants
 *
 * Tests badge variant functions, class generation, and type safety
 */

import { type BadgeVariants, badgeVariants, getBadgeVariantClasses } from '@core/ui/variants/badge';
import { describe, expect, it } from 'vitest';

describe('badgeVariants', () => {
	it('should be a function', () => {
		expect(typeof badgeVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = badgeVariants();
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
			const classes = badgeVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = badgeVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = badgeVariants({ variant: 'default' });
		const primaryClasses = badgeVariants({ variant: 'primary' });
		const successClasses = badgeVariants({ variant: 'success' });

		expect(defaultClasses).not.toBe(primaryClasses);
		expect(defaultClasses).not.toBe(successClasses);
		expect(primaryClasses).not.toBe(successClasses);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = badgeVariants({ size: 'sm' });
		const mdClasses = badgeVariants({ size: 'md' });
		const lgClasses = badgeVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should combine variant and size correctly', () => {
		const classes = badgeVariants({ variant: 'primary', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getBadgeVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getBadgeVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getBadgeVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-badge-class';
		const classes = getBadgeVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should combine variant, size, and className', () => {
		const classes = getBadgeVariantClasses({
			variant: 'success',
			size: 'lg',
			className: 'custom-class',
		});
		expect(classes).toContain('custom-class');
	});
});

describe('BadgeVariants type', () => {
	it('should export BadgeVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: BadgeVariants = { variant: 'default', size: 'md' };
		expect(_test).toBeDefined();
	});
});

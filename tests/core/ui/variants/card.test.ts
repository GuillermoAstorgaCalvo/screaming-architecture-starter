/**
 * Tests for card variants
 *
 * Tests card variant functions, class generation, and type safety
 */

import { type CardVariants, cardVariants, getCardVariantClasses } from '@core/ui/variants/card';
import { describe, expect, it } from 'vitest';

describe('cardVariants', () => {
	it('should be a function', () => {
		expect(typeof cardVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = cardVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'elevated' | 'outlined' | 'flat'> = ['elevated', 'outlined', 'flat'];

		for (const variant of variants) {
			const classes = cardVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all padding sizes', () => {
		const paddings: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const padding of paddings) {
			const classes = cardVariants({ padding });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const elevatedClasses = cardVariants({ variant: 'elevated' });
		const outlinedClasses = cardVariants({ variant: 'outlined' });
		const flatClasses = cardVariants({ variant: 'flat' });

		expect(elevatedClasses).not.toBe(outlinedClasses);
		expect(elevatedClasses).not.toBe(flatClasses);
		expect(outlinedClasses).not.toBe(flatClasses);
	});

	it('should return different classes for different padding sizes', () => {
		const smClasses = cardVariants({ padding: 'sm' });
		const mdClasses = cardVariants({ padding: 'md' });
		const lgClasses = cardVariants({ padding: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should combine variant and padding correctly', () => {
		const classes = cardVariants({ variant: 'outlined', padding: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getCardVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getCardVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getCardVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-card-class';
		const classes = getCardVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should combine variant, padding, and className', () => {
		const classes = getCardVariantClasses({
			variant: 'flat',
			padding: 'sm',
			className: 'custom-class',
		});
		expect(classes).toContain('custom-class');
	});
});

describe('CardVariants type', () => {
	it('should export CardVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: CardVariants = { variant: 'elevated', padding: 'md' };
		expect(_test).toBeDefined();
	});
});

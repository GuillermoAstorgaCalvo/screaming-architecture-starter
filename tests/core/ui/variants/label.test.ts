/**
 * Tests for label variants
 *
 * Tests label variant functions, class generation, and type safety
 */

import { getLabelVariantClasses, type LabelVariants, labelVariants } from '@core/ui/variants/label';
import { describe, expect, it } from 'vitest';

describe('labelVariants', () => {
	it('should be a function', () => {
		expect(typeof labelVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = labelVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = labelVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = labelVariants({ size: 'sm' });
		const mdClasses = labelVariants({ size: 'md' });
		const lgClasses = labelVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getLabelVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getLabelVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getLabelVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-label-class';
		const classes = getLabelVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('LabelVariants type', () => {
	it('should export LabelVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: LabelVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

/**
 * Tests for radio variants
 *
 * Tests radio variant functions, class generation, and type safety
 */

import { getRadioVariantClasses, type RadioVariants, radioVariants } from '@core/ui/variants/radio';
import { describe, expect, it } from 'vitest';

describe('radioVariants', () => {
	it('should be a function', () => {
		expect(typeof radioVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = radioVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = radioVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = radioVariants({ size: 'sm' });
		const mdClasses = radioVariants({ size: 'md' });
		const lgClasses = radioVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getRadioVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getRadioVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getRadioVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-radio-class';
		const classes = getRadioVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('RadioVariants type', () => {
	it('should export RadioVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: RadioVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

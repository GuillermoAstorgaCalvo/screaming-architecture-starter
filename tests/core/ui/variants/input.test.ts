/**
 * Tests for input variants
 *
 * Tests input variant functions, class generation, and type safety
 */

import { getInputVariantClasses, type InputVariants, inputVariants } from '@core/ui/variants/input';
import { describe, expect, it } from 'vitest';

describe('inputVariants', () => {
	it('should be a function', () => {
		expect(typeof inputVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = inputVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for sm size', () => {
		const classes = inputVariants({ size: 'sm' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for md size (default)', () => {
		const classes = inputVariants({ size: 'md' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for lg size', () => {
		const classes = inputVariants({ size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for normal state (default)', () => {
		const classes = inputVariants({ state: 'normal' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for error state', () => {
		const classes = inputVariants({ state: 'error' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = inputVariants({ size: 'sm' });
		const mdClasses = inputVariants({ size: 'md' });
		const lgClasses = inputVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return different classes for different states', () => {
		const normalClasses = inputVariants({ state: 'normal' });
		const errorClasses = inputVariants({ state: 'error' });

		expect(normalClasses).not.toBe(errorClasses);
	});

	it('should combine size and state correctly', () => {
		const classes = inputVariants({ size: 'lg', state: 'error' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getInputVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getInputVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getInputVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-input-class';
		const classes = getInputVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should include pl-10 class when hasLeftIcon is true', () => {
		const classes = getInputVariantClasses({ hasLeftIcon: true });
		expect(classes).toContain('pl-10');
	});

	it('should not include pl-10 class when hasLeftIcon is false', () => {
		const classes = getInputVariantClasses({ hasLeftIcon: false });
		expect(classes).not.toContain('pl-10');
	});

	it('should include pr-10 class when hasRightIcon is true', () => {
		const classes = getInputVariantClasses({ hasRightIcon: true });
		expect(classes).toContain('pr-10');
	});

	it('should not include pr-10 class when hasRightIcon is false', () => {
		const classes = getInputVariantClasses({ hasRightIcon: false });
		expect(classes).not.toContain('pr-10');
	});

	it('should combine all props correctly', () => {
		const classes = getInputVariantClasses({
			size: 'lg',
			state: 'error',
			hasLeftIcon: true,
			hasRightIcon: true,
			className: 'custom-class',
		});
		expect(classes).toContain('pl-10');
		expect(classes).toContain('pr-10');
		expect(classes).toContain('custom-class');
	});
});

describe('InputVariants type', () => {
	it('should export InputVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: InputVariants = { size: 'md', state: 'normal' };
		expect(_test).toBeDefined();
	});
});

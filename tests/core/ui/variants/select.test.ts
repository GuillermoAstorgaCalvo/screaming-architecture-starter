/**
 * Tests for select variants
 *
 * Tests select variant functions, class generation, and type safety
 */

import {
	getSelectVariantClasses,
	type SelectVariants,
	selectVariants,
} from '@core/ui/variants/select';
import { describe, expect, it } from 'vitest';

describe('selectVariants', () => {
	it('should be a function', () => {
		expect(typeof selectVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = selectVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = selectVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all states', () => {
		const states: Array<'normal' | 'error'> = ['normal', 'error'];

		for (const state of states) {
			const classes = selectVariants({ state });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different states', () => {
		const normalClasses = selectVariants({ state: 'normal' });
		const errorClasses = selectVariants({ state: 'error' });

		expect(normalClasses).not.toBe(errorClasses);
	});

	it('should combine size and state correctly', () => {
		const classes = selectVariants({ size: 'lg', state: 'error' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getSelectVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getSelectVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getSelectVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-select-class';
		const classes = getSelectVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('SelectVariants type', () => {
	it('should export SelectVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: SelectVariants = { size: 'md', state: 'normal' };
		expect(_test).toBeDefined();
	});
});

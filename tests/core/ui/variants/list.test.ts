/**
 * Tests for list variants
 *
 * Tests list variant functions, class generation, and type safety
 */

import {
	getListItemSizeClasses,
	getListVariantClasses,
	type ListVariants,
	listVariants,
} from '@core/ui/variants/list';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TYPE_STRING = 'string';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('listVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof listVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = listVariants();
		expect(typeof classes).toBe(TYPE_STRING);
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'bordered' | 'divided'> = ['default', 'bordered', 'divided'];

		for (const variant of variants) {
			const classes = listVariants({ variant });
			expect(typeof classes).toBe(TYPE_STRING);
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = listVariants({ variant: 'default' });
		const borderedClasses = listVariants({ variant: 'bordered' });
		const dividedClasses = listVariants({ variant: 'divided' });

		expect(defaultClasses).not.toBe(borderedClasses);
		expect(defaultClasses).not.toBe(dividedClasses);
		expect(borderedClasses).not.toBe(dividedClasses);
	});
});

describe('getListVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getListVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getListVariantClasses({});
		expect(typeof classes).toBe(TYPE_STRING);
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-list-class';
		const classes = getListVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('getListItemSizeClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getListItemSizeClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getListItemSizeClasses(size);
			expect(typeof classes).toBe(TYPE_STRING);
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getListItemSizeClasses('sm');
		const mdClasses = getListItemSizeClasses('md');
		const lgClasses = getListItemSizeClasses('lg');

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('ListVariants type', () => {
	it('should export ListVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ListVariants = { variant: 'default' };
		expect(_test).toBeDefined();
	});
});

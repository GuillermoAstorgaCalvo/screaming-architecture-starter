/**
 * Tests for switch variants
 *
 * Tests switch and switch thumb variant functions, class generation, and type safety
 */

import {
	getSwitchThumbVariantClasses,
	getSwitchVariantClasses,
	type SwitchThumbVariants,
	switchThumbVariants,
	type SwitchVariants,
	switchVariants,
} from '@core/ui/variants/switch';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('switchVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof switchVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = switchVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = switchVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for checked and unchecked states', () => {
		const checkedClasses = switchVariants({ checked: true });
		const uncheckedClasses = switchVariants({ checked: false });

		expect(typeof checkedClasses).toBe('string');
		expect(typeof uncheckedClasses).toBe('string');
		expect(checkedClasses).not.toBe(uncheckedClasses);
	});

	it('should combine size and checked state correctly', () => {
		const classes = switchVariants({ size: 'lg', checked: true });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getSwitchVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getSwitchVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getSwitchVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-switch-class';
		const classes = getSwitchVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('switchThumbVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof switchThumbVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = switchThumbVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = switchThumbVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for checked and unchecked states', () => {
		const checkedClasses = switchThumbVariants({ checked: true });
		const uncheckedClasses = switchThumbVariants({ checked: false });

		expect(typeof checkedClasses).toBe('string');
		expect(typeof uncheckedClasses).toBe('string');
	});
});

describe('getSwitchThumbVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getSwitchThumbVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with required props', () => {
		const classes = getSwitchThumbVariantClasses({ size: 'md', checked: false });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-switch-thumb-class';
		const classes = getSwitchThumbVariantClasses({
			size: 'md',
			checked: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should handle checked state correctly', () => {
		const checkedClasses = getSwitchThumbVariantClasses({ size: 'md', checked: true });
		const uncheckedClasses = getSwitchThumbVariantClasses({ size: 'md', checked: false });

		expect(typeof checkedClasses).toBe('string');
		expect(typeof uncheckedClasses).toBe('string');
	});
});

describe('SwitchVariants and SwitchThumbVariants types', () => {
	it('should export SwitchVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: SwitchVariants = { size: 'md', checked: false };
		expect(_test).toBeDefined();
	});

	it('should export SwitchThumbVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: SwitchThumbVariants = { size: 'md', checked: false };
		expect(_test).toBeDefined();
	});
});

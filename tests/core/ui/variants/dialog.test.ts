/**
 * Tests for dialog variants
 *
 * Tests dialog dialog and body variant functions, class generation, and type safety
 */

import {
	type DialogBodyVariants,
	dialogBodyVariants,
	type DialogDialogVariants,
	dialogDialogVariants,
	getDialogBodyVariantClasses,
	getDialogDialogVariantClasses,
} from '@core/ui/variants/dialog';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('dialogDialogVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof dialogDialogVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = dialogDialogVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'centered' | 'fullscreen'> = [
			'default',
			'centered',
			'fullscreen',
		];

		for (const variant of variants) {
			const classes = dialogDialogVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different variants', () => {
		const defaultClasses = dialogDialogVariants({ variant: 'default' });
		const centeredClasses = dialogDialogVariants({ variant: 'centered' });
		const fullscreenClasses = dialogDialogVariants({ variant: 'fullscreen' });

		expect(defaultClasses).not.toBe(centeredClasses);
		expect(defaultClasses).not.toBe(fullscreenClasses);
		expect(centeredClasses).not.toBe(fullscreenClasses);
	});
});

describe('getDialogDialogVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getDialogDialogVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getDialogDialogVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-dialog-class';
		const classes = getDialogDialogVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('dialogBodyVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof dialogBodyVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = dialogBodyVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full'];

		for (const size of sizes) {
			const classes = dialogBodyVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all variant types', () => {
		const variants: Array<'default' | 'centered' | 'fullscreen'> = [
			'default',
			'centered',
			'fullscreen',
		];

		for (const variant of variants) {
			const classes = dialogBodyVariants({ variant });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = dialogBodyVariants({ size: 'sm' });
		const mdClasses = dialogBodyVariants({ size: 'md' });
		const lgClasses = dialogBodyVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should combine size and variant correctly', () => {
		const classes = dialogBodyVariants({ size: 'lg', variant: 'centered' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getDialogBodyVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getDialogBodyVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getDialogBodyVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-dialog-body-class';
		const classes = getDialogBodyVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('DialogDialogVariants and DialogBodyVariants types', () => {
	it('should export DialogDialogVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: DialogDialogVariants = { variant: 'default' };
		expect(_test).toBeDefined();
	});

	it('should export DialogBodyVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: DialogBodyVariants = { size: 'md', variant: 'default' };
		expect(_test).toBeDefined();
	});
});

/**
 * Tests for modal variants
 *
 * Tests modal dialog and body variant functions, class generation, and type safety
 */

import {
	getModalBodyVariantClasses,
	getModalDialogVariantClasses,
	type ModalBodyVariants,
	modalBodyVariants,
	type ModalDialogVariants,
	modalDialogVariants,
} from '@core/ui/variants/modal';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('modalDialogVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof modalDialogVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = modalDialogVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getModalDialogVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getModalDialogVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getModalDialogVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-modal-dialog-class';
		const classes = getModalDialogVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('modalBodyVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof modalBodyVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = modalBodyVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'full'> = ['sm', 'md', 'lg', 'xl', 'full'];

		for (const size of sizes) {
			const classes = modalBodyVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = modalBodyVariants({ size: 'sm' });
		const mdClasses = modalBodyVariants({ size: 'md' });
		const lgClasses = modalBodyVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getModalBodyVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getModalBodyVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getModalBodyVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-modal-body-class';
		const classes = getModalBodyVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('ModalDialogVariants and ModalBodyVariants types', () => {
	it('should export ModalDialogVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ModalDialogVariants = {};
		expect(_test).toBeDefined();
	});

	it('should export ModalBodyVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ModalBodyVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

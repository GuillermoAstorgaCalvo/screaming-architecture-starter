/**
 * Tests for textarea variants
 *
 * Tests textarea variant functions, class generation, and type safety
 */

import {
	getTextareaVariantClasses,
	type TextareaVariants,
	textareaVariants,
} from '@core/ui/variants/textarea';
import { describe, expect, it } from 'vitest';

describe('textareaVariants', () => {
	it('should be a function', () => {
		expect(typeof textareaVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = textareaVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = textareaVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return classes for all states', () => {
		const states: Array<'normal' | 'error'> = ['normal', 'error'];

		for (const state of states) {
			const classes = textareaVariants({ state });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different states', () => {
		const normalClasses = textareaVariants({ state: 'normal' });
		const errorClasses = textareaVariants({ state: 'error' });

		expect(normalClasses).not.toBe(errorClasses);
	});

	it('should combine size and state correctly', () => {
		const classes = textareaVariants({ size: 'lg', state: 'error' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getTextareaVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getTextareaVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getTextareaVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-textarea-class';
		const classes = getTextareaVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('TextareaVariants type', () => {
	it('should export TextareaVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: TextareaVariants = { size: 'md', state: 'normal' };
		expect(_test).toBeDefined();
	});
});

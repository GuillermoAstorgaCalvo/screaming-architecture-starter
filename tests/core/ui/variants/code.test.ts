/**
 * Tests for code variants
 *
 * Tests code and codeBlock variant functions, class generation, and type safety
 */

import {
	type CodeBlockVariants,
	codeBlockVariants,
	type CodeVariants,
	codeVariants,
	getCodeBlockVariantClasses,
	getCodeVariantClasses,
} from '@core/ui/variants/code';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('codeVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof codeVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = codeVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = codeVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = codeVariants({ size: 'sm' });
		const mdClasses = codeVariants({ size: 'md' });
		const lgClasses = codeVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getCodeVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getCodeVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getCodeVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-code-class';
		const classes = getCodeVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('codeBlockVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof codeBlockVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = codeBlockVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = codeBlockVariants({ size });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = codeBlockVariants({ size: 'sm' });
		const mdClasses = codeBlockVariants({ size: 'md' });
		const lgClasses = codeBlockVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('getCodeBlockVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getCodeBlockVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getCodeBlockVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-codeblock-class';
		const classes = getCodeBlockVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('CodeVariants and CodeBlockVariants types', () => {
	it('should export CodeVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: CodeVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});

	it('should export CodeBlockVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: CodeBlockVariants = { size: 'md' };
		expect(_test).toBeDefined();
	});
});

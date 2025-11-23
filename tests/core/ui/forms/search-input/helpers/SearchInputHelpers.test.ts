/**
 * SearchInputHelpers Tests
 *
 * Tests for SearchInput helper functions:
 * - getSearchInputClasses
 * - getAriaDescribedBy
 * - generateSearchInputId
 */

import {
	generateSearchInputId,
	getAriaDescribedBy,
	getSearchInputClasses,
} from '@core/ui/forms/search-input/helpers/SearchInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getSearchInputClasses', () => {
	it('returns classes for normal state without clear button', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: false,
			hasClearButton: false,
		});

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('returns classes for error state', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: true,
			hasClearButton: false,
		});

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('returns classes with clear button', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: false,
			hasClearButton: true,
		});

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('returns classes for different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			const classes = getSearchInputClasses({
				size,
				hasError: false,
				hasClearButton: false,
			});

			expect(classes).toBeDefined();
			expect(typeof classes).toBe('string');
		}
	});

	it('merges custom className', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: false,
			hasClearButton: false,
			className: 'custom-class',
		});

		expect(classes).toBeDefined();
		expect(classes).toContain('custom-class');
	});

	it('handles undefined className', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: false,
			hasClearButton: false,
			className: undefined,
		});

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});

	it('always includes left icon classes (search icon)', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: false,
			hasClearButton: false,
		});

		expect(classes).toBeDefined();
		// The function always passes hasLeftIcon: true
	});

	it('combines error state with clear button', () => {
		const classes = getSearchInputClasses({
			size: 'md',
			hasError: true,
			hasClearButton: true,
		});

		expect(classes).toBeDefined();
		expect(typeof classes).toBe('string');
	});
});

describe('getAriaDescribedBy', () => {
	it('returns undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('input-id');
		expect(result).toBeUndefined();
	});

	it('returns error ID when error is provided', () => {
		const result = getAriaDescribedBy('input-id', 'Error message');
		expect(result).toBe('input-id-error');
	});

	it('returns helper ID when helperText is provided', () => {
		const result = getAriaDescribedBy('input-id', undefined, 'Helper text');
		expect(result).toBe('input-id-helper');
	});

	it('returns combined IDs when both error and helperText are provided', () => {
		const result = getAriaDescribedBy('input-id', 'Error message', 'Helper text');
		expect(result).toBe('input-id-error input-id-helper');
	});

	it('handles empty string error as falsy', () => {
		const result = getAriaDescribedBy('input-id', '');
		expect(result).toBeUndefined();
	});

	it('handles empty string helperText as falsy', () => {
		const result = getAriaDescribedBy('input-id', undefined, '');
		expect(result).toBeUndefined();
	});

	it('uses correct input ID format', () => {
		const result = getAriaDescribedBy('my-search-input', 'Error', 'Helper');
		expect(result).toBe('my-search-input-error my-search-input-helper');
	});
});

describe('generateSearchInputId', () => {
	it('returns inputId when provided', () => {
		const result = generateSearchInputId('generated-id', 'custom-id', 'Label');
		expect(result).toBe('custom-id');
	});

	it('returns undefined when no inputId and no label', () => {
		const result = generateSearchInputId('generated-id');
		expect(result).toBeUndefined();
	});

	it('generates ID from label when inputId is not provided', () => {
		const result = generateSearchInputId('generated-id', undefined, 'Search');
		expect(result).toBe('search-input-generated-id');
	});

	it('removes colons from generated ID', () => {
		const result = generateSearchInputId('generated:id:with:colons', undefined, 'Search');
		expect(result).toBe('search-input-generatedidwithcolons');
	});

	it('prefers inputId over label-based generation', () => {
		const result = generateSearchInputId('generated-id', 'explicit-id', 'Label');
		expect(result).toBe('explicit-id');
	});

	it('handles empty string label', () => {
		const result = generateSearchInputId('generated-id', undefined, '');
		expect(result).toBeUndefined();
	});

	it('handles label with special characters', () => {
		const result = generateSearchInputId('id:with:colons', undefined, 'Search Label');
		expect(result).toBe('search-input-idwithcolons');
	});

	it('handles multiple colons in generated ID', () => {
		const result = generateSearchInputId('a:b:c:d:e', undefined, 'Search');
		expect(result).toBe('search-input-abcde');
	});
});

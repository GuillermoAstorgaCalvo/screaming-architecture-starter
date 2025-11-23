/**
 * useSearchInputState Tests
 *
 * Tests for the useSearchInputState hook:
 * - ID generation
 * - Error state detection
 * - ARIA attributes
 * - CSS classes computation
 */

import { useSearchInputState } from '@core/ui/forms/search-input/hooks/useSearchInputState';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useSearchInputState - ID Generation', () => {
	it('uses provided inputId', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'custom-id',
				label: 'Search',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.finalId).toBe('custom-id');
	});

	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: undefined,
				label: 'Search',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('search-input-');
	});

	it('returns undefined when no inputId and no label', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: undefined,
				label: undefined,
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('prefers inputId over label-based generation', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'explicit-id',
				label: 'Search',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.finalId).toBe('explicit-id');
	});
});

describe('useSearchInputState - Error State', () => {
	it('detects error when error is provided', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: 'Error message',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('detects no error when error is undefined', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: undefined,
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('detects no error when error is empty string', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: '',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.hasError).toBe(false);
	});
});

describe('useSearchInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: 'Error message',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-id-error');
	});

	it('generates aria-describedby with helper ID', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				helperText: 'Helper text',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-id-helper');
	});

	it('generates aria-describedby with both error and helper IDs', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: 'Error message',
				helperText: 'Helper text',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.ariaDescribedBy).toContain('test-id-helper');
	});

	it('returns undefined aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: undefined,
				label: undefined,
				error: 'Error message',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('useSearchInputState - CSS Classes', () => {
	it('generates classes for normal state', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates classes for error state', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				error: 'Error message',
				size: 'md',
				hasClearButton: false,
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates classes for different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;

		for (const size of sizes) {
			const { result } = renderHook(() =>
				useSearchInputState({
					inputId: 'test-id',
					size,
					hasClearButton: false,
				})
			);

			expect(result.current.inputClasses).toBeDefined();
			expect(typeof result.current.inputClasses).toBe('string');
		}
	});

	it('merges custom className', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				size: 'md',
				hasClearButton: false,
				className: 'custom-class',
			})
		);

		expect(result.current.inputClasses).toContain('custom-class');
	});

	it('generates classes with clear button', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				size: 'md',
				hasClearButton: true,
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('combines all options correctly', () => {
		const { result } = renderHook(() =>
			useSearchInputState({
				inputId: 'test-id',
				label: 'Search',
				error: 'Error message',
				helperText: 'Helper text',
				size: 'lg',
				className: 'custom-class',
				hasClearButton: true,
			})
		);

		expect(result.current.finalId).toBe('test-id');
		expect(result.current.hasError).toBe(true);
		expect(result.current.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.ariaDescribedBy).toContain('test-id-helper');
		expect(result.current.inputClasses).toContain('custom-class');
	});
});

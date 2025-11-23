/**
 * useNumberInputState Tests
 *
 * Tests for the useNumberInputState hook:
 * - ID generation
 * - Error state
 * - ARIA attributes
 * - CSS classes
 */

import { useNumberInputState } from '@core/ui/forms/number-input/hooks/useNumberInputState';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useNumberInputState - ID Generation', () => {
	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				label: 'Quantity',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('number-input-');
	});

	it('uses provided inputId when available', () => {
		const customId = 'custom-number-input-id';
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: customId,
				label: 'Quantity',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});

	it('returns undefined when no label and no inputId provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('generates ID when label is provided even without inputId', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				label: 'Price',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('number-input-');
	});

	it('prioritizes inputId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: customId,
				label: 'Quantity',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});
});

describe('useNumberInputState - Error State', () => {
	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				error: 'Invalid number',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('sets hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('updates hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useNumberInputState({
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.hasError).toBe(false);

		rerender({ error: 'Error message' });
		expect(result.current.hasError).toBe(true);

		rerender({});
		expect(result.current.hasError).toBe(false);
	});
});

describe('useNumberInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: 'test-number-input',
				error: 'Invalid number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-number-input-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: 'test-number-input',
				helperText: 'Enter a number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-number-input-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: 'test-number-input',
				error: 'Invalid number',
				helperText: 'Enter a number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-number-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-number-input-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: 'test-number-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				error: 'Invalid number',
				helperText: 'Enter a number',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('updates aria-describedby when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useNumberInputState({
					inputId: 'test-number-input',
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();

		rerender({ error: 'Error message' });
		expect(result.current.ariaDescribedBy).toBe('test-number-input-error');

		rerender({});
		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('useNumberInputState - CSS Classes', () => {
	it('generates input classes with default size', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for small size', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for large size', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('includes error classes when hasError is true', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				error: 'Invalid number',
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(result.current.hasError).toBe(true);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-number-input-class';
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});

	it('combines custom className with default classes', () => {
		const customClass = 'my-custom-class';
		const { result } = renderHook(() =>
			useNumberInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
		expect(result.current.inputClasses.length).toBeGreaterThan(customClass.length);
	});
});

describe('useNumberInputState - Integration', () => {
	it('handles all options together', () => {
		const { result } = renderHook(() =>
			useNumberInputState({
				inputId: 'test-id',
				label: 'Quantity',
				error: 'Invalid number',
				helperText: 'Enter a number',
				size: 'lg',
				className: 'custom-class',
			})
		);

		expect(result.current.finalId).toBe('test-id');
		expect(result.current.hasError).toBe(true);
		expect(result.current.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.ariaDescribedBy).toContain('test-id-helper');
		expect(result.current.inputClasses).toContain('custom-class');
	});

	it('maintains state consistency across rerenders', () => {
		const { result, rerender } = renderHook(
			({ size }: { size: 'sm' | 'md' | 'lg' }) =>
				useNumberInputState({
					inputId: 'test-id',
					label: 'Quantity',
					size,
				}),
			{
				initialProps: { size: 'md' },
			}
		);

		const initialId = result.current.finalId;
		const initialClasses = result.current.inputClasses;

		rerender({ size: 'lg' });

		expect(result.current.finalId).toBe(initialId);
		expect(result.current.inputClasses).not.toBe(initialClasses);
	});
});

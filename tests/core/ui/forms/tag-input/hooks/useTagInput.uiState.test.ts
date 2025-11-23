/**
 * useTagInputState Tests
 *
 * Tests for the useTagInputState hook:
 * - ID generation
 * - Error state
 * - ARIA attributes
 * - CSS classes
 */

import { useTagInputState } from '@core/ui/forms/tag-input/hooks/useTagInput.uiState';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useTagInputState - ID Generation', () => {
	it('should be a function', () => {
		expect(typeof useTagInputState).toBe('function');
	});

	it('returns inputId when provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'custom-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBe('custom-id');
	});

	it('generates ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: undefined,
				label: 'Tags',
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBeTruthy();
		expect(result.current.finalId).toContain('taginput-');
	});

	it('returns undefined when no inputId and no label', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: undefined,
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('prioritizes inputId over label', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'custom-id',
				label: 'Tags',
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBe('custom-id');
	});
});

describe('useTagInputState - Error State', () => {
	it('returns hasError as true when error is provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: 'Error message',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('returns hasError as false when error is undefined', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('returns hasError as false when error is empty string', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: '',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.hasError).toBe(false);
	});
});

describe('useTagInputState - ARIA Attributes', () => {
	it('returns undefined ariaDescribedBy when no error or helperText', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns error ID when only error is provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: 'Error message',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-input-error');
	});

	it('returns helper ID when only helperText is provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: 'Helper text',
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-input-helper');
	});

	it('returns both IDs when error and helperText are provided', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: 'Error message',
				helperText: 'Helper text',
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-input-error test-input-helper');
	});

	it('returns ariaDescribedBy when error/helperText exist even without inputId or label', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: undefined,
				label: undefined,
				error: 'Error message',
				helperText: 'Helper text',
				size: 'md',
				className: undefined,
			})
		);

		// When error or helperText exists, an ID is generated for ARIA relationships
		expect(result.current.finalId).toBeTruthy();
		expect(result.current.ariaDescribedBy).toBeTruthy();
		expect(result.current.ariaDescribedBy).toContain('-error');
		expect(result.current.ariaDescribedBy).toContain('-helper');
	});
});

describe('useTagInputState - CSS Classes', () => {
	it('returns input classes for different sizes', () => {
		const smResult = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'sm',
				className: undefined,
			})
		);

		const mdResult = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		const lgResult = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'lg',
				className: undefined,
			})
		);

		expect(smResult.result.current.inputClasses).toBeTruthy();
		expect(mdResult.result.current.inputClasses).toBeTruthy();
		expect(lgResult.result.current.inputClasses).toBeTruthy();
		expect(smResult.result.current.inputClasses).not.toBe(mdResult.result.current.inputClasses);
	});

	it('returns different classes for error and normal states', () => {
		const normalResult = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		const errorResult = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: 'Error message',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(normalResult.result.current.inputClasses).not.toBe(
			errorResult.result.current.inputClasses
		);
	});

	it('merges custom className', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: 'custom-class',
			})
		);

		expect(result.current.inputClasses).toContain('custom-class');
	});

	it('works with undefined className', () => {
		const { result } = renderHook(() =>
			useTagInputState({
				inputId: 'test-input',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.inputClasses).toBeTruthy();
		expect(typeof result.current.inputClasses).toBe('string');
	});
});

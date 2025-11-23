/**
 * useOTPInputState Tests
 *
 * Tests for state management hook:
 * - useOTPInputState
 * - ID generation
 * - Error state
 * - ARIA attributes
 * - CSS classes
 */

import { useOTPInputState } from '@core/ui/forms/otp-input/hooks/useOTPInput.state';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useOTPInputState', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputState).toBe('function');
	});

	it('should return finalId, hasError, ariaDescribedBy, and inputClasses', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
			})
		);

		expect(result.current).toHaveProperty('finalId');
		expect(result.current).toHaveProperty('hasError');
		expect(result.current).toHaveProperty('ariaDescribedBy');
		expect(result.current).toHaveProperty('inputClasses');
	});
});

describe('useOTPInputState - ID Generation', () => {
	it('should use provided inputId', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'custom-otp-id',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe('custom-otp-id');
	});

	it('should generate ID from label when inputId is not provided', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				label: 'OTP Code',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('otp-input-');
	});

	it('should return undefined when no inputId and no label', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('should prioritize inputId over label', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'custom-id',
				label: 'OTP Code',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe('custom-id');
	});
});

describe('useOTPInputState - Error State', () => {
	it('should set hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				error: 'Invalid OTP',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('should set hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('should set hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('should update hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useOTPInputState({
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

describe('useOTPInputState - ARIA Attributes', () => {
	it('should generate aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'test-otp-input',
				error: 'Invalid OTP',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-otp-input-error');
	});

	it('should generate aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'test-otp-input',
				helperText: 'Enter 6 digits',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-otp-input-helper');
	});

	it('should generate aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'test-otp-input',
				error: 'Invalid OTP',
				helperText: 'Enter 6 digits',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-otp-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-otp-input-helper');
	});

	it('should return undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'test-otp-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('should return undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				error: 'Invalid OTP',
				helperText: 'Enter 6 digits',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('should update aria-describedby when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useOTPInputState({
					inputId: 'test-otp-input',
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();

		rerender({ error: 'Error message' });
		expect(result.current.ariaDescribedBy).toBe('test-otp-input-error');

		rerender({});
		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('useOTPInputState - CSS Classes', () => {
	it('should generate input classes with default size', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
		expect(result.current.inputClasses.length).toBeGreaterThan(0);
	});

	it('should generate input classes for small size', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('should generate input classes for large size', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('should include error classes when hasError is true', () => {
		const { result: withError } = renderHook(() =>
			useOTPInputState({
				error: 'Invalid OTP',
				size: 'md',
			})
		);
		const { result: withoutError } = renderHook(() =>
			useOTPInputState({
				size: 'md',
			})
		);

		expect(withError.current.inputClasses).not.toBe(withoutError.current.inputClasses);
		expect(withError.current.hasError).toBe(true);
		expect(withoutError.current.hasError).toBe(false);
	});

	it('should apply custom className when provided', () => {
		const customClass = 'custom-otp-class';
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});

	it('should combine custom className with default classes', () => {
		const customClass = 'my-custom-class';
		const { result } = renderHook(() =>
			useOTPInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
		expect(result.current.inputClasses.length).toBeGreaterThan(customClass.length);
	});
});

describe('useOTPInputState - Integration', () => {
	it('should handle all options together', () => {
		const { result } = renderHook(() =>
			useOTPInputState({
				inputId: 'test-id',
				label: 'OTP Code',
				error: 'Invalid OTP',
				helperText: 'Enter 6 digits',
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

	it('should maintain state consistency across rerenders', () => {
		const { result, rerender } = renderHook(
			({ size }: { size: 'sm' | 'md' | 'lg' }) =>
				useOTPInputState({
					inputId: 'test-id',
					label: 'OTP Code',
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

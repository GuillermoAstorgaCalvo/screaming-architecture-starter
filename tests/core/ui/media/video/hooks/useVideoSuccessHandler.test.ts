/**
 * useVideoSuccessHandler Hook Tests
 *
 * Tests for the useVideoSuccessHandler hook including:
 * - Handler creation
 * - State updates
 * - Callback invocation
 */

import { useVideoSuccessHandler } from '@core/ui/media/video/hooks/useVideoSuccessHandler';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useVideoSuccessHandler', () => {
	it('returns a function', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
			})
		);

		expect(typeof result.current).toBe('function');
	});

	it('calls setIsLoading with false', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
			})
		);

		act(() => {
			result.current();
		});

		expect(setIsLoading).toHaveBeenCalledWith(false);
		expect(setIsLoading).toHaveBeenCalledTimes(1);
	});

	it('calls setHasError with false', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
			})
		);

		act(() => {
			result.current();
		});

		expect(setHasError).toHaveBeenCalledWith(false);
		expect(setHasError).toHaveBeenCalledTimes(1);
	});

	it('calls onSuccess callback when provided', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const onSuccess = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
				onSuccess,
			})
		);

		act(() => {
			result.current();
		});

		expect(onSuccess).toHaveBeenCalledTimes(1);
		expect(setIsLoading).toHaveBeenCalledWith(false);
		expect(setHasError).toHaveBeenCalledWith(false);
	});

	it('does not call onSuccess when not provided', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
			})
		);

		act(() => {
			result.current();
		});

		expect(setIsLoading).toHaveBeenCalledWith(false);
		expect(setHasError).toHaveBeenCalledWith(false);
	});

	it('handles multiple calls', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const onSuccess = vi.fn();

		const { result } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
				onSuccess,
			})
		);

		act(() => {
			result.current();
			result.current();
			result.current();
		});

		expect(setIsLoading).toHaveBeenCalledTimes(3);
		expect(setHasError).toHaveBeenCalledTimes(3);
		expect(onSuccess).toHaveBeenCalledTimes(3);
	});

	it('maintains stable reference when dependencies do not change', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const onSuccess = vi.fn();

		const { result, rerender } = renderHook(() =>
			useVideoSuccessHandler({
				setIsLoading,
				setHasError,
				onSuccess,
			})
		);

		const firstHandler = result.current;

		rerender();

		expect(result.current).toBe(firstHandler);
	});

	it('creates new handler when dependencies change', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const onSuccess1 = vi.fn();
		const onSuccess2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onSuccess }) =>
				useVideoSuccessHandler({
					setIsLoading,
					setHasError,
					onSuccess,
				}),
			{
				initialProps: { onSuccess: onSuccess1 },
			}
		);

		const firstHandler = result.current;

		rerender({ onSuccess: onSuccess2 });

		expect(result.current).not.toBe(firstHandler);
	});
});

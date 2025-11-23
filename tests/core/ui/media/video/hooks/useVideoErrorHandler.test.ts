/**
 * useVideoErrorHandler Hook Tests
 *
 * Tests for the useVideoErrorHandler hook including:
 * - Handler creation
 * - Error state updates
 * - Fallback source handling
 * - Error callback invocation
 */

import { useVideoErrorHandler } from '@core/ui/media/video/hooks/useVideoErrorHandler';
import { act, renderHook } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockEvent = (): SyntheticEvent<HTMLVideoElement> => {
	const video = document.createElement('video');
	return {
		currentTarget: video,
		target: video,
		bubbles: false,
		cancelable: false,
		defaultPrevented: false,
		eventPhase: 0,
		isTrusted: false,
		nativeEvent: new Event('error'),
		preventDefault: vi.fn(),
		isDefaultPrevented: vi.fn().mockReturnValue(false),
		stopPropagation: vi.fn(),
		isPropagationStopped: vi.fn().mockReturnValue(false),
		persist: vi.fn(),
		timeStamp: Date.now(),
		type: 'error',
	} as SyntheticEvent<HTMLVideoElement>;
};

describe('useVideoErrorHandler', () => {
	it('returns a function', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		expect(typeof result.current).toBe('function');
	});

	it('sets isLoading to false on error', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(setIsLoading).toHaveBeenCalledWith(false);
	});

	it('sets hasError to true on error', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(setHasError).toHaveBeenCalledWith(true);
	});

	it('switches to fallback source when available and different from current', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				fallbackSrc: '/fallback-video.mp4',
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(setCurrentSrc).toHaveBeenCalledWith('/fallback-video.mp4');
		expect(setIsLoading).toHaveBeenCalledWith(true);
		expect(setHasError).toHaveBeenCalledWith(false);
	});

	it('does not switch to fallback when current src is already fallback', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();
		const onError = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				fallbackSrc: '/fallback-video.mp4',
				currentSrc: '/fallback-video.mp4',
				originalSrc: '/test-video.mp4',
				onError,
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(setCurrentSrc).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalled();
	});

	it('calls onError callback when no fallback or fallback already tried', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();
		const onError = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
				onError,
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error));
		const error = onError.mock.calls[0]?.[0];
		if (error instanceof Error) {
			expect(error.message).toContain('Failed to load video');
			expect(error.message).toContain('/test-video.mp4');
		}
	});

	it('does not call onError when fallback is available and different', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();
		const onError = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				fallbackSrc: '/fallback-video.mp4',
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
				onError,
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(onError).not.toHaveBeenCalled();
	});

	it('handles array fallback source', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const fallbackSrc = [
			{ src: '/fallback-video.webm', type: 'video/webm' },
			{ src: '/fallback-video.mp4', type: 'video/mp4' },
		];

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				fallbackSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(setCurrentSrc).toHaveBeenCalledWith(fallbackSrc);
		expect(setIsLoading).toHaveBeenCalledWith(true);
		expect(setHasError).toHaveBeenCalledWith(false);
	});

	it('handles array original src in error message', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();
		const onError = vi.fn();

		const originalSrc = [
			{ src: '/test-video.webm', type: 'video/webm' },
			{ src: '/test-video.mp4', type: 'video/mp4' },
		];

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: originalSrc,
				originalSrc,
				onError,
			})
		);

		act(() => {
			result.current(createMockEvent());
		});

		expect(onError).toHaveBeenCalledWith(expect.any(Error));
		const error = onError.mock.calls[0]?.[0];
		if (error instanceof Error) {
			expect(error.message).toContain('/test-video.webm');
		}
	});

	it('handles undefined onError gracefully', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
				onError: undefined,
			})
		);

		expect(() => {
			act(() => {
				result.current(createMockEvent());
			});
		}).not.toThrow();
	});

	it('maintains stable reference when dependencies do not change', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result, rerender } = renderHook(() =>
			useVideoErrorHandler({
				setIsLoading,
				setHasError,
				setCurrentSrc,
				currentSrc: '/test-video.mp4',
				originalSrc: '/test-video.mp4',
			})
		);

		const firstHandler = result.current;

		rerender();

		expect(result.current).toBe(firstHandler);
	});

	it('creates new handler when dependencies change', () => {
		const setIsLoading = vi.fn();
		const setHasError = vi.fn();
		const setCurrentSrc = vi.fn();

		const { result, rerender } = renderHook(
			({ currentSrc }) =>
				useVideoErrorHandler({
					setIsLoading,
					setHasError,
					setCurrentSrc,
					currentSrc,
					originalSrc: '/test-video.mp4',
				}),
			{
				initialProps: { currentSrc: '/test-video.mp4' },
			}
		);

		const firstHandler = result.current;

		rerender({ currentSrc: '/new-video.mp4' });

		expect(result.current).not.toBe(firstHandler);
	});
});

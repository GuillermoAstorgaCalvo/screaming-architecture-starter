/**
 * useVideoLifecycle Hook Tests
 *
 * Tests for the useVideoLifecycle hook including:
 * - State management
 * - Event handlers
 * - Integration with other hooks
 */

import { useVideoLifecycle } from '@core/ui/media/video/hooks/useVideoLifecycle';
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

describe('useVideoLifecycle', () => {
	it('returns lifecycle state and handlers', () => {
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
			})
		);

		expect(result.current).toHaveProperty('isLoading');
		expect(result.current).toHaveProperty('hasError');
		expect(result.current).toHaveProperty('src');
		expect(result.current).toHaveProperty('handleCanPlay');
		expect(result.current).toHaveProperty('handleLoadedData');
		expect(result.current).toHaveProperty('handleError');
	});

	it('initializes with loading state', () => {
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
			})
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);
		expect(result.current.src).toBe('/test-video.mp4');
	});

	it('handles string src', () => {
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
			})
		);

		expect(result.current.src).toBe('/test-video.mp4');
	});

	it('handles array src', () => {
		const src = [
			{ src: '/test-video.webm', type: 'video/webm' },
			{ src: '/test-video.mp4', type: 'video/mp4' },
		];
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src,
			})
		);

		expect(result.current.src).toEqual(src);
	});

	it('calls handleCanPlay and updates state', () => {
		const onCanPlay = vi.fn();
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onCanPlay,
			})
		);

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.handleCanPlay();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(false);
		expect(onCanPlay).toHaveBeenCalledTimes(1);
	});

	it('calls handleLoadedData and updates state', () => {
		const onLoadedData = vi.fn();
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onLoadedData,
			})
		);

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.handleLoadedData();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(false);
		expect(onLoadedData).toHaveBeenCalledTimes(1);
	});

	it('calls handleError and updates state', () => {
		const onError = vi.fn();
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onError,
			})
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);

		act(() => {
			result.current.handleError(createMockEvent());
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(true);
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('switches to fallback source on error', () => {
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				fallbackSrc: '/fallback-video.mp4',
			})
		);

		expect(result.current.src).toBe('/test-video.mp4');

		act(() => {
			result.current.handleError(createMockEvent());
		});

		expect(result.current.src).toBe('/fallback-video.mp4');
		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);
	});

	it('handles undefined callbacks gracefully', () => {
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onCanPlay: undefined,
				onLoadedData: undefined,
				onError: undefined,
			})
		);

		expect(() => {
			act(() => {
				result.current.handleCanPlay();
				result.current.handleLoadedData();
				result.current.handleError(createMockEvent());
			});
		}).not.toThrow();
	});

	it('handles fallback with array src', () => {
		const fallbackSrc = [
			{ src: '/fallback-video.webm', type: 'video/webm' },
			{ src: '/fallback-video.mp4', type: 'video/mp4' },
		];

		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				fallbackSrc,
			})
		);

		act(() => {
			result.current.handleError(createMockEvent());
		});

		expect(result.current.src).toEqual(fallbackSrc);
	});

	it('maintains state across multiple lifecycle events', () => {
		const onCanPlay = vi.fn();
		const onLoadedData = vi.fn();
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onCanPlay,
				onLoadedData,
			})
		);

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.handleCanPlay();
		});

		expect(result.current.isLoading).toBe(false);
		expect(onCanPlay).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.handleLoadedData();
		});

		expect(result.current.isLoading).toBe(false);
		expect(onLoadedData).toHaveBeenCalledTimes(1);
	});

	it('handles error after successful load', () => {
		const onError = vi.fn();
		const { result } = renderHook(() =>
			useVideoLifecycle({
				src: '/test-video.mp4',
				onError,
			})
		);

		act(() => {
			result.current.handleCanPlay();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(false);

		act(() => {
			result.current.handleError(createMockEvent());
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(true);
		expect(onError).toHaveBeenCalledTimes(1);
	});

	it('uses initial src value (does not update when prop changes)', () => {
		const { result, rerender } = renderHook(
			({ src }) =>
				useVideoLifecycle({
					src,
				}),
			{
				initialProps: { src: '/test-video.mp4' },
			}
		);

		expect(result.current.src).toBe('/test-video.mp4');

		// Hook uses initial value, doesn't update when prop changes
		// (Video component handles this via key prop for remounting)
		rerender({ src: '/new-video.mp4' });

		expect(result.current.src).toBe('/test-video.mp4');
	});
});

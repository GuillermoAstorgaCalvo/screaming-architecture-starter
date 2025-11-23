/**
 * useVideoState Hook Tests
 *
 * Tests for the useVideoState hook including:
 * - Initial state
 * - State setters
 * - State updates
 */

import { useVideoState } from '@core/ui/media/video/hooks/useVideoState';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useVideoState', () => {
	it('initializes with correct default state for string src', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);
		expect(result.current.currentSrc).toBe('/test-video.mp4');
		expect(typeof result.current.setIsLoading).toBe('function');
		expect(typeof result.current.setHasError).toBe('function');
		expect(typeof result.current.setCurrentSrc).toBe('function');
	});

	it('initializes with correct default state for array src', () => {
		const src = [
			{ src: '/test-video.webm', type: 'video/webm' },
			{ src: '/test-video.mp4', type: 'video/mp4' },
		];
		const { result } = renderHook(() => useVideoState(src));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.hasError).toBe(false);
		expect(result.current.currentSrc).toEqual(src);
	});

	it('updates isLoading state', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.setIsLoading(false);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('updates hasError state', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		expect(result.current.hasError).toBe(false);

		act(() => {
			result.current.setHasError(true);
		});

		expect(result.current.hasError).toBe(true);
	});

	it('updates currentSrc state', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		expect(result.current.currentSrc).toBe('/test-video.mp4');

		act(() => {
			result.current.setCurrentSrc('/new-video.mp4');
		});

		expect(result.current.currentSrc).toBe('/new-video.mp4');
	});

	it('updates currentSrc with array', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		const newSrc = [
			{ src: '/new-video.webm', type: 'video/webm' },
			{ src: '/new-video.mp4', type: 'video/mp4' },
		];

		act(() => {
			result.current.setCurrentSrc(newSrc);
		});

		expect(result.current.currentSrc).toEqual(newSrc);
	});

	it('handles multiple state updates', () => {
		const { result } = renderHook(() => useVideoState('/test-video.mp4'));

		act(() => {
			result.current.setIsLoading(false);
			result.current.setHasError(true);
			result.current.setCurrentSrc('/fallback-video.mp4');
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.hasError).toBe(true);
		expect(result.current.currentSrc).toBe('/fallback-video.mp4');
	});

	it('maintains state independence between instances', () => {
		const { result: result1 } = renderHook(() => useVideoState('/video1.mp4'));
		const { result: result2 } = renderHook(() => useVideoState('/video2.mp4'));

		expect(result1.current.currentSrc).toBe('/video1.mp4');
		expect(result2.current.currentSrc).toBe('/video2.mp4');

		act(() => {
			result1.current.setIsLoading(false);
		});

		expect(result1.current.isLoading).toBe(false);
		expect(result2.current.isLoading).toBe(true);
	});
});

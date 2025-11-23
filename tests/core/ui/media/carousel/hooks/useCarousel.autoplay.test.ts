/**
 * useCarouselAutoPlay Tests
 *
 * Tests for the carousel autoplay hook:
 * - Auto-play setup and cleanup
 * - Interval management
 * - Conditional auto-play
 */

import { useCarouselAutoPlay } from '@core/ui/media/carousel/hooks/useCarousel.autoplay';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useCarouselAutoPlay', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should be a function', () => {
		expect(typeof useCarouselAutoPlay).toBe('function');
	});

	it('does not set up interval when autoPlay is false', () => {
		const goToNext = vi.fn();

		renderHook(() =>
			useCarouselAutoPlay({
				autoPlay: false,
				autoPlayInterval: 1000,
				totalSlides: 3,
				goToNext,
			})
		);

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(goToNext).not.toHaveBeenCalled();
	});

	it('does not set up interval when totalSlides is 1', () => {
		const goToNext = vi.fn();

		renderHook(() =>
			useCarouselAutoPlay({
				autoPlay: true,
				autoPlayInterval: 1000,
				totalSlides: 1,
				goToNext,
			})
		);

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(goToNext).not.toHaveBeenCalled();
	});

	it('calls goToNext at specified interval when autoPlay is enabled', () => {
		const goToNext = vi.fn();

		renderHook(() =>
			useCarouselAutoPlay({
				autoPlay: true,
				autoPlayInterval: 1000,
				totalSlides: 3,
				goToNext,
			})
		);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(goToNext).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(goToNext).toHaveBeenCalledTimes(2);
	});

	it('calls goToNext multiple times over longer period', () => {
		const goToNext = vi.fn();

		renderHook(() =>
			useCarouselAutoPlay({
				autoPlay: true,
				autoPlayInterval: 500,
				totalSlides: 3,
				goToNext,
			})
		);

		act(() => {
			vi.advanceTimersByTime(2500);
		});

		expect(goToNext).toHaveBeenCalledTimes(5);
	});

	it('cleans up interval on unmount', () => {
		const goToNext = vi.fn();

		const { unmount } = renderHook(() =>
			useCarouselAutoPlay({
				autoPlay: true,
				autoPlayInterval: 1000,
				totalSlides: 3,
				goToNext,
			})
		);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(goToNext).not.toHaveBeenCalled();
	});

	it('restarts interval when autoPlay changes from false to true', () => {
		const goToNext = vi.fn();

		const { rerender } = renderHook(
			({ autoPlay }) =>
				useCarouselAutoPlay({
					autoPlay,
					autoPlayInterval: 1000,
					totalSlides: 3,
					goToNext,
				}),
			{
				initialProps: { autoPlay: false },
			}
		);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(goToNext).not.toHaveBeenCalled();

		rerender({ autoPlay: true });

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(goToNext).toHaveBeenCalledTimes(1);
	});

	it('restarts interval when autoPlayInterval changes', () => {
		const goToNext = vi.fn();

		const { rerender } = renderHook(
			({ autoPlayInterval }) =>
				useCarouselAutoPlay({
					autoPlay: true,
					autoPlayInterval,
					totalSlides: 3,
					goToNext,
				}),
			{
				initialProps: { autoPlayInterval: 1000 },
			}
		);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		rerender({ autoPlayInterval: 2000 });

		act(() => {
			vi.advanceTimersByTime(1500);
		});

		expect(goToNext).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(goToNext).toHaveBeenCalledTimes(1);
	});

	it('restarts interval when goToNext changes', () => {
		const goToNext1 = vi.fn();
		const goToNext2 = vi.fn();

		const { rerender } = renderHook(
			({ goToNext }) =>
				useCarouselAutoPlay({
					autoPlay: true,
					autoPlayInterval: 1000,
					totalSlides: 3,
					goToNext,
				}),
			{
				initialProps: { goToNext: goToNext1 },
			}
		);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		rerender({ goToNext: goToNext2 });

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(goToNext1).not.toHaveBeenCalled();
		expect(goToNext2).toHaveBeenCalledTimes(1);
	});

	it('stops interval when totalSlides changes to 1', () => {
		const goToNext = vi.fn();

		const { rerender } = renderHook(
			({ totalSlides }) =>
				useCarouselAutoPlay({
					autoPlay: true,
					autoPlayInterval: 1000,
					totalSlides,
					goToNext,
				}),
			{
				initialProps: { totalSlides: 3 },
			}
		);

		act(() => {
			vi.advanceTimersByTime(500);
		});

		rerender({ totalSlides: 1 });

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(goToNext).not.toHaveBeenCalled();
	});
});

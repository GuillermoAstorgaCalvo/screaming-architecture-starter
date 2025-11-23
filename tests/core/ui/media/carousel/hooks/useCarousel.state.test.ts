/**
 * useCarouselState Tests
 *
 * Tests for the carousel state management hook:
 * - Controlled vs uncontrolled state
 * - Navigation functions
 * - Loop behavior
 * - Callback invocation
 */

import { useCarouselState } from '@core/ui/media/carousel/hooks/useCarousel.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useCarouselState', () => {
	it('should be a function', () => {
		expect(typeof useCarouselState).toBe('function');
	});

	it('returns all expected properties', () => {
		const { result } = renderHook(() =>
			useCarouselState({
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				totalSlides: 3,
				loop: true,
				onSlideChange: undefined,
			})
		);

		expect(result.current).toHaveProperty('activeIndex');
		expect(result.current).toHaveProperty('goToSlide');
		expect(result.current).toHaveProperty('goToPrevious');
		expect(result.current).toHaveProperty('goToNext');
	});

	describe('Uncontrolled mode', () => {
		it('initializes with defaultActiveIndex', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 2,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			expect(result.current.activeIndex).toBe(2);
		});

		it('updates internal state when goToSlide is called', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToSlide(3);
			});

			expect(result.current.activeIndex).toBe(3);
		});

		it('updates internal state when goToNext is called', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 1,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(result.current.activeIndex).toBe(2);
		});

		it('updates internal state when goToPrevious is called', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 2,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToPrevious();
			});

			expect(result.current.activeIndex).toBe(1);
		});
	});

	describe('Controlled mode', () => {
		it('uses controlledActiveIndex value', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: 3,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			expect(result.current.activeIndex).toBe(3);
		});

		it('does not update internal state when goToSlide is called', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: 2,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToSlide(4);
			});

			expect(result.current.activeIndex).toBe(2);
		});

		it('updates when controlledActiveIndex changes', () => {
			const { result, rerender } = renderHook(
				({ controlledActiveIndex }) =>
					useCarouselState({
						controlledActiveIndex,
						defaultActiveIndex: 0,
						totalSlides: 5,
						loop: true,
						onSlideChange: undefined,
					}),
				{
					initialProps: { controlledActiveIndex: 2 as number | undefined },
				}
			);

			expect(result.current.activeIndex).toBe(2);

			rerender({ controlledActiveIndex: 4 });

			expect(result.current.activeIndex).toBe(4);
		});
	});

	describe('Loop behavior', () => {
		it('loops to last slide when going previous from first slide with loop enabled', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToPrevious();
			});

			expect(result.current.activeIndex).toBe(4);
		});

		it('loops to first slide when going next from last slide with loop enabled', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 4,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(result.current.activeIndex).toBe(0);
		});

		it('stays at first slide when going previous with loop disabled', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: false,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToPrevious();
			});

			expect(result.current.activeIndex).toBe(0);
		});

		it('stays at last slide when going next with loop disabled', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 4,
					totalSlides: 5,
					loop: false,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(result.current.activeIndex).toBe(4);
		});

		it('clamps goToSlide to valid range when loop is disabled', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 2,
					totalSlides: 5,
					loop: false,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToSlide(-1);
			});

			expect(result.current.activeIndex).toBe(0);

			act(() => {
				result.current.goToSlide(10);
			});

			expect(result.current.activeIndex).toBe(4);
		});
	});

	describe('onSlideChange callback', () => {
		it('calls onSlideChange when goToSlide is called', () => {
			const onSlideChange = vi.fn();

			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange,
				})
			);

			act(() => {
				result.current.goToSlide(3);
			});

			expect(onSlideChange).toHaveBeenCalledWith(3);
			expect(onSlideChange).toHaveBeenCalledTimes(1);
		});

		it('calls onSlideChange when goToNext is called', () => {
			const onSlideChange = vi.fn();

			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 1,
					totalSlides: 5,
					loop: true,
					onSlideChange,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(onSlideChange).toHaveBeenCalledWith(2);
			expect(onSlideChange).toHaveBeenCalledTimes(1);
		});

		it('calls onSlideChange when goToPrevious is called', () => {
			const onSlideChange = vi.fn();

			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 2,
					totalSlides: 5,
					loop: true,
					onSlideChange,
				})
			);

			act(() => {
				result.current.goToPrevious();
			});

			expect(onSlideChange).toHaveBeenCalledWith(1);
			expect(onSlideChange).toHaveBeenCalledTimes(1);
		});

		it('calls onSlideChange even in controlled mode', () => {
			const onSlideChange = vi.fn();

			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: 2,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange,
				})
			);

			act(() => {
				result.current.goToSlide(4);
			});

			expect(onSlideChange).toHaveBeenCalledWith(4);
		});

		it('handles undefined onSlideChange gracefully', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 5,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToSlide(2);
			});

			expect(result.current.activeIndex).toBe(2);
		});
	});

	describe('Edge cases', () => {
		it('handles single slide correctly', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 1,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(result.current.activeIndex).toBe(0);

			act(() => {
				result.current.goToPrevious();
			});

			expect(result.current.activeIndex).toBe(0);
		});

		it('handles zero slides gracefully', () => {
			const { result } = renderHook(() =>
				useCarouselState({
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					totalSlides: 0,
					loop: true,
					onSlideChange: undefined,
				})
			);

			act(() => {
				result.current.goToNext();
			});

			expect(result.current.activeIndex).toBe(0);
		});
	});
});

/**
 * useCarouselSetup Tests
 *
 * Tests for the main carousel hook:
 * - Hook composition
 * - Content props preparation
 * - Keyboard handler integration
 * - All features working together
 */

import { useCarouselSetup } from '@core/ui/media/carousel/hooks/useCarousel';
import { act, createEvent, renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import type React from 'react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useCarouselSetup', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('should be a function', () => {
		expect(typeof useCarouselSetup).toBe('function');
	});

	it('returns all expected properties', () => {
		const { result } = renderHook(() =>
			useCarouselSetup({
				children: createElement('div', null, 'Slide 1'),
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		expect(result.current).toHaveProperty('contentProps');
		expect(result.current).toHaveProperty('handleKeyDown');
	});

	it('returns null contentProps when there are no slides', () => {
		const { result } = renderHook(() =>
			useCarouselSetup({
				children: [] as never,
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		expect(result.current.contentProps).toBeNull();
	});

	it('returns contentProps with all required properties', () => {
		const { result } = renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		expect(result.current.contentProps).not.toBeNull();
		expect(result.current.contentProps?.slides).toHaveLength(2);
		expect(result.current.contentProps?.activeIndex).toBe(0);
		expect(result.current.contentProps?.showArrows).toBe(true);
		expect(result.current.contentProps?.showDots).toBe(true);
		expect(result.current.contentProps?.hasMultipleSlides).toBe(true);
		expect(result.current.contentProps?.loop).toBe(true);
		expect(result.current.contentProps?.totalSlides).toBe(2);
		expect(typeof result.current.contentProps?.goToPrevious).toBe('function');
		expect(typeof result.current.contentProps?.goToNext).toBe('function');
		expect(typeof result.current.contentProps?.goToSlide).toBe('function');
		expect(typeof result.current.contentProps?.carouselId).toBe('string');
	});

	it('generates unique carousel ID', () => {
		const { result: result1 } = renderHook(() =>
			useCarouselSetup({
				children: createElement('div', null, 'Slide 1'),
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		const { result: result2 } = renderHook(() =>
			useCarouselSetup({
				children: createElement('div', null, 'Slide 1'),
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		expect(result1.current.contentProps?.carouselId).not.toBe(
			result2.current.contentProps?.carouselId
		);
	});

	it('includes custom arrow components when provided', () => {
		const prevArrow = createElement('button', null, 'Previous');
		const nextArrow = createElement('button', null, 'Next');

		const { result } = renderHook(() =>
			useCarouselSetup({
				children: createElement('div', null, 'Slide 1'),
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
				prevArrow,
				nextArrow,
			})
		);

		expect(result.current.contentProps?.prevArrow).toBe(prevArrow);
		expect(result.current.contentProps?.nextArrow).toBe(nextArrow);
	});

	it('handles keyboard navigation', () => {
		const { result } = renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
					createElement('div', { key: '3' }, 'Slide 3'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		const leftEvent = createEvent.keyDown(document.body, { key: 'ArrowLeft' });
		Object.defineProperty(leftEvent, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		act(() => {
			result.current.handleKeyDown(leftEvent as unknown as KeyboardEvent<HTMLElement>);
		});

		expect(result.current.contentProps?.activeIndex).toBe(2); // Looped to last

		const rightEvent = createEvent.keyDown(document.body, { key: 'ArrowRight' });
		Object.defineProperty(rightEvent, 'preventDefault', {
			value: vi.fn(),
			writable: true,
		});

		act(() => {
			result.current.handleKeyDown(rightEvent as unknown as KeyboardEvent<HTMLElement>);
		});

		expect(result.current.contentProps?.activeIndex).toBe(0); // Looped to first
	});

	it('calls onSlideChange when navigating', () => {
		const onSlideChange = vi.fn();

		const { result } = renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
					createElement('div', { key: '3' }, 'Slide 3'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: true,
			})
		);

		act(() => {
			result.current.contentProps?.goToNext();
		});

		expect(onSlideChange).toHaveBeenCalledWith(1);
		expect(onSlideChange).toHaveBeenCalledTimes(1);
	});

	it('supports controlled mode', () => {
		const { result, rerender } = renderHook(
			({ controlledActiveIndex }) =>
				useCarouselSetup({
					children: [
						createElement('div', { key: '1' }, 'Slide 1'),
						createElement('div', { key: '2' }, 'Slide 2'),
						createElement('div', { key: '3' }, 'Slide 3'),
					],
					controlledActiveIndex,
					defaultActiveIndex: 0,
					onSlideChange: undefined,
					showArrows: true,
					showDots: true,
					autoPlay: false,
					autoPlayInterval: 3000,
					loop: true,
				}),
			{
				initialProps: { controlledActiveIndex: 1 as number | undefined },
			}
		);

		expect(result.current.contentProps?.activeIndex).toBe(1);

		rerender({ controlledActiveIndex: 2 });

		expect(result.current.contentProps?.activeIndex).toBe(2);
	});

	it('supports auto-play', () => {
		const onSlideChange = vi.fn();

		renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
					createElement('div', { key: '3' }, 'Slide 3'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange,
				showArrows: true,
				showDots: true,
				autoPlay: true,
				autoPlayInterval: 1000,
				loop: true,
			})
		);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(onSlideChange).toHaveBeenCalledWith(1);
	});

	it('does not auto-play when disabled', () => {
		const onSlideChange = vi.fn();

		renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
					createElement('div', { key: '3' }, 'Slide 3'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 1000,
				loop: true,
			})
		);

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(onSlideChange).not.toHaveBeenCalled();
	});

	it('does not auto-play with single slide', () => {
		const onSlideChange = vi.fn();

		renderHook(() =>
			useCarouselSetup({
				children: createElement('div', null, 'Slide 1'),
				controlledActiveIndex: undefined,
				defaultActiveIndex: 0,
				onSlideChange,
				showArrows: true,
				showDots: true,
				autoPlay: true,
				autoPlayInterval: 1000,
				loop: true,
			})
		);

		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(onSlideChange).not.toHaveBeenCalled();
	});

	it('respects loop setting', () => {
		const { result } = renderHook(() =>
			useCarouselSetup({
				children: [
					createElement('div', { key: '1' }, 'Slide 1'),
					createElement('div', { key: '2' }, 'Slide 2'),
					createElement('div', { key: '3' }, 'Slide 3'),
				],
				controlledActiveIndex: undefined,
				defaultActiveIndex: 2,
				onSlideChange: undefined,
				showArrows: true,
				showDots: true,
				autoPlay: false,
				autoPlayInterval: 3000,
				loop: false,
			})
		);

		act(() => {
			result.current.contentProps?.goToNext();
		});

		expect(result.current.contentProps?.activeIndex).toBe(2); // Stays at last
	});

	it('updates when children change', () => {
		const { result, rerender } = renderHook(
			({ children }: { children: React.ReactNode }) =>
				useCarouselSetup({
					children,
					controlledActiveIndex: undefined,
					defaultActiveIndex: 0,
					onSlideChange: undefined,
					showArrows: true,
					showDots: true,
					autoPlay: false,
					autoPlayInterval: 3000,
					loop: true,
				}),
			{
				initialProps: { children: createElement('div', null, 'Slide 1') as React.ReactNode },
			}
		);

		expect(result.current.contentProps?.totalSlides).toBe(1);

		rerender({
			children: [
				createElement('div', { key: '1' }, 'Slide 1'),
				createElement('div', { key: '2' }, 'Slide 2'),
				createElement('div', { key: '3' }, 'Slide 3'),
			] as React.ReactNode,
		});

		expect(result.current.contentProps?.totalSlides).toBe(3);
	});
});

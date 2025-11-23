/**
 * useCarouselData Tests
 *
 * Tests for the carousel data hook:
 * - Slide normalization
 * - Carousel ID generation
 * - Total slides calculation
 */

import { useCarouselData } from '@core/ui/media/carousel/hooks/useCarousel.data';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('useCarouselData', () => {
	it('should be a function', () => {
		expect(typeof useCarouselData).toBe('function');
	});

	it('returns all expected properties', () => {
		const { result } = renderHook(() => useCarouselData(createElement('div', null, 'Slide 1')));

		expect(result.current).toHaveProperty('carouselId');
		expect(result.current).toHaveProperty('slides');
		expect(result.current).toHaveProperty('totalSlides');
	});

	it('generates a unique carousel ID', () => {
		const { result: result1 } = renderHook(() =>
			useCarouselData(createElement('div', null, 'Slide 1'))
		);
		const { result: result2 } = renderHook(() =>
			useCarouselData(createElement('div', null, 'Slide 1'))
		);

		expect(typeof result1.current.carouselId).toBe('string');
		expect(result1.current.carouselId.length).toBeGreaterThan(0);
		expect(result1.current.carouselId).not.toBe(result2.current.carouselId);
	});

	it('normalizes single child into array', () => {
		const { result } = renderHook(() =>
			useCarouselData(createElement('div', null, 'Single Slide'))
		);

		expect(Array.isArray(result.current.slides)).toBe(true);
		expect(result.current.slides).toHaveLength(1);
		expect(result.current.totalSlides).toBe(1);
	});

	it('handles array of children', () => {
		const children = [
			createElement('div', { key: '1' }, 'Slide 1'),
			createElement('div', { key: '2' }, 'Slide 2'),
			createElement('div', { key: '3' }, 'Slide 3'),
		];

		const { result } = renderHook(() => useCarouselData(children));

		expect(Array.isArray(result.current.slides)).toBe(true);
		expect(result.current.slides).toHaveLength(3);
		expect(result.current.totalSlides).toBe(3);
	});

	it('handles empty array', () => {
		const { result } = renderHook(() => useCarouselData([]));

		expect(Array.isArray(result.current.slides)).toBe(true);
		expect(result.current.slides).toHaveLength(0);
		expect(result.current.totalSlides).toBe(0);
	});

	it('handles null child', () => {
		const { result } = renderHook(() => useCarouselData(null));

		expect(Array.isArray(result.current.slides)).toBe(true);
		expect(result.current.slides).toHaveLength(1);
		expect(result.current.totalSlides).toBe(1);
	});

	it('handles undefined child', () => {
		const { result } = renderHook(() => useCarouselData(undefined));

		expect(Array.isArray(result.current.slides)).toBe(true);
		expect(result.current.slides).toHaveLength(1);
		expect(result.current.totalSlides).toBe(1);
	});

	it('maintains same carousel ID across rerenders', () => {
		const { result, rerender } = renderHook(() =>
			useCarouselData(createElement('div', null, 'Slide 1'))
		);

		const initialId = result.current.carouselId;

		rerender();

		expect(result.current.carouselId).toBe(initialId);
	});

	it('updates slides when children change', () => {
		const { result, rerender } = renderHook(
			({ children }: { children: ReactNode }) => useCarouselData(children),
			{
				initialProps: { children: createElement('div', null, 'Slide 1') as ReactNode },
			}
		);

		expect(result.current.totalSlides).toBe(1);

		const newChildren: ReactNode = [
			createElement('div', { key: '1' }, 'Slide 1'),
			createElement('div', { key: '2' }, 'Slide 2'),
		];
		rerender({ children: newChildren });

		expect(result.current.totalSlides).toBe(2);
	});
});

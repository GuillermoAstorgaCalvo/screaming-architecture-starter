/**
 * useCarousel.utils Tests
 *
 * Tests for carousel utility functions:
 * - calculateNewIndex
 * - normalizeSlides
 * - prepareCarouselContentProps
 * - filterCarouselProps
 */

import {
	calculateNewIndex,
	filterCarouselProps,
	normalizeSlides,
	prepareCarouselContentProps,
} from '@core/ui/media/carousel/helpers/useCarousel.utils';
import type { CarouselProps } from '@src-types/ui/layout/carousel';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('calculateNewIndex', () => {
	it('should be a function', () => {
		expect(typeof calculateNewIndex).toBe('function');
	});

	it('returns the same index when within bounds', () => {
		expect(calculateNewIndex(2, 5, false)).toBe(2);
		expect(calculateNewIndex(0, 5, false)).toBe(0);
		expect(calculateNewIndex(4, 5, false)).toBe(4);
	});

	it('returns 0 when index is negative and loop is false', () => {
		expect(calculateNewIndex(-1, 5, false)).toBe(0);
		expect(calculateNewIndex(-10, 5, false)).toBe(0);
	});

	it('returns last index when index exceeds total and loop is false', () => {
		expect(calculateNewIndex(5, 5, false)).toBe(4);
		expect(calculateNewIndex(10, 5, false)).toBe(4);
	});

	it('returns last index when index is negative and loop is true', () => {
		expect(calculateNewIndex(-1, 5, true)).toBe(4);
		expect(calculateNewIndex(-10, 5, true)).toBe(4);
	});

	it('returns 0 when index exceeds total and loop is true', () => {
		expect(calculateNewIndex(5, 5, true)).toBe(0);
		expect(calculateNewIndex(10, 5, true)).toBe(0);
	});

	it('handles single slide correctly', () => {
		expect(calculateNewIndex(0, 1, false)).toBe(0);
		expect(calculateNewIndex(-1, 1, false)).toBe(0);
		expect(calculateNewIndex(1, 1, false)).toBe(0);
		expect(calculateNewIndex(-1, 1, true)).toBe(0);
		expect(calculateNewIndex(1, 1, true)).toBe(0);
	});
});

describe('normalizeSlides', () => {
	it('should be a function', () => {
		expect(typeof normalizeSlides).toBe('function');
	});

	it('returns array as-is when input is already an array', () => {
		const slides = [
			createElement('div', { key: '1' }, 'Slide 1'),
			createElement('div', { key: '2' }, 'Slide 2'),
		];
		const result = normalizeSlides(slides);
		expect(result).toEqual(slides);
		expect(Array.isArray(result)).toBe(true);
	});

	it('wraps single element in array', () => {
		const slide = createElement('div', null, 'Single Slide');
		const result = normalizeSlides(slide);
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
	});

	it('handles null', () => {
		const result = normalizeSlides(null);
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
		expect(result[0]).toBe(null);
	});

	it('handles undefined', () => {
		const result = normalizeSlides(undefined);
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(1);
		expect(result[0]).toBe(undefined);
	});

	it('handles empty array', () => {
		const result = normalizeSlides([]);
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(0);
	});
});

describe('prepareCarouselContentProps', () => {
	it('should be a function', () => {
		expect(typeof prepareCarouselContentProps).toBe('function');
	});

	it('returns null when totalSlides is 0', () => {
		const result = prepareCarouselContentProps({
			slides: [],
			totalSlides: 0,
			carouselId: 'test-id',
			activeIndex: 0,
			showArrows: true,
			showDots: true,
			loop: true,
			goToPrevious: () => {},
			goToNext: () => {},
			goToSlide: () => {},
		});
		expect(result).toBeNull();
	});

	it('returns content props with all required properties', () => {
		const goToPrevious = () => {};
		const goToNext = () => {};
		const goToSlide = () => {};
		const slides = [
			createElement('div', { key: '1' }, 'Slide 1'),
			createElement('div', { key: '2' }, 'Slide 2'),
		];

		const result = prepareCarouselContentProps({
			slides,
			totalSlides: 2,
			carouselId: 'test-id',
			activeIndex: 0,
			showArrows: true,
			showDots: true,
			loop: true,
			goToPrevious,
			goToNext,
			goToSlide,
		});

		expect(result).not.toBeNull();
		expect(result?.slides).toEqual(slides);
		expect(result?.activeIndex).toBe(0);
		expect(result?.carouselId).toBe('test-id');
		expect(result?.showArrows).toBe(true);
		expect(result?.showDots).toBe(true);
		expect(result?.hasMultipleSlides).toBe(true);
		expect(result?.loop).toBe(true);
		expect(result?.totalSlides).toBe(2);
		expect(result?.goToPrevious).toBe(goToPrevious);
		expect(result?.goToNext).toBe(goToNext);
		expect(result?.goToSlide).toBe(goToSlide);
	});

	it('sets hasMultipleSlides to false when totalSlides is 1', () => {
		const result = prepareCarouselContentProps({
			slides: [createElement('div', { key: '1' }, 'Slide 1')],
			totalSlides: 1,
			carouselId: 'test-id',
			activeIndex: 0,
			showArrows: false,
			showDots: false,
			loop: false,
			goToPrevious: () => {},
			goToNext: () => {},
			goToSlide: () => {},
		});

		expect(result?.hasMultipleSlides).toBe(false);
	});

	it('includes optional arrow components when provided', () => {
		const prevArrow = createElement('button', null, 'Previous');
		const nextArrow = createElement('button', null, 'Next');

		const result = prepareCarouselContentProps({
			slides: [createElement('div', { key: '1' }, 'Slide 1')],
			totalSlides: 1,
			carouselId: 'test-id',
			activeIndex: 0,
			showArrows: true,
			showDots: true,
			loop: true,
			goToPrevious: () => {},
			goToNext: () => {},
			goToSlide: () => {},
			prevArrow,
			nextArrow,
		});

		expect(result?.prevArrow).toBe(prevArrow);
		expect(result?.nextArrow).toBe(nextArrow);
	});

	it('handles undefined arrow components', () => {
		const result = prepareCarouselContentProps({
			slides: [createElement('div', { key: '1' }, 'Slide 1')],
			totalSlides: 1,
			carouselId: 'test-id',
			activeIndex: 0,
			showArrows: true,
			showDots: true,
			loop: true,
			goToPrevious: () => {},
			goToNext: () => {},
			goToSlide: () => {},
		});

		expect(result?.prevArrow).toBeUndefined();
		expect(result?.nextArrow).toBeUndefined();
	});
});

describe('filterCarouselProps', () => {
	it('should be a function', () => {
		expect(typeof filterCarouselProps).toBe('function');
	});

	it('removes onKeyDown from props', () => {
		const props: CarouselProps = {
			children: createElement('div', null, 'Test'),
			onKeyDown: () => {},
			showArrows: true,
		};

		const result = filterCarouselProps(props);

		expect(result).not.toHaveProperty('onKeyDown');
		expect(result).toHaveProperty('children');
		expect(result).toHaveProperty('showArrows');
	});

	it('preserves all other props', () => {
		const props: CarouselProps = {
			children: createElement('div', null, 'Test'),
			showArrows: true,
			showDots: false,
			autoPlay: true,
			loop: false,
			className: 'test-class',
		};

		const result = filterCarouselProps(props);

		expect(result).toHaveProperty('children');
		expect(result).toHaveProperty('showArrows');
		expect(result).toHaveProperty('showDots');
		expect(result).toHaveProperty('autoPlay');
		expect(result).toHaveProperty('loop');
		expect(result).toHaveProperty('className');
	});

	it('handles props without onKeyDown', () => {
		const props: CarouselProps = {
			children: createElement('div', null, 'Test'),
			showArrows: true,
		};

		const result = filterCarouselProps(props);

		expect(result).not.toHaveProperty('onKeyDown');
		expect(result).toHaveProperty('children');
		expect(result).toHaveProperty('showArrows');
	});
});

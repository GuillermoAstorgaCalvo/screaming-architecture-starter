import type { CarouselProps } from '@src-types/ui/layout/carousel';
import type { ReactNode } from 'react';

import type { CarouselContentProps } from './useCarousel.types';

export function calculateNewIndex(index: number, totalSlides: number, loop: boolean): number {
	if (index < 0) {
		return loop ? totalSlides - 1 : 0;
	}
	if (index >= totalSlides) {
		return loop ? 0 : totalSlides - 1;
	}
	return index;
}

export function normalizeSlides(children: ReactNode): ReactNode[] {
	return Array.isArray(children) ? children : [children];
}

export function prepareCarouselContentProps(
	params: Readonly<{
		slides: ReactNode[];
		totalSlides: number;
		carouselId: string;
		activeIndex: number;
		showArrows: boolean;
		showDots: boolean;
		loop: boolean;
		goToPrevious: () => void;
		goToNext: () => void;
		goToSlide: (index: number) => void;
		prevArrow?: ReactNode;
		nextArrow?: ReactNode;
	}>
): CarouselContentProps | null {
	if (params.totalSlides === 0) return null;

	return {
		slides: params.slides,
		activeIndex: params.activeIndex,
		carouselId: params.carouselId,
		showArrows: params.showArrows,
		showDots: params.showDots,
		hasMultipleSlides: params.totalSlides > 1,
		loop: params.loop,
		totalSlides: params.totalSlides,
		goToPrevious: params.goToPrevious,
		goToNext: params.goToNext,
		goToSlide: params.goToSlide,
		prevArrow: params.prevArrow,
		nextArrow: params.nextArrow,
	};
}

export function filterCarouselProps(props: Readonly<CarouselProps>) {
	const { onKeyDown: _omitted, ...restProps } = props as {
		onKeyDown?: unknown;
		[key: string]: unknown;
	};
	return restProps;
}

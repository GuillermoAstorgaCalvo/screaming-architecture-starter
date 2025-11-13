import type { ReactNode } from 'react';

export interface CarouselStateParams {
	readonly controlledActiveIndex: number | undefined;
	readonly defaultActiveIndex: number;
	readonly totalSlides: number;
	readonly loop: boolean;
	readonly onSlideChange: ((index: number) => void) | undefined;
}

export interface CarouselAutoPlayParams {
	readonly autoPlay: boolean;
	readonly autoPlayInterval: number;
	readonly totalSlides: number;
	readonly goToNext: () => void;
}

export interface CarouselLogicParams {
	readonly controlledActiveIndex: number | undefined;
	readonly defaultActiveIndex: number;
	readonly onSlideChange: ((index: number) => void) | undefined;
	readonly autoPlay: boolean;
	readonly autoPlayInterval: number;
	readonly loop: boolean;
	readonly totalSlides: number;
}

export interface CarouselContentProps {
	readonly slides: ReactNode[];
	readonly activeIndex: number;
	readonly carouselId: string;
	readonly showArrows: boolean;
	readonly showDots: boolean;
	readonly hasMultipleSlides: boolean;
	readonly loop: boolean;
	readonly totalSlides: number;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
	readonly goToSlide: (index: number) => void;
	readonly prevArrow?: ReactNode;
	readonly nextArrow?: ReactNode;
}

export interface UseCarouselSetupParams {
	readonly children: ReactNode;
	readonly controlledActiveIndex: number | undefined;
	readonly defaultActiveIndex: number;
	readonly onSlideChange: ((index: number) => void) | undefined;
	readonly showArrows: boolean;
	readonly showDots: boolean;
	readonly autoPlay: boolean;
	readonly autoPlayInterval: number;
	readonly loop: boolean;
	readonly prevArrow?: ReactNode;
	readonly nextArrow?: ReactNode;
}

import { type ReactNode, useId } from 'react';

import { normalizeSlides } from './useCarousel.utils';

export interface UseCarouselDataReturn {
	readonly carouselId: string;
	readonly slides: ReactNode[];
	readonly totalSlides: number;
}

export function useCarouselData(children: ReactNode): UseCarouselDataReturn {
	const carouselId = useId();
	const slides = normalizeSlides(children);
	const totalSlides = slides.length;
	return { carouselId, slides, totalSlides };
}

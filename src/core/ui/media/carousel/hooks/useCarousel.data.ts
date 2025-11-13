import { normalizeSlides } from '@core/ui/media/carousel/helpers/useCarousel.utils';
import { type ReactNode, useId } from 'react';

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

import type { CarouselAutoPlayParams } from '@core/ui/media/carousel/types/useCarousel.types';
import { useEffect, useRef } from 'react';

export function useCarouselAutoPlay({
	autoPlay,
	autoPlayInterval,
	totalSlides,
	goToNext,
}: CarouselAutoPlayParams): void {
	const autoPlayTimerRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);

	useEffect(() => {
		if (!autoPlay || totalSlides <= 1) return;

		autoPlayTimerRef.current = globalThis.setInterval(() => {
			goToNext();
		}, autoPlayInterval);

		return () => {
			if (autoPlayTimerRef.current !== null) {
				globalThis.clearInterval(autoPlayTimerRef.current);
			}
		};
	}, [autoPlay, autoPlayInterval, goToNext, totalSlides]);
}

import { useEffect, useRef } from 'react';

import type { CarouselAutoPlayParams } from './useCarousel.types';

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

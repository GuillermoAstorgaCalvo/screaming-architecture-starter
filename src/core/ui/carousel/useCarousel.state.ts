import { useCallback, useState } from 'react';

import type { CarouselStateParams } from './useCarousel.types';
import { calculateNewIndex } from './useCarousel.utils';

export interface UseCarouselStateReturn {
	readonly activeIndex: number;
	readonly goToSlide: (index: number) => void;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
}

export function useCarouselState({
	controlledActiveIndex,
	defaultActiveIndex,
	totalSlides,
	loop,
	onSlideChange,
}: CarouselStateParams): UseCarouselStateReturn {
	const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
	const isControlled = controlledActiveIndex !== undefined;
	const activeIndex = isControlled ? controlledActiveIndex : internalActiveIndex;

	const updateSlide = useCallback(
		(newIndex: number) => {
			if (!isControlled) {
				setInternalActiveIndex(newIndex);
			}
			onSlideChange?.(newIndex);
		},
		[isControlled, onSlideChange]
	);

	const goToSlide = useCallback(
		(index: number) => {
			const newIndex = calculateNewIndex(index, totalSlides, loop);
			updateSlide(newIndex);
		},
		[totalSlides, loop, updateSlide]
	);

	const goToPrevious = useCallback(() => {
		goToSlide(activeIndex - 1);
	}, [goToSlide, activeIndex]);

	const goToNext = useCallback(() => {
		goToSlide(activeIndex + 1);
	}, [goToSlide, activeIndex]);

	return { activeIndex, goToSlide, goToPrevious, goToNext };
}

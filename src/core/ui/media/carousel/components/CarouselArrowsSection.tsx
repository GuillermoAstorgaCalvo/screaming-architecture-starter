import { CarouselArrow } from '@core/ui/media/carousel/components/CarouselBaseComponents';
import type { ReactNode } from 'react';

interface CarouselArrowsSectionProps {
	readonly showArrows: boolean;
	readonly hasMultipleSlides: boolean;
	readonly loop: boolean;
	readonly activeIndex: number;
	readonly totalSlides: number;
	readonly goToPrevious: () => void;
	readonly goToNext: () => void;
	readonly prevArrow?: ReactNode;
	readonly nextArrow?: ReactNode;
}

export function CarouselArrowsSection({
	showArrows,
	hasMultipleSlides,
	loop,
	activeIndex,
	totalSlides,
	goToPrevious,
	goToNext,
	prevArrow,
	nextArrow,
}: Readonly<CarouselArrowsSectionProps>) {
	if (!showArrows || !hasMultipleSlides) return null;

	const prevDisabled = !loop && activeIndex === 0;
	const nextDisabled = !loop && activeIndex === totalSlides - 1;

	return (
		<>
			<CarouselArrow
				direction="prev"
				onClick={goToPrevious}
				disabled={prevDisabled}
				customArrow={prevArrow}
			/>
			<CarouselArrow
				direction="next"
				onClick={goToNext}
				disabled={nextDisabled}
				customArrow={nextArrow}
			/>
		</>
	);
}

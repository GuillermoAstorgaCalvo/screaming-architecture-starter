import { CarouselArrowsSection } from '@core/ui/media/carousel/components/CarouselArrowsSection';
import { CarouselDotsSection } from '@core/ui/media/carousel/components/CarouselDotsSection';
import { CarouselSlides } from '@core/ui/media/carousel/components/CarouselSlides';
import type { CarouselContentProps } from '@core/ui/media/carousel/types/useCarousel.types';

export function CarouselContent({
	slides,
	activeIndex,
	carouselId,
	showArrows,
	showDots,
	hasMultipleSlides,
	loop,
	totalSlides,
	goToPrevious,
	goToNext,
	goToSlide,
	prevArrow,
	nextArrow,
}: Readonly<CarouselContentProps>) {
	return (
		<>
			<CarouselSlides slides={slides} activeIndex={activeIndex} carouselId={carouselId} />
			<CarouselArrowsSection
				showArrows={showArrows}
				hasMultipleSlides={hasMultipleSlides}
				loop={loop}
				activeIndex={activeIndex}
				totalSlides={totalSlides}
				goToPrevious={goToPrevious}
				goToNext={goToNext}
				prevArrow={prevArrow}
				nextArrow={nextArrow}
			/>
			<CarouselDotsSection
				showDots={showDots}
				hasMultipleSlides={hasMultipleSlides}
				totalSlides={totalSlides}
				activeIndex={activeIndex}
				carouselId={carouselId}
				onDotClick={goToSlide}
			/>
		</>
	);
}

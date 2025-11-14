import { CarouselDots } from '@core/ui/media/carousel/components/CarouselBaseComponents';

interface CarouselDotsSectionProps {
	readonly showDots: boolean;
	readonly hasMultipleSlides: boolean;
	readonly totalSlides: number;
	readonly activeIndex: number;
	readonly carouselId: string;
	readonly onDotClick: (index: number) => void;
}

export function CarouselDotsSection({
	showDots,
	hasMultipleSlides,
	totalSlides,
	activeIndex,
	carouselId,
	onDotClick,
}: Readonly<CarouselDotsSectionProps>) {
	if (!showDots || !hasMultipleSlides) return null;

	return (
		<CarouselDots
			totalSlides={totalSlides}
			activeIndex={activeIndex}
			carouselId={carouselId}
			onDotClick={onDotClick}
		/>
	);
}

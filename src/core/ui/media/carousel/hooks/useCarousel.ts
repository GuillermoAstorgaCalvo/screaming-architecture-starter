import { prepareCarouselContentProps } from '@core/ui/media/carousel/helpers/useCarousel.utils';
import { useCarouselAutoPlay } from '@core/ui/media/carousel/hooks/useCarousel.autoplay';
import { useCarouselData } from '@core/ui/media/carousel/hooks/useCarousel.data';
import { useCarouselKeyboard } from '@core/ui/media/carousel/hooks/useCarousel.keyboard';
import { useCarouselState } from '@core/ui/media/carousel/hooks/useCarousel.state';
import type { UseCarouselSetupParams } from '@core/ui/media/carousel/types/useCarousel.types';

interface UseCarouselLogicParams {
	readonly controlledActiveIndex: number | undefined;
	readonly defaultActiveIndex: number;
	readonly onSlideChange: ((index: number) => void) | undefined;
	readonly autoPlay: boolean;
	readonly autoPlayInterval: number;
	readonly loop: boolean;
	readonly totalSlides: number;
}

function useCarouselLogic({
	controlledActiveIndex,
	defaultActiveIndex,
	onSlideChange,
	autoPlay,
	autoPlayInterval,
	loop,
	totalSlides,
}: UseCarouselLogicParams) {
	const { activeIndex, goToSlide, goToPrevious, goToNext } = useCarouselState({
		controlledActiveIndex,
		defaultActiveIndex,
		totalSlides,
		loop,
		onSlideChange,
	});

	useCarouselAutoPlay({ autoPlay, autoPlayInterval, totalSlides, goToNext });
	const handleKeyDown = useCarouselKeyboard(goToPrevious, goToNext);

	return { activeIndex, goToSlide, goToPrevious, goToNext, handleKeyDown };
}

export function useCarouselSetup(params: Readonly<UseCarouselSetupParams>) {
	const { carouselId, slides, totalSlides } = useCarouselData(params.children);
	const { activeIndex, goToSlide, goToPrevious, goToNext, handleKeyDown } = useCarouselLogic({
		controlledActiveIndex: params.controlledActiveIndex,
		defaultActiveIndex: params.defaultActiveIndex,
		onSlideChange: params.onSlideChange,
		autoPlay: params.autoPlay,
		autoPlayInterval: params.autoPlayInterval,
		loop: params.loop,
		totalSlides,
	});

	const contentProps = prepareCarouselContentProps({
		slides,
		totalSlides,
		carouselId,
		activeIndex,
		showArrows: params.showArrows,
		showDots: params.showDots,
		loop: params.loop,
		goToPrevious,
		goToNext,
		goToSlide,
		prevArrow: params.prevArrow,
		nextArrow: params.nextArrow,
	});

	return { contentProps, handleKeyDown };
}

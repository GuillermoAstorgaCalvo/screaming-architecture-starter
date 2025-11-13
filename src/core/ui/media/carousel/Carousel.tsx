import { ARIA_LABELS } from '@core/constants/aria';
import {
	CarouselContainer,
	CarouselContent,
} from '@core/ui/media/carousel/components/CarouselComponents';
import { filterCarouselProps } from '@core/ui/media/carousel/helpers/useCarousel.utils';
import { useCarouselSetup } from '@core/ui/media/carousel/hooks/useCarousel';
import type { CarouselProps } from '@src-types/ui/layout/carousel';
import type { KeyboardEvent, ReactNode } from 'react';

const DEFAULT_AUTO_PLAY_INTERVAL = 3000;

interface CarouselSetupParams {
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

function extractCarouselProps(props: Readonly<CarouselProps>): CarouselSetupParams & {
	readonly ariaLabel: string;
	readonly className: string | undefined;
} {
	return {
		children: props.children,
		controlledActiveIndex: props.activeIndex,
		defaultActiveIndex: props.defaultActiveIndex ?? 0,
		onSlideChange: props.onSlideChange,
		showArrows: props.showArrows ?? true,
		showDots: props.showDots ?? true,
		autoPlay: props.autoPlay ?? false,
		autoPlayInterval: props.autoPlayInterval ?? DEFAULT_AUTO_PLAY_INTERVAL,
		loop: props.loop ?? true,
		prevArrow: props.prevArrow,
		nextArrow: props.nextArrow,
		ariaLabel: props['aria-label'] ?? ARIA_LABELS.CAROUSEL,
		className: props.className,
	};
}

interface CarouselRenderProps {
	readonly ariaLabel: string;
	readonly className: string | undefined;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	readonly contentProps: unknown;
	readonly filteredProps: ReturnType<typeof filterCarouselProps>;
}

function renderCarousel({
	ariaLabel,
	className,
	handleKeyDown,
	contentProps,
	filteredProps,
}: CarouselRenderProps) {
	return (
		<CarouselContainer
			ariaLabel={ariaLabel}
			className={className}
			onKeyDown={handleKeyDown}
			{...filteredProps}
		>
			<CarouselContent {...(contentProps as Parameters<typeof CarouselContent>[0])} />
		</CarouselContainer>
	);
}

/**
 * Carousel - Image/content carousel component with navigation
 *
 * Features:
 * - Navigation arrows (previous/next)
 * - Navigation dots
 * - Auto-play support
 * - Loop support
 * - Keyboard navigation
 * - Accessible ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 *
 * @example
 * ```tsx
 * <Carousel
 *   autoPlay
 *   autoPlayInterval={5000}
 *   showArrows
 *   showDots
 *   onSlideChange={(index) => console.log(index)}
 * >
 *   {images.map((img) => <img key={img.id} src={img.src} alt={img.alt} />)}
 * </Carousel>
 * ```
 */
export default function Carousel(props: Readonly<CarouselProps>) {
	const extractedProps = extractCarouselProps(props);
	const { contentProps, handleKeyDown } = useCarouselSetup(extractedProps);

	if (!contentProps) return null;

	return renderCarousel({
		ariaLabel: extractedProps.ariaLabel,
		className: extractedProps.className,
		handleKeyDown,
		contentProps,
		filteredProps: filterCarouselProps(props),
	});
}

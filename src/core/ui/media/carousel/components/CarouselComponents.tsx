import {
	CarouselArrow,
	CarouselDots,
} from '@core/ui/media/carousel/components/CarouselBaseComponents';
import type { CarouselContentProps } from '@core/ui/media/carousel/types/useCarousel.types';
import { classNames } from '@core/utils/classNames';
import type { CarouselProps } from '@src-types/ui/layout/carousel';
import { Children, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';

interface CarouselSlidesProps {
	readonly slides: ReactNode[];
	readonly activeIndex: number;
	readonly carouselId: string;
}

export function CarouselSlides({ slides, activeIndex, carouselId }: Readonly<CarouselSlidesProps>) {
	const slidesArray = Children.toArray(slides);

	return (
		<div className="relative overflow-hidden rounded-lg">
			<div
				className="flex transition-transform duration-300 ease-in-out"
				style={{
					transform: `translateX(-${activeIndex * 100}%)`,
				}}
			>
				{slidesArray.map((slide, index) => {
					const slideElement = slide as ReactElement;
					const key = slideElement.key ?? `${carouselId}-slide-${index}`;
					return (
						<div
							key={key}
							id={`${carouselId}-slide-${index}`}
							aria-roledescription="slide"
							aria-label={`Slide ${index + 1} of ${slidesArray.length}`}
							className="min-w-full shrink-0"
						>
							{slide}
						</div>
					);
				})}
			</div>
		</div>
	);
}

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

interface CarouselContainerProps {
	readonly ariaLabel: string;
	readonly className: string | undefined;
	readonly onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	readonly children: ReactNode;
}

export function CarouselContainer({
	ariaLabel,
	className,
	onKeyDown,
	children,
	...props
}: Readonly<CarouselContainerProps> &
	Omit<CarouselProps, 'children' | 'aria-label' | 'className' | 'onKeyDown'>) {
	return (
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<section
			aria-label={ariaLabel}
			aria-roledescription="carousel"
			className={classNames('relative', className)}
			onKeyDown={onKeyDown}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			tabIndex={0}
			{...props}
		>
			{children}
		</section>
	);
}

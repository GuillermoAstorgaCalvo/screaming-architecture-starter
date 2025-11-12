import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

const FOCUS_RING_CLASSES = 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
const ARROW_BUTTON_BASE_CLASSES =
	'absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full p-2 shadow-md transition-colors';

interface CarouselArrowProps {
	readonly direction: 'prev' | 'next';
	readonly onClick: () => void;
	readonly disabled: boolean;
	readonly customArrow?: ReactNode;
}

export function CarouselArrow({
	direction,
	onClick,
	disabled,
	customArrow,
}: Readonly<CarouselArrowProps>) {
	const isPrev = direction === 'prev';
	const positionClass = isPrev ? 'left-2' : 'right-2';
	const ariaLabel = isPrev ? 'Previous slide' : 'Next slide';

	return (
		<button
			type="button"
			aria-label={ariaLabel}
			className={classNames(ARROW_BUTTON_BASE_CLASSES, positionClass, FOCUS_RING_CLASSES)}
			onClick={onClick}
			disabled={disabled}
		>
			{customArrow ?? (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d={isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
					/>
				</svg>
			)}
		</button>
	);
}

interface CarouselDotsProps {
	readonly totalSlides: number;
	readonly activeIndex: number;
	readonly carouselId: string;
	readonly onDotClick: (index: number) => void;
}

export function CarouselDots({
	totalSlides,
	activeIndex,
	carouselId,
	onDotClick,
}: Readonly<CarouselDotsProps>) {
	return (
		<div role="tablist" aria-label="Slide indicators" className="flex justify-center gap-2 mt-4">
			{Array.from({ length: totalSlides }, (_, index) => (
				<button
					key={`${carouselId}-dot-${index}`}
					type="button"
					role="tab"
					aria-selected={index === activeIndex}
					aria-label={`Go to slide ${index + 1}`}
					aria-controls={`${carouselId}-slide-${index}`}
					className={classNames(
						'w-2 h-2 rounded-full transition-all',
						index === activeIndex
							? 'bg-primary w-6'
							: 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500',
						FOCUS_RING_CLASSES
					)}
					onClick={() => onDotClick(index)}
				/>
			))}
		</div>
	);
}

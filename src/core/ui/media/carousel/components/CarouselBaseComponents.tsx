import { useTranslation } from '@core/i18n/useTranslation';
import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

const FOCUS_RING_CLASSES = 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
const ARROW_BUTTON_BASE_CLASSES =
	'absolute top-1/2 -translate-y-1/2 z-10 bg-surface/80 hover:bg-surface dark:bg-surface/80 dark:hover:bg-surface rounded-full p-2 shadow-md transition-colors';

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
	const { t } = useTranslation('common');
	const isPrev = direction === 'prev';
	const positionClass = isPrev ? 'left-2' : 'right-2';
	const ariaLabel = isPrev ? t('carousel.previousSlide') : t('carousel.nextSlide');

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
	const { t } = useTranslation('common');
	return (
		<div
			role="tablist"
			aria-label={t('carousel.slideIndicators')}
			className="flex justify-center gap-2 mt-4"
		>
			{Array.from({ length: totalSlides }, (_, index) => (
				<button
					key={`${carouselId}-dot-${index}`}
					type="button"
					role="tab"
					aria-selected={index === activeIndex}
					aria-label={t('carousel.goToSlide', { index: index + 1 })}
					aria-controls={`${carouselId}-slide-${index}`}
					className={classNames(
						'w-2 h-2 rounded-full transition-all',
						index === activeIndex
							? 'bg-primary w-6'
							: 'bg-muted hover:bg-muted-dark dark:bg-muted dark:hover:bg-muted-dark',
						FOCUS_RING_CLASSES
					)}
					onClick={() => onDotClick(index)}
				/>
			))}
		</div>
	);
}

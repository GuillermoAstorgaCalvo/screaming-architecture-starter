import { classNames } from '@core/utils/classNames';
import type { CarouselProps } from '@src-types/ui/layout/carousel';
import type { KeyboardEvent, ReactNode } from 'react';

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
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- This section has aria-roledescription="carousel" and proper keyboard handling, which is the correct ARIA pattern for carousels
		<section
			aria-label={ariaLabel}
			aria-roledescription="carousel"
			className={classNames('relative', className)}
			onKeyDown={onKeyDown}
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- tabIndex is required for keyboard navigation on carousel container per WAI-ARIA carousel pattern
			tabIndex={0}
			{...props}
		>
			{children}
		</section>
	);
}

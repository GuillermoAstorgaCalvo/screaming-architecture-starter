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

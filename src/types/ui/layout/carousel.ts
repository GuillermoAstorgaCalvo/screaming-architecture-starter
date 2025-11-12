import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Carousel component props
 */
export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
	/** Carousel items/content */
	children: ReactNode;
	/** Current active slide index (controlled) */
	activeIndex?: number;
	/** Default active slide index (uncontrolled) @default 0 */
	defaultActiveIndex?: number;
	/** Callback when active slide changes */
	onSlideChange?: (index: number) => void;
	/** Whether to show navigation arrows @default true */
	showArrows?: boolean;
	/** Whether to show navigation dots @default true */
	showDots?: boolean;
	/** Whether to auto-play the carousel @default false */
	autoPlay?: boolean;
	/** Auto-play interval in milliseconds @default 3000 */
	autoPlayInterval?: number;
	/** Whether to loop back to first slide after last @default true */
	loop?: boolean;
	/** Custom previous arrow component */
	prevArrow?: ReactNode;
	/** Custom next arrow component */
	nextArrow?: ReactNode;
	/** Custom aria-label for carousel @default 'Carousel' */
}

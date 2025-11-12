import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Marquee direction types
 */
export type MarqueeDirection = 'left' | 'right';

/**
 * Marquee component props
 */
export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
	/** Content to scroll */
	children: ReactNode;
	/** Scroll direction @default 'left' */
	direction?: MarqueeDirection;
	/** Scroll speed in pixels per second @default 50 */
	speed?: number;
	/** Whether to pause scrolling on hover @default true */
	pauseOnHover?: boolean;
	/** Whether to loop the content seamlessly @default true */
	loop?: boolean;
	/** Number of times to duplicate content for seamless loop (auto-calculated if not provided) */
	duplicateCount?: number;
	/** Custom aria-label for marquee @default 'Scrolling content' */
}

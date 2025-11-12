import type { HTMLAttributes, ReactNode } from 'react';

/**
 * ScrollArea orientation types
 */
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

/**
 * ScrollArea component props
 */
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
	/** ScrollArea content */
	children: ReactNode;
	/** Orientation of scrolling @default 'vertical' */
	orientation?: ScrollAreaOrientation;
}

/**
 * VirtualizedList orientation types
 */
export type VirtualizedListOrientation = 'vertical' | 'horizontal';

/**
 * VirtualizedList component props
 */
export interface VirtualizedListProps<T = unknown>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onScroll'> {
	/** Array of items to render */
	items: readonly T[];
	/** Render function for each item */
	renderItem: (item: T, index: number) => ReactNode;
	/** Estimated or fixed height of each item in pixels (for vertical) or width (for horizontal) */
	itemSize: number | ((index: number) => number);
	/** Orientation of the list @default 'vertical' */
	orientation?: VirtualizedListOrientation;
	/** Height of the container (for vertical) or width (for horizontal) @default '400px' */
	containerSize?: string | number;
	/** Number of items to render outside the visible area (overscan) @default 1 */
	overscan?: number;
	/** Optional key extractor function for items */
	getItemKey?: (item: T, index: number) => string | number;
	/** Optional callback when scroll position changes */
	onScrollChange?: (scrollOffset: number) => void;
	/** Optional initial scroll offset */
	initialScrollOffset?: number;
	/** Whether to enable smooth scrolling @default false */
	smoothScroll?: boolean;
	/** Custom empty state message when items array is empty */
	emptyMessage?: ReactNode;
}

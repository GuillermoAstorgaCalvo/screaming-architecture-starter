import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes } from 'react';

/**
 * Box component props
 */
export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
	/** Padding size @default undefined */
	padding?: StandardSize | 'none';
	/** Margin size @default undefined */
	margin?: StandardSize | 'none';
}

/**
 * Stack direction types
 */
export type StackDirection = 'vertical' | 'horizontal';

/**
 * Stack component props
 */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
	/** Stack direction @default 'vertical' */
	direction?: StackDirection;
	/** Gap between items @default 'md' */
	gap?: StandardSize | 'none';
	/** Alignment of items @default 'start' */
	align?: 'start' | 'center' | 'end' | 'stretch';
	/** Justification of items @default 'start' */
	justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * Flex direction types
 */
export type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';

/**
 * Flex component props
 */
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
	/** Flex direction @default 'row' */
	direction?: FlexDirection;
	/** Gap between items @default undefined */
	gap?: StandardSize | 'none';
	/** Alignment of items @default 'start' */
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	/** Justification of items @default 'start' */
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	/** Whether to wrap items @default false */
	wrap?: boolean;
}

/**
 * Grid column types
 */
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';

/**
 * Grid component props
 */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
	/** Number of columns (1-12) or 'auto' for auto-fit @default undefined */
	cols?: GridCols;
	/** Gap between grid items @default 'md' */
	gap?: StandardSize | 'none';
	/** Minimum column width when using auto-fit @default 200 */
	autoMinWidth?: number;
	/** Alignment of items @default 'start' */
	align?: 'start' | 'center' | 'end' | 'stretch';
	/** Justification of items @default 'start' */
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

/**
 * Affix position types
 */
export type AffixPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Affix component props
 */
export interface AffixProps extends HTMLAttributes<HTMLDivElement> {
	/** Scroll threshold in pixels before component becomes sticky @default 0 */
	threshold?: number;
	/** Position where the component sticks @default 'top' */
	position?: AffixPosition;
	/** Offset from the edge when stuck (in pixels) @default 0 */
	offset?: number;
	/** Custom container element to observe scroll from. If not provided, uses window @default undefined */
	container?: HTMLElement | null;
	/** Callback fired when sticky state changes */
	onStickyChange?: (isSticky: boolean) => void;
	/** Whether the affix is enabled @default true */
	enabled?: boolean;
	/** Z-index when stuck @default 1000 */
	zIndex?: number;
}

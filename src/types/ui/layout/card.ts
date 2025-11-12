import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Card variant types
 */
export type CardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * Card component props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	/** Visual variant of the card @default 'elevated' */
	variant?: CardVariant;
	/** Padding size @default 'md' */
	padding?: StandardSize;
	/** Card content */
	children: ReactNode;
}

/**
 * Stat trend direction types
 */
export type StatTrendDirection = 'up' | 'down' | 'neutral';

/**
 * StatCard component props
 */
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
	/** Main value to display */
	value: string | number;
	/** Label/description for the stat */
	label: string;
	/** Optional trend information */
	trend?: {
		/** Trend direction */
		direction: StatTrendDirection;
		/** Trend percentage value */
		value: number;
		/** Optional trend label/description */
		label?: string;
	};
	/** Optional icon to display */
	icon?: ReactNode;
	/** Size variant @default 'md' */
	size?: StandardSize;
	/** Visual variant of the card @default 'elevated' */
	variant?: CardVariant;
	/** Padding size @default 'md' */
	padding?: StandardSize;
}

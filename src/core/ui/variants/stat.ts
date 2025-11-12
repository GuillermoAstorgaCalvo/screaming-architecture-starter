import {
	STAT_CARD_BASE_CLASSES,
	STAT_CARD_ICON_SIZE_CLASSES,
	STAT_CARD_LABEL_SIZE_CLASSES,
	STAT_CARD_TREND_SIZE_CLASSES,
	STAT_CARD_VALUE_SIZE_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * StatCard variant definition using class-variance-authority
 *
 * Provides type-safe variant management for StatCard component.
 * Combines base classes and size classes for different parts.
 */
export const statCardVariants = cva(STAT_CARD_BASE_CLASSES, {
	variants: {
		size: {
			sm: '',
			md: '',
			lg: '',
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for stat card variant props
 * Extracted from statCardVariants using VariantProps
 */
export type StatCardVariants = VariantProps<typeof statCardVariants>;

/**
 * Helper function to get stat card class names with proper merging
 *
 * @param props - Stat card variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getStatCardVariantClasses(
	props: StatCardVariants & { className?: string | undefined }
): string {
	return twMerge(statCardVariants(props), props.className);
}

/**
 * Get stat card value size classes
 *
 * @param size - Size variant
 * @returns Value size classes
 */
export function getStatCardValueSizeClasses(size: StandardSize): string {
	return STAT_CARD_VALUE_SIZE_CLASSES[size];
}

/**
 * Get stat card label size classes
 *
 * @param size - Size variant
 * @returns Label size classes
 */
export function getStatCardLabelSizeClasses(size: StandardSize): string {
	return STAT_CARD_LABEL_SIZE_CLASSES[size];
}

/**
 * Get stat card trend size classes
 *
 * @param size - Size variant
 * @returns Trend size classes
 */
export function getStatCardTrendSizeClasses(size: StandardSize): string {
	return STAT_CARD_TREND_SIZE_CLASSES[size];
}

/**
 * Get stat card icon size classes
 *
 * @param size - Size variant
 * @returns Icon size classes
 */
export function getStatCardIconSizeClasses(size: StandardSize): string {
	return STAT_CARD_ICON_SIZE_CLASSES[size];
}

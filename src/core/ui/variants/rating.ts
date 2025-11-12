import { RATING_BASE_CLASSES, RATING_SIZE_CLASSES } from '@core/constants/ui/rating';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Rating variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Rating component.
 */
export const ratingVariants = cva(RATING_BASE_CLASSES, {
	variants: {
		size: {
			sm: RATING_SIZE_CLASSES.sm,
			md: RATING_SIZE_CLASSES.md,
			lg: RATING_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for rating variant props
 * Extracted from ratingVariants using VariantProps
 */
export type RatingVariants = VariantProps<typeof ratingVariants>;

/**
 * Helper function to get rating class names with proper merging
 *
 * @param props - Rating variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getRatingVariantClasses(
	props: RatingVariants & { className?: string | undefined }
): string {
	return twMerge(ratingVariants(props), props.className);
}

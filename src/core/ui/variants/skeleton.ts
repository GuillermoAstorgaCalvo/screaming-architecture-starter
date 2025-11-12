import { SKELETON_BASE_CLASSES } from '@core/constants/ui/display';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Skeleton variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Skeleton component.
 */
export const skeletonVariants = cva(SKELETON_BASE_CLASSES, {
	variants: {
		variant: {
			text: 'h-4',
			circular: 'rounded-full aspect-square',
			rectangular: 'rounded',
		},
	},
	defaultVariants: {
		variant: 'rectangular',
	},
});

/**
 * Type for skeleton variant props
 * Extracted from skeletonVariants using VariantProps
 */
export type SkeletonVariants = VariantProps<typeof skeletonVariants>;

/**
 * Helper function to get skeleton class names with proper merging
 *
 * @param props - Skeleton variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getSkeletonVariantClasses(
	props: SkeletonVariants & { className?: string | undefined }
): string {
	return twMerge(skeletonVariants(props), props.className);
}

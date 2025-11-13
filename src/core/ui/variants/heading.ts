import { HEADING_SIZE_CLASSES } from '@core/constants/ui/display/typography';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Heading variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Heading component.
 */
export const headingVariants = cva('text-text-primary', {
	variants: {
		size: {
			sm: HEADING_SIZE_CLASSES.sm,
			md: HEADING_SIZE_CLASSES.md,
			lg: HEADING_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for heading variant props
 * Extracted from headingVariants using VariantProps
 */
export type HeadingVariants = VariantProps<typeof headingVariants>;

/**
 * Helper function to get heading class names with proper merging
 *
 * @param props - Heading variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getHeadingVariantClasses(
	props: HeadingVariants & { className?: string | undefined }
): string {
	return twMerge(headingVariants(props), props.className);
}

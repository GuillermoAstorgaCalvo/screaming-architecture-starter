import { TEXT_TYPOGRAPHY_SIZE_CLASSES } from '@core/constants/ui/display/typography';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Text variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Text component.
 */
export const textVariants = cva('text-text-primary', {
	variants: {
		size: {
			sm: TEXT_TYPOGRAPHY_SIZE_CLASSES.sm,
			md: TEXT_TYPOGRAPHY_SIZE_CLASSES.md,
			lg: TEXT_TYPOGRAPHY_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for text variant props
 * Extracted from textVariants using VariantProps
 */
export type TextVariants = VariantProps<typeof textVariants>;

/**
 * Helper function to get text class names with proper merging
 *
 * @param props - Text variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getTextVariantClasses(
	props: TextVariants & { className?: string | undefined }
): string {
	return twMerge(textVariants(props), props.className);
}

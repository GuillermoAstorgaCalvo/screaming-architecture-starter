import { TEXT_SIZE_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * ErrorText variant definition using class-variance-authority
 *
 * Provides type-safe variant management for ErrorText component.
 */
export const errorTextVariants = cva('mt-1 text-red-600 dark:text-red-400', {
	variants: {
		size: {
			sm: TEXT_SIZE_CLASSES.sm,
			md: TEXT_SIZE_CLASSES.md,
			lg: TEXT_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for error text variant props
 * Extracted from errorTextVariants using VariantProps
 */
export type ErrorTextVariants = VariantProps<typeof errorTextVariants>;

/**
 * Helper function to get error text class names with proper merging
 *
 * @param props - Error text variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getErrorTextVariantClasses(
	props: ErrorTextVariants & { className?: string | undefined }
): string {
	return twMerge(errorTextVariants(props), props.className);
}

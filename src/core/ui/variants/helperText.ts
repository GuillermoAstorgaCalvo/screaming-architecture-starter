import { TEXT_SIZE_CLASSES } from '@core/constants/ui';
import type { StandardSize } from '@src-types/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * HelperText variant definition using class-variance-authority
 *
 * Provides type-safe variant management for HelperText component.
 */
export const helperTextVariants = cva('mt-1 text-gray-500 dark:text-gray-400', {
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
 * Type for helper text variant props
 * Extracted from helperTextVariants using VariantProps
 */
export type HelperTextVariants = VariantProps<typeof helperTextVariants>;

/**
 * Helper function to get helper text class names with proper merging
 *
 * @param props - Helper text variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getHelperTextVariantClasses(
	props: HelperTextVariants & { className?: string | undefined }
): string {
	return twMerge(helperTextVariants(props), props.className);
}

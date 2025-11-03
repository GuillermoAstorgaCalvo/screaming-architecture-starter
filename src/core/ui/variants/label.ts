import { TEXT_SIZE_CLASSES } from '@core/constants/ui';
import type { StandardSize } from '@src-types/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Label variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Label component.
 */
export const labelVariants = cva('block font-medium text-gray-700 dark:text-gray-300 mb-1', {
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
 * Type for label variant props
 * Extracted from labelVariants using VariantProps
 */
export type LabelVariants = VariantProps<typeof labelVariants>;

/**
 * Helper function to get label class names with proper merging
 *
 * @param props - Label variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getLabelVariantClasses(
	props: LabelVariants & { className?: string | undefined }
): string {
	return twMerge(labelVariants(props), props.className);
}

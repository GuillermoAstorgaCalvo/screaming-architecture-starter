import { SELECT_BASE_CLASSES, SELECT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Select variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Select component.
 * Combines base classes, size classes, and state classes (error/normal).
 */
export const selectVariants = cva(SELECT_BASE_CLASSES, {
	variants: {
		size: {
			sm: SELECT_SIZE_CLASSES.sm,
			md: SELECT_SIZE_CLASSES.md,
			lg: SELECT_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
		state: {
			normal: FORM_NORMAL_CLASSES,
			error: FORM_ERROR_CLASSES,
		},
	},
	defaultVariants: {
		size: 'md',
		state: 'normal',
	},
});

/**
 * Type for select variant props
 * Extracted from selectVariants using VariantProps
 */
export type SelectVariants = VariantProps<typeof selectVariants>;

/**
 * Helper function to get select class names with proper merging
 *
 * @param props - Select variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getSelectVariantClasses(
	props: SelectVariants & { className?: string | undefined }
): string {
	return twMerge(selectVariants(props), props.className);
}

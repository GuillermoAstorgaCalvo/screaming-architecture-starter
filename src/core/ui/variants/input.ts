import { INPUT_BASE_CLASSES, INPUT_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Input variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Input component.
 * Combines base classes, size classes, and state classes (error/normal).
 */
export const inputVariants = cva(INPUT_BASE_CLASSES, {
	variants: {
		size: {
			sm: INPUT_SIZE_CLASSES.sm,
			md: INPUT_SIZE_CLASSES.md,
			lg: INPUT_SIZE_CLASSES.lg,
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
 * Type for input variant props
 * Extracted from inputVariants using VariantProps
 */
export type InputVariants = VariantProps<typeof inputVariants>;

/**
 * Helper function to get input class names with proper merging
 *
 * @param props - Input variant props
 * @param options - Additional options (hasLeftIcon, hasRightIcon, className)
 * @returns Merged class names string
 */
export function getInputVariantClasses(
	props: InputVariants & {
		hasLeftIcon?: boolean;
		hasRightIcon?: boolean;
		className?: string | undefined;
	}
): string {
	return twMerge(
		inputVariants(props),
		props.hasLeftIcon && 'pl-10',
		props.hasRightIcon && 'pr-10',
		props.className
	);
}

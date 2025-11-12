import { TEXTAREA_BASE_CLASSES, TEXTAREA_SIZE_CLASSES } from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Textarea variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Textarea component.
 * Combines base classes, size classes, and state classes (error/normal).
 */
export const textareaVariants = cva(TEXTAREA_BASE_CLASSES, {
	variants: {
		size: {
			sm: TEXTAREA_SIZE_CLASSES.sm,
			md: TEXTAREA_SIZE_CLASSES.md,
			lg: TEXTAREA_SIZE_CLASSES.lg,
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
 * Type for textarea variant props
 * Extracted from textareaVariants using VariantProps
 */
export type TextareaVariants = VariantProps<typeof textareaVariants>;

/**
 * Helper function to get textarea class names with proper merging
 *
 * @param props - Textarea variant props
 * @param options - Additional options (className)
 * @returns Merged class names string
 */
export function getTextareaVariantClasses(
	props: TextareaVariants & {
		className?: string | undefined;
	}
): string {
	return twMerge(textareaVariants(props), props.className);
}

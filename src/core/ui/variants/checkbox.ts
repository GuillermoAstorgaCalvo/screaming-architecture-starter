import { CHECKBOX_BASE_CLASSES, CHECKBOX_SIZE_CLASSES } from '@core/constants/ui/controls';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Checkbox variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Checkbox component.
 * Combines base classes and size classes.
 */
export const checkboxVariants = cva(CHECKBOX_BASE_CLASSES, {
	variants: {
		size: {
			sm: CHECKBOX_SIZE_CLASSES.sm,
			md: CHECKBOX_SIZE_CLASSES.md,
			lg: CHECKBOX_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for checkbox variant props
 * Extracted from checkboxVariants using VariantProps
 */
export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

/**
 * Helper function to get checkbox class names with proper merging
 *
 * @param props - Checkbox variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getCheckboxVariantClasses(
	props: CheckboxVariants & { className?: string | undefined }
): string {
	return twMerge(checkboxVariants(props), props.className);
}

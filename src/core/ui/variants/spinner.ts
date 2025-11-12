import { SPINNER_SIZE_CLASSES } from '@core/constants/ui/overlays';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Spinner variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Spinner component.
 */
export const spinnerVariants = cva('inline-block animate-spin', {
	variants: {
		size: {
			sm: SPINNER_SIZE_CLASSES.sm,
			md: SPINNER_SIZE_CLASSES.md,
			lg: SPINNER_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for spinner variant props
 * Extracted from spinnerVariants using VariantProps
 */
export type SpinnerVariants = VariantProps<typeof spinnerVariants>;

/**
 * Helper function to get spinner class names with proper merging
 * Note: For custom numeric sizes, use getSpinnerSvgProps from SpinnerHelpers
 *
 * @param props - Spinner variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getSpinnerVariantClasses(
	props: SpinnerVariants & { className?: string | undefined }
): string {
	return twMerge(spinnerVariants(props), props.className);
}

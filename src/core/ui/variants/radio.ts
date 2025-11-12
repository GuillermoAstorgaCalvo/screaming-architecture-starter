import { RADIO_BASE_CLASSES, RADIO_SIZE_CLASSES } from '@core/constants/ui/controls';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Radio variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Radio component.
 * Combines base classes and size classes.
 */
export const radioVariants = cva(RADIO_BASE_CLASSES, {
	variants: {
		size: {
			sm: RADIO_SIZE_CLASSES.sm,
			md: RADIO_SIZE_CLASSES.md,
			lg: RADIO_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for radio variant props
 * Extracted from radioVariants using VariantProps
 */
export type RadioVariants = VariantProps<typeof radioVariants>;

/**
 * Helper function to get radio class names with proper merging
 *
 * @param props - Radio variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getRadioVariantClasses(
	props: RadioVariants & { className?: string | undefined }
): string {
	return twMerge(radioVariants(props), props.className);
}

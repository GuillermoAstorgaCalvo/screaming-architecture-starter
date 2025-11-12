import {
	TOGGLE_BASE_CLASSES,
	TOGGLE_PRESSED_CLASSES,
	TOGGLE_SIZE_CLASSES,
	TOGGLE_VARIANT_CLASSES,
} from '@core/constants/ui/buttons';
import type { StandardSize } from '@src-types/ui/base';
import type { ToggleVariant } from '@src-types/ui/buttons';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Toggle variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Toggle component.
 * Combines base classes, variant classes, size classes, and pressed state.
 */
export const toggleVariants = cva(TOGGLE_BASE_CLASSES, {
	variants: {
		variant: {
			default: TOGGLE_VARIANT_CLASSES.default,
			outline: TOGGLE_VARIANT_CLASSES.outline,
		} satisfies Record<ToggleVariant, string>,
		size: {
			sm: TOGGLE_SIZE_CLASSES.sm,
			md: TOGGLE_SIZE_CLASSES.md,
			lg: TOGGLE_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
		pressed: {
			true: TOGGLE_PRESSED_CLASSES,
			false: '',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
		pressed: false,
	},
});

/**
 * Type for toggle variant props
 * Extracted from toggleVariants using VariantProps
 */
export type ToggleVariants = VariantProps<typeof toggleVariants>;

/**
 * Helper function to get toggle class names with proper merging
 *
 * @param props - Toggle variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getToggleVariantClasses(
	props: ToggleVariants & { className?: string | undefined }
): string {
	return twMerge(toggleVariants(props), props.className);
}

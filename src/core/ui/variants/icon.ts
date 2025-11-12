import { ICON_SIZE_CLASSES } from '@core/constants/ui/shared';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Icon variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Icon components.
 * Used by all icon components (CloseIcon, ClearIcon, HeartIcon, etc.)
 */
export const iconVariants = cva('', {
	variants: {
		size: {
			sm: ICON_SIZE_CLASSES.sm,
			md: ICON_SIZE_CLASSES.md,
			lg: ICON_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		size: 'md',
	},
});

/**
 * Type for icon variant props
 * Extracted from iconVariants using VariantProps
 */
export type IconVariants = VariantProps<typeof iconVariants>;

/**
 * Helper function to get icon class names with proper merging
 *
 * @param props - Icon variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getIconVariantClasses(
	props: IconVariants & { className?: string | undefined }
): string {
	return twMerge(iconVariants(props), props.className);
}

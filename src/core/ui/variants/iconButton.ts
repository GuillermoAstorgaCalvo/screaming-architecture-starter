import { ICON_BUTTON_SIZE_CLASSES, ICON_BUTTON_VARIANT_CLASSES } from '@core/constants/ui';
import type { IconButtonVariant, StandardSize } from '@src-types/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * IconButton variant definition using class-variance-authority
 *
 * Provides type-safe variant management for IconButton component.
 * Combines base classes, variant classes, and size classes.
 */
export const iconButtonVariants = cva(
	'rounded-md inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary',
	{
		variants: {
			variant: {
				default: ICON_BUTTON_VARIANT_CLASSES.default,
				ghost: ICON_BUTTON_VARIANT_CLASSES.ghost,
			} satisfies Record<IconButtonVariant, string>,
			size: {
				sm: ICON_BUTTON_SIZE_CLASSES.sm,
				md: ICON_BUTTON_SIZE_CLASSES.md,
				lg: ICON_BUTTON_SIZE_CLASSES.lg,
			} satisfies Record<StandardSize, string>,
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
		},
	}
);

/**
 * Type for icon button variant props
 * Extracted from iconButtonVariants using VariantProps
 */
export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;

/**
 * Helper function to get icon button class names with proper merging
 *
 * @param props - Icon button variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getIconButtonVariantClasses(
	props: IconButtonVariants & { className?: string | undefined }
): string {
	return twMerge(iconButtonVariants(props), props.className);
}

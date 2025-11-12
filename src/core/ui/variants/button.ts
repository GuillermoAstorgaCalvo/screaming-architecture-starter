import {
	BUTTON_BASE_CLASSES,
	BUTTON_SIZE_CLASSES,
	BUTTON_VARIANT_CLASSES,
} from '@core/constants/ui/buttons';
import type { StandardSize } from '@src-types/ui/base';
import type { ButtonVariant } from '@src-types/ui/buttons';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Button variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Button component.
 * Combines base classes, variant classes, and size classes.
 */
export const buttonVariants = cva(BUTTON_BASE_CLASSES, {
	variants: {
		variant: {
			primary: BUTTON_VARIANT_CLASSES.primary,
			secondary: BUTTON_VARIANT_CLASSES.secondary,
			ghost: BUTTON_VARIANT_CLASSES.ghost,
		} satisfies Record<ButtonVariant, string>,
		size: {
			sm: BUTTON_SIZE_CLASSES.sm,
			md: BUTTON_SIZE_CLASSES.md,
			lg: BUTTON_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
});

/**
 * Type for button variant props
 * Extracted from buttonVariants using VariantProps
 */
export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Helper function to get button class names with proper merging
 *
 * @param props - Button variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getButtonVariantClasses(
	props: ButtonVariants & { fullWidth?: boolean; className?: string | undefined }
): string {
	return twMerge(buttonVariants(props), props.fullWidth && 'w-full', props.className);
}

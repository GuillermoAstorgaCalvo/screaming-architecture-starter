import {
	CHIP_BASE_CLASSES,
	CHIP_SIZE_CLASSES,
	CHIP_VARIANT_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import type { BadgeVariant } from '@src-types/ui/feedback';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Chip variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Chip component.
 * Combines base classes, size classes, and variant classes.
 */
export const chipVariants = cva(CHIP_BASE_CLASSES, {
	variants: {
		variant: {
			default: CHIP_VARIANT_CLASSES.default,
			primary: CHIP_VARIANT_CLASSES.primary,
			success: CHIP_VARIANT_CLASSES.success,
			warning: CHIP_VARIANT_CLASSES.warning,
			error: CHIP_VARIANT_CLASSES.error,
			info: CHIP_VARIANT_CLASSES.info,
		} satisfies Record<BadgeVariant, string>,
		size: {
			sm: CHIP_SIZE_CLASSES.sm,
			md: CHIP_SIZE_CLASSES.md,
			lg: CHIP_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

/**
 * Type for chip variant props
 * Extracted from chipVariants using VariantProps
 */
export type ChipVariants = VariantProps<typeof chipVariants>;

/**
 * Helper function to get chip class names with proper merging
 *
 * @param props - Chip variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getChipVariantClasses(
	props: ChipVariants & { className?: string | undefined }
): string {
	return twMerge(chipVariants(props), props.className);
}

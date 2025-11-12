import {
	BADGE_BASE_CLASSES,
	BADGE_SIZE_CLASSES,
	BADGE_VARIANT_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import type { BadgeVariant } from '@src-types/ui/feedback';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Badge variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Badge component.
 * Combines base classes, size classes, and variant classes.
 */
export const badgeVariants = cva(BADGE_BASE_CLASSES, {
	variants: {
		variant: {
			default: BADGE_VARIANT_CLASSES.default,
			primary: BADGE_VARIANT_CLASSES.primary,
			success: BADGE_VARIANT_CLASSES.success,
			warning: BADGE_VARIANT_CLASSES.warning,
			error: BADGE_VARIANT_CLASSES.error,
			info: BADGE_VARIANT_CLASSES.info,
		} satisfies Record<BadgeVariant, string>,
		size: {
			sm: BADGE_SIZE_CLASSES.sm,
			md: BADGE_SIZE_CLASSES.md,
			lg: BADGE_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

/**
 * Type for badge variant props
 * Extracted from badgeVariants using VariantProps
 */
export type BadgeVariants = VariantProps<typeof badgeVariants>;

/**
 * Helper function to get badge class names with proper merging
 *
 * @param props - Badge variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getBadgeVariantClasses(
	props: BadgeVariants & { className?: string | undefined }
): string {
	return twMerge(badgeVariants(props), props.className);
}

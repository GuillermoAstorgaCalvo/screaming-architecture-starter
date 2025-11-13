import {
	LINK_BASE_CLASSES,
	LINK_SIZE_CLASSES,
	LINK_VARIANT_CLASSES,
} from '@core/constants/ui/display/link';
import type { StandardSize } from '@src-types/ui/base';
import type { LinkVariant } from '@src-types/ui/navigation/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Anchor variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Anchor component.
 * Reuses Link styling for consistency.
 * Combines base classes, variant classes, and size classes.
 */
export const anchorVariants = cva(LINK_BASE_CLASSES, {
	variants: {
		variant: {
			default: LINK_VARIANT_CLASSES.default,
			subtle: LINK_VARIANT_CLASSES.subtle,
			muted: LINK_VARIANT_CLASSES.muted,
		} satisfies Record<LinkVariant, string>,
		size: {
			sm: LINK_SIZE_CLASSES.sm,
			md: LINK_SIZE_CLASSES.md,
			lg: LINK_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		variant: 'default',
		size: 'md',
	},
});

/**
 * Type for anchor variant props
 * Extracted from anchorVariants using VariantProps
 */
export type AnchorVariants = VariantProps<typeof anchorVariants>;

/**
 * Helper function to get anchor class names with proper merging
 *
 * @param props - Anchor variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getAnchorVariantClasses(
	props: AnchorVariants & { className?: string | undefined }
): string {
	return twMerge(anchorVariants(props), props.className);
}

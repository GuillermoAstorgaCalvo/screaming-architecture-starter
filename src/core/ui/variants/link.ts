import {
	LINK_BASE_CLASSES,
	LINK_SIZE_CLASSES,
	LINK_VARIANT_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import type { LinkVariant } from '@src-types/ui/navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Link variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Link component.
 * Combines base classes, variant classes, and size classes.
 */
export const linkVariants = cva(LINK_BASE_CLASSES, {
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
 * Type for link variant props
 * Extracted from linkVariants using VariantProps
 */
export type LinkVariants = VariantProps<typeof linkVariants>;

/**
 * Helper function to get link class names with proper merging
 *
 * @param props - Link variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getLinkVariantClasses(
	props: LinkVariants & { className?: string | undefined }
): string {
	return twMerge(linkVariants(props), props.className);
}

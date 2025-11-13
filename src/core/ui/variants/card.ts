import {
	CARD_BASE_CLASSES,
	CARD_PADDING_CLASSES,
	CARD_VARIANT_CLASSES,
} from '@core/constants/ui/display/card';
import type { StandardSize } from '@src-types/ui/base';
import type { CardVariant } from '@src-types/ui/layout/card';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Card variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Card component.
 * Combines base classes, variant classes, and padding classes.
 */
export const cardVariants = cva(CARD_BASE_CLASSES, {
	variants: {
		variant: {
			elevated: CARD_VARIANT_CLASSES.elevated,
			outlined: CARD_VARIANT_CLASSES.outlined,
			flat: CARD_VARIANT_CLASSES.flat,
		} satisfies Record<CardVariant, string>,
		padding: {
			sm: CARD_PADDING_CLASSES.sm,
			md: CARD_PADDING_CLASSES.md,
			lg: CARD_PADDING_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
	},
	defaultVariants: {
		variant: 'elevated',
		padding: 'md',
	},
});

/**
 * Type for card variant props
 * Extracted from cardVariants using VariantProps
 */
export type CardVariants = VariantProps<typeof cardVariants>;

/**
 * Helper function to get card class names with proper merging
 *
 * @param props - Card variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getCardVariantClasses(
	props: CardVariants & { className?: string | undefined }
): string {
	return twMerge(cardVariants(props), props.className);
}

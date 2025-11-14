/**
 * Card display constants
 * Uses design tokens for colors, spacing, and shadows
 */
import type { StandardSize } from '@src-types/ui/base';
import type { CardVariant } from '@src-types/ui/layout/card';

export const CARD_BASE_CLASSES =
	'rounded-lg border bg-surface transition-shadow dark:bg-surface-dark';

export const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
	elevated: 'border-border shadow-md hover:shadow-lg dark:border-border-dark dark:shadow-lg',
	outlined: 'border-border dark:border-border-dark',
	flat: 'border-transparent shadow-sm dark:shadow-sm',
} as const;

export const CARD_PADDING_CLASSES: Record<StandardSize, string> = {
	sm: 'p-sm',
	md: 'p-md',
	lg: 'p-lg',
} as const;

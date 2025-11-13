/**
 * Card display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { CardVariant } from '@src-types/ui/layout/card';

export const CARD_BASE_CLASSES = 'rounded-lg border bg-white transition-shadow dark:bg-gray-800';

export const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
	elevated:
		'border-gray-200 shadow-md hover:shadow-lg dark:border-gray-700 dark:shadow-gray-900/50',
	outlined: 'border-gray-300 dark:border-gray-600',
	flat: 'border-transparent shadow-sm dark:shadow-gray-900/30',
} as const;

export const CARD_PADDING_CLASSES: Record<StandardSize, string> = {
	sm: 'p-3',
	md: 'p-4',
	lg: 'p-6',
} as const;

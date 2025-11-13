/**
 * Stat card display constants
 */
import type { StandardSize } from '@src-types/ui/base';

export const STAT_CARD_BASE_CLASSES = 'flex flex-col gap-2';

export const STAT_CARD_VALUE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-2xl font-bold',
	md: 'text-3xl font-bold',
	lg: 'text-4xl font-bold',
} as const;

export const STAT_CARD_LABEL_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

export const STAT_CARD_TREND_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

export const STAT_CARD_ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-8 h-8',
	md: 'w-10 h-10',
	lg: 'w-12 h-12',
} as const;

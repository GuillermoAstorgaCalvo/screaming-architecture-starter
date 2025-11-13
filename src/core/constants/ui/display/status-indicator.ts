/**
 * Status indicator display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { StatusIndicatorStatus } from '@src-types/ui/feedback';

import { BADGE_SIZE_CLASSES } from './badge';

export const STATUS_INDICATOR_BASE_CLASSES = 'inline-flex items-center gap-1.5 transition-colors';

export const STATUS_INDICATOR_STATUS_CLASSES: Record<StatusIndicatorStatus, string> = {
	online: 'bg-green-500 dark:bg-green-400',
	offline: 'bg-gray-400 dark:bg-gray-500',
	busy: 'bg-red-500 dark:bg-red-400',
	away: 'bg-yellow-500 dark:bg-yellow-400',
} as const;

export const STATUS_INDICATOR_DOT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-2 h-2',
	md: 'w-2.5 h-2.5',
	lg: 'w-3 h-3',
} as const;

export const STATUS_INDICATOR_BADGE_BASE_CLASSES =
	'rounded-full font-medium inline-flex items-center gap-1.5';

export const STATUS_INDICATOR_BADGE_SIZE_CLASSES: Record<StandardSize, string> = BADGE_SIZE_CLASSES;

export const STATUS_INDICATOR_BADGE_STATUS_CLASSES: Record<StatusIndicatorStatus, string> = {
	online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
	busy: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	away: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
} as const;

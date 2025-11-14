/**
 * Status indicator display constants
 * Uses design tokens for colors
 */
import type { StandardSize } from '@src-types/ui/base';
import type { StatusIndicatorStatus } from '@src-types/ui/feedback';

import { BADGE_SIZE_CLASSES } from './badge';

export const STATUS_INDICATOR_BASE_CLASSES = 'inline-flex items-center gap-1.5 transition-colors';

export const STATUS_INDICATOR_STATUS_CLASSES: Record<StatusIndicatorStatus, string> = {
	online: 'bg-success dark:bg-success-dark',
	offline: 'bg-secondary dark:bg-secondary-dark',
	busy: 'bg-destructive dark:bg-destructive-dark',
	away: 'bg-warning dark:bg-warning-dark',
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
	online: 'bg-success-light text-success-dark dark:bg-success-dark dark:text-success-light',
	offline: 'bg-muted text-text-primary dark:bg-muted-dark dark:text-text-primary-dark',
	busy: 'bg-destructive-light text-destructive-dark dark:bg-destructive-dark dark:text-destructive-light',
	away: 'bg-warning-light text-warning-dark dark:bg-warning-dark dark:text-warning-light',
} as const;

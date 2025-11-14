/**
 * Progress and meter display constants
 * Uses design tokens for colors
 */
import type { StandardSize } from '@src-types/ui/base';

export const PROGRESS_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-muted dark:bg-muted-dark';

/**
 * Progress bar base classes
 * Uses design tokens for transitions
 */
export const PROGRESS_BAR_BASE_CLASSES =
	'h-full transition-all duration-slower ease-in-out bg-primary';

export const PROGRESS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

export const METER_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-muted dark:bg-muted-dark appearance-none [&::-webkit-meter-bar]:appearance-none [&::-webkit-meter-optimum-value]:appearance-none [&::-webkit-meter-suboptimum-value]:appearance-none [&::-webkit-meter-even-less-good-value]:appearance-none';

/**
 * Meter bar base classes
 * Uses design tokens for transitions
 */
export const METER_BAR_BASE_CLASSES = 'h-full transition-all duration-slower ease-in-out';

export const METER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

export const METER_VARIANT_CLASSES: Record<'default' | 'success' | 'warning' | 'error', string> = {
	default: 'bg-primary',
	success: 'bg-success dark:bg-success-dark',
	warning: 'bg-warning dark:bg-warning-dark',
	error: 'bg-destructive dark:bg-destructive-dark',
} as const;

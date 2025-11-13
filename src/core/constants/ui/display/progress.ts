/**
 * Progress and meter display constants
 */
import type { StandardSize } from '@src-types/ui/base';

export const PROGRESS_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700';

export const PROGRESS_BAR_BASE_CLASSES =
	'h-full transition-all duration-300 ease-in-out bg-primary';

export const PROGRESS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

export const METER_BASE_CLASSES =
	'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 appearance-none [&::-webkit-meter-bar]:appearance-none [&::-webkit-meter-optimum-value]:appearance-none [&::-webkit-meter-suboptimum-value]:appearance-none [&::-webkit-meter-even-less-good-value]:appearance-none';

export const METER_BAR_BASE_CLASSES = 'h-full transition-all duration-300 ease-in-out';

export const METER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-1',
	md: 'h-2',
	lg: 'h-3',
} as const;

export const METER_VARIANT_CLASSES: Record<'default' | 'success' | 'warning' | 'error', string> = {
	default: 'bg-primary',
	success: 'bg-green-500 dark:bg-green-600',
	warning: 'bg-yellow-500 dark:bg-yellow-600',
	error: 'bg-red-500 dark:bg-red-600',
} as const;

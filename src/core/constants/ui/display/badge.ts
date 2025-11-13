/**
 * Badge and Chip display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { BadgeVariant } from '@src-types/ui/feedback';

export const BADGE_BASE_CLASSES =
	'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

export const BADGE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2 py-0.5 text-xs',
	md: 'px-2.5 py-1 text-sm',
	lg: 'px-3 py-1.5 text-base',
} as const;

export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
	default: 'bg-gray-100 text-gray-800 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200',
	primary:
		'bg-primary text-primary-foreground focus:ring-primary dark:bg-primary dark:text-primary-foreground',
	success: 'bg-green-100 text-green-800 focus:ring-green-500 dark:bg-green-900 dark:text-green-200',
	warning:
		'bg-yellow-100 text-yellow-800 focus:ring-yellow-500 dark:bg-yellow-900 dark:text-yellow-200',
	error: 'bg-red-100 text-red-800 focus:ring-red-500 dark:bg-red-900 dark:text-red-200',
	info: 'bg-blue-100 text-blue-800 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-200',
} as const;

export const CHIP_BASE_CLASSES =
	'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

export const CHIP_SIZE_CLASSES: Record<StandardSize, string> = BADGE_SIZE_CLASSES;

export const CHIP_VARIANT_CLASSES: Record<BadgeVariant, string> = BADGE_VARIANT_CLASSES;

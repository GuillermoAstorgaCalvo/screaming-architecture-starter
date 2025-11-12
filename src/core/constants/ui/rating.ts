/**
 * Rating component constants
 * Constants for Rating/StarRating component
 */

import type { StandardSize } from '@src-types/ui/base';

/**
 * Rating base classes
 */
export const RATING_BASE_CLASSES = 'inline-flex items-center gap-1';

/**
 * Rating size classes (star size)
 */
export const RATING_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

/**
 * Rating star filled classes
 */
export const RATING_STAR_FILLED_CLASSES = 'text-yellow-400 dark:text-yellow-500 transition-colors';

/**
 * Rating star empty classes
 */
export const RATING_STAR_EMPTY_CLASSES = 'text-gray-300 dark:text-gray-600 transition-colors';

/**
 * Rating star interactive classes
 */
export const RATING_STAR_INTERACTIVE_CLASSES =
	'cursor-pointer hover:text-yellow-400 dark:hover:text-yellow-500';

/**
 * Rating star disabled classes
 */
export const RATING_STAR_DISABLED_CLASSES = 'cursor-not-allowed opacity-50';

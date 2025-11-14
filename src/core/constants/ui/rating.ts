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
 * Uses design tokens for colors (warning color for stars)
 */
export const RATING_STAR_FILLED_CLASSES = 'text-warning dark:text-warning-dark transition-colors';

/**
 * Rating star empty classes
 * Uses design tokens for colors
 */
export const RATING_STAR_EMPTY_CLASSES = 'text-muted dark:text-muted-dark transition-colors';

/**
 * Rating star interactive classes
 * Uses design tokens for colors
 */
export const RATING_STAR_INTERACTIVE_CLASSES =
	'cursor-pointer hover:text-warning dark:hover:text-warning-dark';

/**
 * Rating star disabled classes
 */
export const RATING_STAR_DISABLED_CLASSES = 'cursor-not-allowed opacity-50';

/**
 * Data display component constants
 * Constants for Table, Pagination, and Avatar components
 */

import type { StandardSize } from '@src-types/ui/base';
import type { AvatarSize, AvatarVariant } from '@src-types/ui/feedback';

/**
 * Table base classes
 */
export const TABLE_BASE_CLASSES = 'w-full border-collapse';

/**
 * Table size classes (padding for cells)
 */
export const TABLE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2 py-1 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
} as const;

/**
 * Table header base classes
 */
export const TABLE_HEADER_BASE_CLASSES =
	'bg-gray-50 font-semibold text-left text-gray-900 dark:bg-gray-800 dark:text-gray-100';

/**
 * Table row base classes
 */
export const TABLE_ROW_BASE_CLASSES =
	'border-b border-gray-200 transition-colors dark:border-gray-700';

/**
 * Table row striped classes
 */
export const TABLE_ROW_STRIPED_CLASSES = 'even:bg-gray-50 dark:even:bg-gray-800/50';

/**
 * Table row hover classes
 */
export const TABLE_ROW_HOVER_CLASSES = 'hover:bg-gray-100 dark:hover:bg-gray-700/50';

/**
 * Table cell base classes
 */
export const TABLE_CELL_BASE_CLASSES = 'text-gray-900 dark:text-gray-100';

/**
 * Pagination base classes
 */
export const PAGINATION_BASE_CLASSES = 'flex items-center justify-center gap-1 flex-wrap';

/**
 * Pagination button base classes
 */
export const PAGINATION_BUTTON_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Pagination button size classes (padding + text size)
 */
export const PAGINATION_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2 py-1 text-sm min-w-[2rem]',
	md: 'px-3 py-1.5 text-base min-w-[2.5rem]',
	lg: 'px-4 py-2 text-lg min-w-[3rem]',
} as const;

/**
 * Pagination button variant classes
 */
export const PAGINATION_BUTTON_VARIANT_CLASSES = {
	active:
		'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90',
	inactive:
		'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
} as const;

/**
 * Avatar base classes
 */
export const AVATAR_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium text-white bg-gray-400 overflow-hidden flex-shrink-0';

/**
 * Avatar size classes (width + height + text size)
 */
export const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
	xs: 'w-6 h-6 text-xs',
	sm: 'w-8 h-8 text-sm',
	md: 'w-10 h-10 text-base',
	lg: 'w-12 h-12 text-lg',
	xl: 'w-16 h-16 text-xl',
	'2xl': 'w-24 h-24 text-2xl',
} as const;

/**
 * Avatar variant classes
 */
export const AVATAR_VARIANT_CLASSES: Record<AvatarVariant, string> = {
	circle: 'rounded-full',
	square: 'rounded-none',
	rounded: 'rounded-md',
} as const;

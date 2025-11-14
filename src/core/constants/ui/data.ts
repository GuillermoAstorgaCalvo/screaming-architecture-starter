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
 * Uses design tokens for spacing
 */
export const TABLE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-xs py-0.5 text-sm',
	md: 'px-md py-sm text-base',
	lg: 'px-xl py-md text-lg',
} as const;

/**
 * Table header base classes
 * Uses design tokens for colors
 */
export const TABLE_HEADER_BASE_CLASSES =
	'bg-muted font-semibold text-left text-text-primary dark:bg-muted-dark dark:text-text-primary-dark';

/**
 * Table row base classes
 * Uses design tokens for colors
 */
export const TABLE_ROW_BASE_CLASSES =
	'border-b border-border transition-colors dark:border-border-dark';

/**
 * Table row striped classes
 * Uses design tokens for colors
 */
export const TABLE_ROW_STRIPED_CLASSES = 'even:bg-muted dark:even:bg-muted-dark/50';

/**
 * Table row hover classes
 * Uses design tokens for colors
 */
export const TABLE_ROW_HOVER_CLASSES = 'hover:bg-muted dark:hover:bg-muted-dark/50';

/**
 * Table cell base classes
 * Uses design tokens for colors
 */
export const TABLE_CELL_BASE_CLASSES = 'text-text-primary dark:text-text-primary-dark';

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
 * Uses design tokens for spacing and customizable min-width
 */
export const PAGINATION_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-xs py-0.5 text-sm min-w-[calc(var(--spacing-lg)*2)]',
	md: 'px-sm py-xs text-base min-w-[calc(var(--spacing-lg)*2.5)]',
	lg: 'px-md py-sm text-lg min-w-[calc(var(--spacing-lg)*3)]',
} as const;

/**
 * Pagination button variant classes
 * Uses design tokens for colors
 */
export const PAGINATION_BUTTON_VARIANT_CLASSES = {
	active:
		'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90',
	inactive:
		'bg-surface text-text-secondary hover:bg-muted dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:bg-muted-dark',
} as const;

/**
 * Avatar base classes
 * Uses design tokens for colors
 */
export const AVATAR_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium text-text-on-primary bg-secondary overflow-hidden flex-shrink-0';

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

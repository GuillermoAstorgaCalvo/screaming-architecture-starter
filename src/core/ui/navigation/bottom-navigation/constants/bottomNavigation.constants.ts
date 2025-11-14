import { componentZIndex } from '@core/ui/theme/tokens';

/**
 * Bottom navigation base classes
 * Uses design tokens for colors and borders
 * Note: z-index is applied via inline style using componentZIndex.fixed
 */
export const BOTTOM_NAV_BASE_CLASSES =
	'fixed bottom-0 left-0 right-0 bg-surface border-t border-border dark:bg-surface dark:border-border';

/**
 * Bottom navigation z-index value from design tokens
 *
 * @internal
 */
export const BOTTOM_NAV_Z_INDEX = componentZIndex.fixed;

/**
 * Bottom navigation container classes
 * Uses design tokens for spacing and customizable height (h-16 = 64px = spacing-4xl)
 */
export const BOTTOM_NAV_CONTAINER_CLASSES =
	'flex items-center justify-around h-[var(--spacing-4xl)] px-sm safe-area-bottom';

/**
 * Bottom navigation item base classes
 * Uses design tokens for spacing and colors
 */
export const BOTTOM_NAV_ITEM_BASE_CLASSES =
	'flex flex-col items-center justify-center min-w-0 flex-1 h-full px-sm py-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-disabled disabled:cursor-not-allowed';

/**
 * Bottom navigation item active classes
 */
export const BOTTOM_NAV_ITEM_ACTIVE_CLASSES = 'text-primary dark:text-primary';

/**
 * Bottom navigation item inactive classes
 */
export const BOTTOM_NAV_ITEM_INACTIVE_CLASSES =
	'text-text-muted hover:text-text-primary hover:bg-muted dark:text-text-muted dark:hover:text-text-primary dark:hover:bg-muted-dark';

/**
 * Bottom navigation item size classes
 * Uses design tokens for spacing where possible
 * Note: gap-1.5 (6px) uses closest token (gap-xs = 4px) for consistency
 */
export const BOTTOM_NAV_ITEM_SIZE_CLASSES = {
	sm: 'text-xs gap-xs',
	md: 'text-sm gap-xs',
	lg: 'text-base gap-sm',
} as const;

/**
 * Badge classes
 * Uses design tokens for colors and spacing
 * Note: min-w-[1.25rem] and h-5 are component-specific sizes that use design tokens where possible
 */
export const BADGE_CLASSES =
	'absolute -top-xs -right-xs min-w-[calc(var(--spacing-lg)*1.25)] h-[calc(var(--spacing-lg)*1.25)] px-xs flex items-center justify-center text-xs font-medium rounded-full bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground';

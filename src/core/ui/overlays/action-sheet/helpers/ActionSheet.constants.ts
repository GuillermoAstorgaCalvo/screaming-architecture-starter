import { componentZIndex } from '@core/ui/theme/tokens';

/**
 * Action Sheet base classes
 * Uses design tokens for z-index, spacing, and colors
 */
export const ACTION_SHEET_BASE_CLASSES =
	'fixed bottom-0 left-0 right-0 bg-background dark:bg-background-dark rounded-t-lg shadow-lg safe-area-bottom';

/**
 * Action Sheet z-index value from design tokens
 * Uses modal z-index for proper layering
 *
 * @internal
 */
export const ACTION_SHEET_Z_INDEX = componentZIndex.modal;

/**
 * Action Sheet container classes
 */
export const ACTION_SHEET_CONTAINER_CLASSES = 'max-h-[80vh] overflow-y-auto';

/**
 * Action Sheet title classes
 * Uses design tokens for spacing (px-lg = 16px, py-md = 12px)
 */
export const ACTION_SHEET_TITLE_CLASSES =
	'px-lg py-md text-sm font-semibold text-text-muted dark:text-text-muted border-b border-border dark:border-border-dark';

/**
 * Action Sheet action button base classes
 * Uses design tokens for spacing (px-lg = 16px, py-md = 12px, gap-md = 12px)
 */
export const ACTION_SHEET_ACTION_BASE_CLASSES =
	'w-full flex items-center gap-md px-lg py-md text-left text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:opacity-disabled disabled:cursor-not-allowed';

/**
 * Action Sheet action button default classes
 */
export const ACTION_SHEET_ACTION_DEFAULT_CLASSES =
	'text-text-primary hover:bg-muted dark:text-text-primary dark:hover:bg-muted-dark';

/**
 * Action Sheet action button destructive classes
 */
export const ACTION_SHEET_ACTION_DESTRUCTIVE_CLASSES =
	'text-error hover:bg-error/10 dark:text-error dark:hover:bg-error/20';

/**
 * Action Sheet cancel button classes
 * Uses design tokens for spacing (mx-lg = 16px, mb-lg = 16px, px-lg = 16px, py-md = 12px)
 */
export const ACTION_SHEET_CANCEL_CLASSES =
	'mt-sm mx-lg mb-lg px-lg py-md rounded-lg font-medium text-base bg-secondary text-secondary-foreground hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-secondary-dark dark:hover:bg-secondary';

/**
 * Action Sheet separator classes
 */
export const ACTION_SHEET_SEPARATOR_CLASSES = 'border-t border-border dark:border-border-dark';

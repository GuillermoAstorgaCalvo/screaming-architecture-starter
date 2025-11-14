import { componentZIndex } from '@core/ui/theme/tokens';
import type { StandardSize } from '@src-types/ui/base';
import type { FloatingActionButtonPosition } from '@src-types/ui/navigation/floatingActionButton';

/**
 * FAB position classes
 * Uses design tokens for spacing
 *
 * @internal
 */
export const FAB_POSITION_CLASSES: Record<FloatingActionButtonPosition, string> = {
	'bottom-right': 'fixed bottom-lg right-lg sm:bottom-xl sm:right-xl',
	'bottom-left': 'fixed bottom-lg left-lg sm:bottom-xl sm:left-xl',
	'top-right': 'fixed top-lg right-lg sm:top-xl sm:right-xl',
	'top-left': 'fixed top-lg left-lg sm:top-xl sm:left-xl',
} as const;

/**
 * FAB size classes for regular (non-extended) FAB
 *
 * @internal
 */
export const FAB_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-10 w-10 text-sm',
	md: 'h-14 w-14 text-base',
	lg: 'h-16 w-16 text-lg',
} as const;

/**
 * FAB variant classes
 *
 * @internal
 */
export const FAB_VARIANT_CLASSES = {
	primary:
		'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl dark:bg-primary dark:hover:bg-primary/90',
	secondary:
		'bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-lg hover:shadow-xl dark:bg-secondary-dark dark:hover:bg-secondary',
} as const;

/**
 * FAB base classes
 * Note: z-index is applied via inline style using componentZIndex.fixed
 *
 * @internal
 */
export const FAB_BASE_CLASSES =
	'inline-flex items-center justify-center rounded-full transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-disabled disabled:cursor-not-allowed';

/**
 * FAB z-index value from design tokens
 *
 * @internal
 */
export const FAB_Z_INDEX = componentZIndex.fixed;

/**
 * Extended FAB classes
 * Uses design tokens for spacing
 *
 * @internal
 */
export const FAB_EXTENDED_CLASSES = 'px-xl rounded-full';

/**
 * Extended FAB size classes
 * Uses design tokens for spacing where possible
 * Note: Height values (h-10, h-14, h-16) are component-specific sizes
 *
 * @internal
 */
export const FAB_EXTENDED_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-10 px-lg text-sm',
	md: 'h-14 px-xl text-base',
	lg: 'h-16 px-2xl text-lg',
} as const;

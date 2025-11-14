/**
 * Button component constants
 * Constants for Button and IconButton components
 */

import type { StandardSize } from '@src-types/ui/base';
import type { ButtonVariant, IconButtonVariant, ToggleVariant } from '@src-types/ui/buttons';

/**
 * Base classes for button components
 */
export const BUTTON_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Button variant classes
 * Uses semantic design tokens instead of hardcoded gray values
 */
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:bg-primary dark:hover:bg-primary/90',
	secondary:
		'bg-secondary text-secondary-foreground hover:bg-secondary-dark focus:ring-secondary dark:bg-secondary-dark dark:hover:bg-secondary',
	ghost:
		'bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:text-text-primary dark:hover:bg-muted-dark',
} as const;

/**
 * Button size classes (padding + text size)
 * Uses design tokens for spacing
 * Note: Original px-3 (12px) → px-md, px-4 (16px) → px-lg, px-6 (24px) → px-xl
 */
export const BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-md py-xs text-sm',
	md: 'px-lg py-sm text-base',
	lg: 'px-xl py-md text-lg',
} as const;

/**
 * Icon button size classes (height + width + padding)
 * Uses design tokens for spacing
 */
export const ICON_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4 p-xs',
	md: 'h-5 w-5 p-xs',
	lg: 'h-6 w-6 p-sm',
} as const;

/**
 * Icon button variant classes
 * Uses semantic design tokens instead of hardcoded gray values
 */
export const ICON_BUTTON_VARIANT_CLASSES: Record<IconButtonVariant, string> = {
	default:
		'text-text-muted hover:bg-muted hover:text-text-primary dark:hover:bg-muted-dark dark:hover:text-text-primary',
	ghost: 'text-text-secondary hover:bg-muted dark:text-text-muted dark:hover:bg-muted-dark',
} as const;

/**
 * Toggle base classes
 */
export const TOGGLE_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Toggle variant classes
 * Uses semantic design tokens instead of hardcoded gray values
 */
export const TOGGLE_VARIANT_CLASSES: Record<ToggleVariant, string> = {
	default:
		'bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:text-text-primary dark:hover:bg-muted-dark',
	outline:
		'border border-border bg-transparent text-text-primary hover:bg-muted focus:ring-border dark:border-border dark:text-text-primary dark:hover:bg-muted-dark',
} as const;

/**
 * Toggle size classes (padding + text size)
 * Uses design tokens for spacing
 * Note: Original px-3 (12px) → px-md, px-4 (16px) → px-lg, px-6 (24px) → px-xl
 */
export const TOGGLE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-md py-xs text-sm',
	md: 'px-lg py-sm text-base',
	lg: 'px-xl py-md text-lg',
} as const;

/**
 * Toggle pressed state classes
 * Uses semantic design tokens instead of hardcoded gray values
 */
export const TOGGLE_PRESSED_CLASSES =
	'bg-secondary-light text-text-primary dark:bg-secondary-dark dark:text-secondary-foreground';

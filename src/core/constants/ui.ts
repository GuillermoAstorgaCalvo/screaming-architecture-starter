/**
 * UI component constants
 * Central source of truth for UI component class names and styling constants
 * Avoid hardcoding Tailwind classes elsewhere - use these constants instead
 *
 * Types for variants and sizes are imported from @src-types/ui
 */

import type { ButtonVariant, IconButtonVariant, ModalSize, StandardSize } from '@src-types/ui';

/**
 * Text size classes for text elements
 * Used by ErrorText, HelperText, and Label components
 */
export const TEXT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

/**
 * Size classes for icons (standardized as w-* h-*)
 * Used by all icon components
 */
export const ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
} as const;

/**
 * Base classes for button components
 */
export const BUTTON_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Button variant classes
 */
export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary dark:bg-primary dark:hover:bg-primary/90',
	secondary:
		'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
	ghost:
		'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
} as const;

/**
 * Button size classes (padding + text size)
 */
export const BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
} as const;

/**
 * Icon button size classes (height + width + padding)
 */
export const ICON_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4 p-1',
	md: 'h-5 w-5 p-1',
	lg: 'h-6 w-6 p-1.5',
} as const;

/**
 * Icon button variant classes
 */
export const ICON_BUTTON_VARIANT_CLASSES: Record<IconButtonVariant, string> = {
	default:
		'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300',
	ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
} as const;

/**
 * Input base classes
 */
export const INPUT_BASE_CLASSES =
	'w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';

/**
 * Input size classes (padding + text size)
 */
export const INPUT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2.5 py-1.5 text-sm',
	md: 'px-3 py-2 text-base',
	lg: 'px-4 py-2.5 text-lg',
} as const;

/**
 * Input error state classes
 */
export const INPUT_ERROR_CLASSES =
	'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400';

/**
 * Input normal state classes
 */
export const INPUT_NORMAL_CLASSES =
	'border-gray-300 focus:border-primary focus:ring-primary dark:border-gray-600 dark:focus:border-primary';

/**
 * Spinner size classes (height + width)
 */
export const SPINNER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-8 w-8',
	lg: 'h-12 w-12',
} as const;

/**
 * Modal size classes (max-width)
 */
export const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	full: 'max-w-full mx-4',
} as const;

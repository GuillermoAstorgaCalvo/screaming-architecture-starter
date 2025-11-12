/**
 * Form control component constants
 * Constants for Checkbox, Switch, and Radio components
 */

import type { StandardSize } from '@src-types/ui/base';

/**
 * Checkbox base classes
 */
export const CHECKBOX_BASE_CLASSES =
	'h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors dark:border-gray-600 dark:bg-gray-800';

/**
 * Checkbox size classes (height + width)
 */
export const CHECKBOX_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-3 w-3',
	md: 'h-4 w-4',
	lg: 'h-5 w-5',
} as const;

/**
 * Switch base classes
 */
export const SWITCH_BASE_CLASSES =
	'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

/**
 * Switch size classes (height + width)
 */
export const SWITCH_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-5 w-9',
	md: 'h-6 w-11',
	lg: 'h-7 w-14',
} as const;

/**
 * Switch checked state classes
 */
export const SWITCH_CHECKED_CLASSES = 'bg-primary';

/**
 * Switch unchecked state classes
 */
export const SWITCH_UNCHECKED_CLASSES = 'bg-gray-300 dark:bg-gray-600';

/**
 * Switch thumb (the moving circle) base classes
 */
export const SWITCH_THUMB_BASE_CLASSES =
	'inline-block h-4 w-4 transform rounded-full bg-white transition-transform';

/**
 * Switch thumb size classes
 */
export const SWITCH_THUMB_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-3 w-3',
	md: 'h-4 w-4',
	lg: 'h-5 w-5',
} as const;

/**
 * Switch thumb checked position classes
 */
export const SWITCH_THUMB_CHECKED_CLASSES: Record<StandardSize, string> = {
	sm: 'translate-x-5',
	md: 'translate-x-6',
	lg: 'translate-x-8',
} as const;

/**
 * Switch thumb unchecked position classes
 */
export const SWITCH_THUMB_UNCHECKED_CLASSES = 'translate-x-1';

/**
 * Radio base classes
 */
export const RADIO_BASE_CLASSES =
	'h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors dark:border-gray-600 dark:bg-gray-800';

/**
 * Radio size classes (height + width)
 */
export const RADIO_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-3 w-3',
	md: 'h-4 w-4',
	lg: 'h-5 w-5',
} as const;

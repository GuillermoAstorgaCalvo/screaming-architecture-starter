/**
 * Form input component constants
 * Constants for Input, Textarea, and Select components
 */

import type { StandardSize } from '@src-types/ui/base';

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
 * Textarea base classes (extends input but with resize handling)
 */
export const TEXTAREA_BASE_CLASSES =
	'w-full rounded-md border bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-y dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';

/**
 * Textarea size classes (padding + text size)
 */
export const TEXTAREA_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2.5 py-1.5 text-sm min-h-[80px]',
	md: 'px-3 py-2 text-base min-h-[100px]',
	lg: 'px-4 py-2.5 text-lg min-h-[120px]',
} as const;

/**
 * Textarea error state classes
 */

/**
 * Textarea normal state classes
 */

/**
 * Select base classes (similar to input)
 */
export const SELECT_BASE_CLASSES =
	'w-full rounded-md border bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-100 appearance-none cursor-pointer dark:border-gray-600';

/**
 * Select size classes (padding + text size)
 */
export const SELECT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-2.5 py-1.5 text-sm pr-8',
	md: 'px-3 py-2 text-base pr-10',
	lg: 'px-4 py-2.5 text-lg pr-12',
} as const;

/**
 * Select error state classes
 */

/**
 * Select normal state classes
 */

// Note: Import these constants directly from './shared'
// import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from './shared';
// const INPUT_ERROR_CLASSES = FORM_ERROR_CLASSES;
// const INPUT_NORMAL_CLASSES = FORM_NORMAL_CLASSES;
// const SELECT_ERROR_CLASSES = FORM_ERROR_CLASSES;
// const SELECT_NORMAL_CLASSES = FORM_NORMAL_CLASSES;
// const TEXTAREA_ERROR_CLASSES = FORM_ERROR_CLASSES;
// const TEXTAREA_NORMAL_CLASSES = FORM_NORMAL_CLASSES;

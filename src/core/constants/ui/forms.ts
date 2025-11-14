/**
 * Form input component constants
 * Constants for Input, Textarea, and Select components
 */

import type { StandardSize } from '@src-types/ui/base';

/**
 * Input base classes
 * Uses design tokens for colors, spacing, and radius
 */
export const INPUT_BASE_CLASSES =
	'w-full rounded-md border bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark';

/**
 * Input size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const INPUT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-sm py-xs text-sm',
	md: 'px-md py-sm text-base',
	lg: 'px-lg py-md text-lg',
} as const;

/**
 * Textarea base classes (extends input but with resize handling)
 * Uses design tokens for colors, spacing, and radius
 */
export const TEXTAREA_BASE_CLASSES =
	'w-full rounded-md border bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed resize-y dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark';

/**
 * Textarea size classes (padding + text size)
 * Uses design tokens for spacing and customizable min-height
 */
export const TEXTAREA_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-sm py-xs text-sm min-h-[calc(var(--spacing-4xl)+var(--spacing-2xl))]',
	md: 'px-md py-sm text-base min-h-[calc(var(--spacing-4xl)*1.5625)]',
	lg: 'px-lg py-md text-lg min-h-[calc(var(--spacing-4xl)*1.875)]',
} as const;

/**
 * Textarea error state classes
 */

/**
 * Textarea normal state classes
 */

/**
 * Select base classes (similar to input)
 * Uses design tokens for colors, spacing, and radius
 */
export const SELECT_BASE_CLASSES =
	'w-full rounded-md border bg-surface text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-surface-dark dark:text-text-primary-dark appearance-none cursor-pointer dark:border-border-dark';

/**
 * Select size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const SELECT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-sm py-xs text-sm pr-8',
	md: 'px-md py-sm text-base pr-10',
	lg: 'px-lg py-md text-lg pr-12',
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

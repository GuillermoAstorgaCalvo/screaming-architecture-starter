/**
 * Form input component constants
 * Constants for Input, Textarea, and Select components
 */

import type { StandardSize } from '@src-types/ui/base';

export const FORM_CONTROL_BASE_CLASSES =
	'w-full rounded-md border bg-surface text-text-primary placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-surface-dark dark:text-text-primary-dark dark:placeholder:text-text-muted-dark';

export const FORM_CONTROL_SIZE_CLASSES = {
	sm: 'px-sm py-xs text-sm',
	md: 'px-md py-sm text-base',
	lg: 'px-lg py-md text-lg',
} as const satisfies Record<StandardSize, string>;

/**
 * Input base classes
 * Uses design tokens for colors, spacing, and radius
 */
export const INPUT_BASE_CLASSES = FORM_CONTROL_BASE_CLASSES;

/**
 * Input size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const INPUT_SIZE_CLASSES = FORM_CONTROL_SIZE_CLASSES;

/**
 * Textarea base classes (extends input but with resize handling)
 * Uses design tokens for colors, spacing, and radius
 */
export const TEXTAREA_BASE_CLASSES = `${FORM_CONTROL_BASE_CLASSES} resize-y`;

/**
 * Textarea size classes (padding + text size)
 * Uses design tokens for spacing and customizable min-height
 */
export const TEXTAREA_SIZE_CLASSES = {
	sm: `${FORM_CONTROL_SIZE_CLASSES.sm} min-h-[calc(var(--spacing-4xl)+var(--spacing-2xl))]`,
	md: `${FORM_CONTROL_SIZE_CLASSES.md} min-h-[calc(var(--spacing-4xl)*1.5625)]`,
	lg: `${FORM_CONTROL_SIZE_CLASSES.lg} min-h-[calc(var(--spacing-4xl)*1.875)]`,
} as const satisfies Record<StandardSize, string>;

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
export const SELECT_SIZE_CLASSES = {
	sm: `${FORM_CONTROL_SIZE_CLASSES.sm} pr-8`,
	md: `${FORM_CONTROL_SIZE_CLASSES.md} pr-10`,
	lg: `${FORM_CONTROL_SIZE_CLASSES.lg} pr-12`,
} as const satisfies Record<StandardSize, string>;

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

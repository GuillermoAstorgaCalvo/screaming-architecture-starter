/**
 * Shared UI constants
 * Common size classes and form state classes used across multiple components
 */

import type { StandardSize } from '@src-types/ui/base';

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
 * Shared error state classes for form inputs (Input, Textarea, Select)
 * Uses design tokens for colors
 */
export const FORM_ERROR_CLASSES =
	'border-destructive focus:border-destructive focus:ring-destructive dark:border-destructive-dark dark:focus:border-destructive-dark';

/**
 * Shared normal state classes for form inputs (Input, Textarea, Select)
 * Uses design tokens for colors
 */
export const FORM_NORMAL_CLASSES =
	'border-border focus:border-primary focus:ring-primary dark:border-border-dark dark:focus:border-primary';

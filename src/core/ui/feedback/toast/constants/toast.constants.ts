import type { ToastIntent } from '@core/ui/feedback/toast/types/toast.types';

/**
 * Toast intent styles
 * Uses design tokens for colors
 */
export const TOAST_INTENT_STYLES: Record<ToastIntent, string> = {
	info: 'border-info/20 bg-info-light text-info-dark shadow-info/10 dark:border-info/40 dark:bg-info/10 dark:text-info',
	success:
		'border-success/20 bg-success-light text-success-dark shadow-success/10 dark:border-success/40 dark:bg-success/10 dark:text-success',
	warning:
		'border-warning/20 bg-warning-light text-warning-dark shadow-warning/10 dark:border-warning/40 dark:bg-warning/10 dark:text-warning',
	error:
		'border-destructive/20 bg-destructive-light text-destructive-dark shadow-destructive/10 dark:border-destructive/40 dark:bg-destructive/10 dark:text-destructive',
};

/**
 * Toast icon styles
 * Uses design tokens for colors
 */
export const TOAST_ICON_STYLES: Record<ToastIntent, string> = {
	info: 'bg-info/15 text-info-dark dark:text-info',
	success: 'bg-success/15 text-success-dark dark:text-success',
	warning: 'bg-warning/15 text-warning-dark dark:text-warning',
	error: 'bg-destructive/15 text-destructive-dark dark:text-destructive',
};

export const TOAST_ICON_SYMBOL: Record<ToastIntent, string> = {
	info: 'i',
	success: '✓',
	warning: '!',
	error: '!',
};

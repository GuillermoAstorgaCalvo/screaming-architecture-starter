import type { SnackbarIntent } from '@core/ui/feedback/snackbar/types/snackbar.types';

export const SNACKBAR_INTENT_STYLES: Record<SnackbarIntent, string> = {
	info: 'bg-info text-info-foreground dark:bg-info dark:text-info-foreground',
	success: 'bg-success text-success-foreground dark:bg-success dark:text-success-foreground',
	warning: 'bg-warning text-warning-foreground dark:bg-warning dark:text-warning-foreground',
	error:
		'bg-destructive text-destructive-foreground dark:bg-destructive dark:text-destructive-foreground',
};

/**
 * Snackbar position classes
 * Uses design tokens for spacing
 */
export const SNACKBAR_POSITION_CLASSES = {
	'bottom-left': 'bottom-md left-md',
	'bottom-center': 'bottom-md left-1/2 -translate-x-1/2',
	'bottom-right': 'bottom-md right-md',
} as const;

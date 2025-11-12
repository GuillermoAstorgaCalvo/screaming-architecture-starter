import type { SnackbarIntent } from './snackbar.types';

export const SNACKBAR_INTENT_STYLES: Record<SnackbarIntent, string> = {
	info: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900',
	success: 'bg-emerald-600 text-white dark:bg-emerald-500',
	warning: 'bg-amber-600 text-white dark:bg-amber-500',
	error: 'bg-rose-600 text-white dark:bg-rose-500',
};

export const SNACKBAR_POSITION_CLASSES = {
	'bottom-left': 'bottom-4 left-4',
	'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
	'bottom-right': 'bottom-4 right-4',
} as const;

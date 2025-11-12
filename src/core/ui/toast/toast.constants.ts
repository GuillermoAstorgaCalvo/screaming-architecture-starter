import type { ToastIntent } from './toast.types';

export const TOAST_INTENT_STYLES: Record<ToastIntent, string> = {
	info: 'border-sky-200 bg-sky-50 text-sky-900 shadow-sky-100 dark:border-sky-300/40 dark:bg-sky-950/60 dark:text-sky-50',
	success:
		'border-emerald-200 bg-emerald-50 text-emerald-900 shadow-emerald-100 dark:border-emerald-300/40 dark:bg-emerald-950/60 dark:text-emerald-50',
	warning:
		'border-amber-200 bg-amber-50 text-amber-900 shadow-amber-100 dark:border-amber-300/40 dark:bg-amber-950/60 dark:text-amber-50',
	error:
		'border-rose-200 bg-rose-50 text-rose-900 shadow-rose-100 dark:border-rose-300/40 dark:bg-rose-950/60 dark:text-rose-50',
};

export const TOAST_ICON_STYLES: Record<ToastIntent, string> = {
	info: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
	success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
	warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
	error: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
};

export const TOAST_ICON_SYMBOL: Record<ToastIntent, string> = {
	info: 'i',
	success: '✓',
	warning: '!',
	error: '!',
};

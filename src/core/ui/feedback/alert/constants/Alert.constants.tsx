import type { AlertIntent } from '@core/ui/feedback/alert/types/Alert.types';
import type { ReactNode } from 'react';

export const ALERT_INTENT_STYLES: Record<AlertIntent, string> = {
	info: 'border-info/20 bg-info-light text-info-dark dark:border-info/40 dark:bg-info/10 dark:text-info',
	success:
		'border-success/20 bg-success-light text-success-dark dark:border-success/40 dark:bg-success/10 dark:text-success',
	warning:
		'border-warning/20 bg-warning-light text-warning-dark dark:border-warning/40 dark:bg-warning/10 dark:text-warning',
	error:
		'border-destructive/20 bg-destructive-light text-destructive-dark dark:border-destructive/40 dark:bg-destructive/10 dark:text-destructive',
};

export const ALERT_INTENT_ICON_STYLES: Record<AlertIntent, string> = {
	info: 'text-info dark:text-info',
	success: 'text-success dark:text-success',
	warning: 'text-warning dark:text-warning',
	error: 'text-destructive dark:text-destructive',
};

export const ALERT_ICON_PATHS: Record<AlertIntent, ReactNode> = {
	success: (
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	),
	warning: (
		<>
			<path d="M9.04 3.163a1.5 1.5 0 012.92 0l6.112 12.223A1.5 1.5 0 0116.722 17H3.278a1.5 1.5 0 01-1.35-1.614L9.04 3.163z" />
			<path
				fill="currentColor"
				d="M10 12.5a.75.75 0 01.743.648l.007.102v1a.75.75 0 01-1.493.102L9.25 14.25v-1a.75.75 0 01.75-.75zm0-5a.75.75 0 01.743.648L10.75 8.25v3a.75.75 0 01-1.493.102L9.25 11.25v-3a.75.75 0 01.75-.75z"
			/>
		</>
	),
	error: (
		<path
			fillRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.828-10.828a1 1 0 10-1.414-1.414L10 7.586 8.586 6.172a1 1 0 10-1.414 1.414L8.586 9 7.172 10.414a1 1 0 101.414 1.414L10 10.414l1.414 1.414a1 1 0 001.414-1.414L11.414 9l1.414-1.414z"
			clipRule="evenodd"
		/>
	),
	info: (
		<path
			fillRule="evenodd"
			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-9-3a1 1 0 112 0v1a1 1 0 11-2 0V7zm0 3a1 1 0 000 2h.01a1 1 0 100-2H9z"
			clipRule="evenodd"
		/>
	),
};

export const DISMISS_ICON = (
	<svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
		<path
			fillRule="evenodd"
			d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
			clipRule="evenodd"
		/>
	</svg>
);

/**
 * Alert base classes
 * Uses design tokens for spacing
 */
export const ALERT_BASE_CLASSES =
	'flex w-full items-start gap-md rounded-lg border px-md py-md shadow-sm transition-shadow duration-normal focus-within:ring-2 focus-within:ring-offset-2';

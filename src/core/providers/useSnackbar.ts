import type { SnackbarIntent, SnackbarItem } from '@core/ui/snackbar/snackbar.types';
import { type ReactNode, useCallback, useContext } from 'react';

import { SnackbarContext } from './SnackbarContext';

export interface SnackbarOptions {
	readonly message: string | ReactNode;
	readonly intent?: SnackbarIntent;
	readonly autoDismiss?: boolean;
	readonly dismissAfter?: number;
	readonly action?: SnackbarItem['action'];
	readonly className?: string;
}

/**
 * Hook to access snackbar notification functions
 * @returns Snackbar functions: success, error, warning, info, and management functions
 * @throws Error if used outside SnackbarProvider
 *
 * @example
 * ```tsx
 * const snackbar = useSnackbar();
 *
 * snackbar.success('Operation completed');
 * snackbar.error('Something went wrong');
 * snackbar.info('New message received');
 * snackbar.warning('Please check your input');
 * ```
 */
export function useSnackbar() {
	const context = useContext(SnackbarContext);
	if (context === undefined) {
		throw new Error('useSnackbar must be used within a SnackbarProvider');
	}

	const { snackbars, addSnackbar, removeSnackbar, clearAll } = context;

	const showSnackbar = useCallback(
		(intent: SnackbarIntent, options: SnackbarOptions | string): string => {
			if (typeof options === 'string') {
				return addSnackbar({ intent, message: options });
			}
			return addSnackbar({ intent, ...options });
		},
		[addSnackbar]
	);

	const createIntentCallback = useCallback(
		(intent: SnackbarIntent) => (options: SnackbarOptions | string) =>
			showSnackbar(intent, options),
		[showSnackbar]
	);

	const success = createIntentCallback('success');
	const error = createIntentCallback('error');
	const warning = createIntentCallback('warning');
	const info = createIntentCallback('info');

	return {
		snackbars,
		success,
		error,
		warning,
		info,
		show: showSnackbar,
		dismiss: removeSnackbar,
		clear: clearAll,
	};
}

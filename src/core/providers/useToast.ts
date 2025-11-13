import type { ToastAction, ToastIntent } from '@core/ui/feedback/toast/types/toast.types';
import { type ReactNode, useCallback, useContext } from 'react';

import { ToastContext } from './ToastContext';

export interface ToastOptions {
	readonly title?: string;
	readonly description?: string | ReactNode;
	readonly children?: ReactNode;
	readonly className?: string;
	readonly dismissLabel?: string;
	readonly autoDismiss?: boolean;
	readonly dismissAfter?: number;
	readonly pauseOnHover?: boolean;
	readonly action?: ToastAction;
	readonly role?: 'status' | 'alert';
}

/**
 * Hook to access toast notification functions
 * @returns Toast functions: success, error, warning, info, and management functions
 * @throws Error if used outside ToastProvider
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * toast.success('Operation completed');
 * toast.error('Something went wrong');
 * toast.info('New message received');
 * toast.warning('Please check your input');
 * ```
 */
export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	const { toasts, addToast, removeToast, clearAll } = context;

	const showToast = useCallback(
		(intent: ToastIntent, options: ToastOptions | string = {}): string => {
			if (typeof options === 'string') {
				return addToast({ intent, title: options });
			}
			return addToast({ intent, ...options });
		},
		[addToast]
	);

	const createIntentCallback = useCallback(
		(intent: ToastIntent) => (options: ToastOptions | string) => showToast(intent, options),
		[showToast]
	);

	const success = createIntentCallback('success');
	const error = createIntentCallback('error');
	const warning = createIntentCallback('warning');
	const info = createIntentCallback('info');

	return {
		toasts,
		success,
		error,
		warning,
		info,
		show: showToast,
		dismiss: removeToast,
		clear: clearAll,
	};
}

import { ToastContext } from '@core/providers/toast/ToastContext';
import type { ToastAction, ToastIntent } from '@core/ui/feedback/toast/types/toast.types';
import { type ReactNode, useCallback, useContext, useMemo } from 'react';

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

	const intentFns = useMemo(
		() => ({
			success: (options: ToastOptions | string) => showToast('success', options),
			error: (options: ToastOptions | string) => showToast('error', options),
			warning: (options: ToastOptions | string) => showToast('warning', options),
			info: (options: ToastOptions | string) => showToast('info', options),
		}),
		[showToast]
	);

	return {
		toasts,
		...intentFns,
		show: showToast,
		dismiss: removeToast,
		clear: clearAll,
	};
}

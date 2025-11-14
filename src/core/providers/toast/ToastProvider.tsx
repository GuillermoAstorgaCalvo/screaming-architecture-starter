import { UI_TIMEOUTS } from '@core/constants/timeouts';
import {
	ToastContext,
	type ToastContextValue,
	type ToastItem,
} from '@core/providers/toast/ToastContext';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

export interface ToastProviderProps {
	readonly children: ReactNode;
	readonly maxToasts?: number;
	readonly defaultDismissAfter?: number;
	readonly defaultAutoDismiss?: boolean;
	readonly defaultPauseOnHover?: boolean;
}

const RADIX_BASE = 36;
const ID_SUBSTRING_START = 2;
const ID_SUBSTRING_END = 9;

function generateToastId(): string {
	return `toast-${Date.now()}-${Math.random().toString(RADIX_BASE).slice(ID_SUBSTRING_START, ID_SUBSTRING_END)}`;
}

interface ToastStateConfig {
	readonly maxToasts: number;
	readonly defaultAutoDismiss: boolean;
	readonly defaultDismissAfter: number;
	readonly defaultPauseOnHover: boolean;
}

function useToastState(config: ToastStateConfig) {
	const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

	const addToast = useCallback(
		(toast: Omit<ToastItem, 'id'>): string => {
			const id = generateToastId();
			const newToast: ToastItem = {
				...toast,
				id,
				autoDismiss: toast.autoDismiss ?? config.defaultAutoDismiss,
				dismissAfter: toast.dismissAfter ?? config.defaultDismissAfter,
				pauseOnHover: toast.pauseOnHover ?? config.defaultPauseOnHover,
			};

			setToasts(prev => {
				const updated = [...prev, newToast];
				return updated.slice(-config.maxToasts);
			});

			return id;
		},
		[config]
	);

	const removeToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	}, []);

	const clearAll = useCallback(() => {
		setToasts([]);
	}, []);

	return { toasts, addToast, removeToast, clearAll };
}

/**
 * ToastProvider - Provides toast notification queue management
 *
 * Manages a queue of toast notifications with automatic dismissal,
 * stacking, and positioning. Provides toast management functions
 * via the useToast hook.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
	children,
	maxToasts = 5,
	defaultDismissAfter = UI_TIMEOUTS.TOAST_DELAY,
	defaultAutoDismiss = true,
	defaultPauseOnHover = true,
}: ToastProviderProps) {
	const { toasts, addToast, removeToast, clearAll } = useToastState({
		maxToasts,
		defaultAutoDismiss,
		defaultDismissAfter,
		defaultPauseOnHover,
	});

	const value: ToastContextValue = useMemo(
		() => ({
			toasts,
			addToast,
			removeToast,
			clearAll,
		}),
		[toasts, addToast, removeToast, clearAll]
	);

	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

ToastProvider.displayName = 'ToastProvider';

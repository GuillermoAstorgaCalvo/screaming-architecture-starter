import type { ToastAction, ToastIntent } from '@core/ui/toast/toast.types';
import { createContext, type ReactNode } from 'react';

export interface ToastItem {
	readonly id: string;
	readonly intent?: ToastIntent;
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

export interface ToastContextValue {
	readonly toasts: readonly ToastItem[];
	readonly addToast: (toast: Omit<ToastItem, 'id'>) => string;
	readonly removeToast: (id: string) => void;
	readonly clearAll: () => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

ToastContext.displayName = 'ToastContext';

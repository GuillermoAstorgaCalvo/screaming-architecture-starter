import type { ReactNode } from 'react';

export type ToastIntent = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
	readonly label: string;
	readonly onClick: () => void;
	readonly icon?: ReactNode;
	readonly variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ToastProps {
	readonly id?: string;
	readonly intent?: ToastIntent;
	readonly title?: string;
	readonly description?: string | ReactNode;
	readonly children?: ReactNode;
	readonly isOpen: boolean;
	readonly className?: string;
	readonly onDismiss?: () => void;
	readonly dismissLabel?: string;
	readonly autoDismiss?: boolean;
	readonly dismissAfter?: number;
	readonly pauseOnHover?: boolean;
	readonly action?: ToastAction;
	readonly role?: 'status' | 'alert';
}

export interface ToastContentProps {
	readonly title?: string | undefined;
	readonly description?: string | ReactNode | undefined;
	readonly children?: ReactNode | undefined;
	readonly action?: ToastAction | undefined;
}

export interface ToastDismissButtonProps {
	readonly onDismiss: () => void;
	readonly dismissLabel: string;
}

export interface ToastContainerProps {
	readonly id?: string | undefined;
	readonly role: 'status' | 'alert';
	readonly intent: ToastIntent;
	readonly className?: string | undefined;
	readonly onMouseEnter?: (() => void) | undefined;
	readonly onMouseLeave?: (() => void) | undefined;
	readonly children: ReactNode;
}

export interface ToastBodyProps {
	readonly intent: ToastIntent;
	readonly title?: string | undefined;
	readonly description?: string | ReactNode | undefined;
	readonly children?: ReactNode | undefined;
	readonly action?: ToastAction | undefined;
	readonly onDismiss?: (() => void) | undefined;
	readonly dismissLabel: string;
}

export interface ToastIconProps {
	readonly intent: ToastIntent;
}

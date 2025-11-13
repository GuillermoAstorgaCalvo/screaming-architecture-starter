import type { ReactNode } from 'react';

/**
 * Snackbar intent types
 */
export type SnackbarIntent = 'info' | 'success' | 'warning' | 'error';

/**
 * Snackbar position types
 */
export type SnackbarPosition = 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Snackbar component props
 */
export interface SnackbarProps {
	/** Whether the snackbar is open */
	readonly isOpen: boolean;
	/** Function to close the snackbar */
	readonly onDismiss?: () => void;
	/** Snackbar message/content */
	readonly message: string | ReactNode;
	/** Snackbar intent/variant @default 'info' */
	readonly intent?: SnackbarIntent;
	/** Additional CSS classes */
	readonly className?: string;
	/** Whether to auto-dismiss @default true */
	readonly autoDismiss?: boolean;
	/** Time in milliseconds before auto-dismissing @default 4000 */
	readonly dismissAfter?: number;
	/** Optional action button */
	readonly action?: {
		readonly label: string;
		readonly onClick: () => void;
	};
}

/**
 * Snackbar item for provider context
 */
export interface SnackbarItem {
	readonly id: string;
	readonly message: string | ReactNode;
	readonly intent: SnackbarIntent;
	readonly autoDismiss?: boolean;
	readonly dismissAfter?: number;
	readonly action?: SnackbarProps['action'];
	readonly className?: string;
}

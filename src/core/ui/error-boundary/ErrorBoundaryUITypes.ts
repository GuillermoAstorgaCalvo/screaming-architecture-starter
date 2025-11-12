import type { ReactNode } from 'react';

/**
 * ErrorBoundaryUI variant options
 */
export type ErrorBoundaryUIVariant = 'default' | 'minimal' | 'detailed';

/**
 * ErrorBoundaryUI component props
 */
export interface ErrorBoundaryUIProps {
	/** The error object to display */
	readonly error: Error | null;
	/** Callback function to retry/reset the error state */
	readonly onRetry?: () => void;
	/** UI variant style @default 'default' */
	readonly variant?: ErrorBoundaryUIVariant;
	/** Custom title text. If not provided, uses default title */
	readonly title?: string;
	/** Custom description text. If not provided, uses default description */
	readonly description?: string;
	/** Custom icon. Can be a ReactNode or icon name string. If not provided, uses default error icon */
	readonly icon?: ReactNode | string;
	/** Whether to show the retry button @default true */
	readonly showRetry?: boolean;
	/** Label for the retry button @default 'Try again' */
	readonly retryLabel?: string;
	/** Whether to show the home link @default true */
	readonly showHomeLink?: boolean;
	/** Label for the home link @default 'Go to Home' */
	readonly homeLinkLabel?: string;
	/** Route path for the home link @default ROUTES.HOME */
	readonly homeLinkTo?: string;
	/** Whether to show error details (stack trace, etc.). Only shown in development by default */
	readonly showErrorDetails?: boolean;
	/** Custom className for the main container */
	readonly className?: string;
	/** Custom action buttons or elements to render */
	readonly customActions?: ReactNode;
	/** Additional content to render between description and actions */
	readonly children?: ReactNode;
}

/**
 * Options for rendering error boundary actions
 */
export interface RenderActionsOptions {
	readonly onRetry: (() => void) | undefined;
	readonly showRetry: boolean;
	readonly retryLabel: string;
	readonly showHomeLink: boolean;
	readonly homeLinkLabel: string;
	readonly homeLinkTo: string;
	readonly customActions: ReactNode | undefined;
}

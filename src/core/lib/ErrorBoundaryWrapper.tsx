import { ErrorBoundary } from '@core/lib/ErrorBoundary';
import { useLogger } from '@core/providers/useLogger';
import ErrorBoundaryUI from '@core/ui/error-boundary/ErrorBoundaryUI';
import type { ErrorBoundaryUIProps } from '@core/ui/error-boundary/ErrorBoundaryUITypes';
import { type ReactNode, useMemo } from 'react';

interface ErrorBoundaryWrapperProps {
	readonly children: ReactNode;
	/** Custom fallback UI. If provided, this will be used instead of ErrorBoundaryUI */
	readonly fallback?: ReactNode;
	/** Props for ErrorBoundaryUI component. Only used if fallback is not provided */
	readonly uiProps?: Omit<ErrorBoundaryUIProps, 'error' | 'onRetry'>;
}

interface ErrorBoundaryFallbackProps {
	readonly error: Error | null;
	readonly onReset: () => void;
	readonly uiProps: Omit<ErrorBoundaryUIProps, 'error' | 'onRetry'> | undefined;
}

function ErrorBoundaryFallback({ error, onReset, uiProps }: ErrorBoundaryFallbackProps) {
	return <ErrorBoundaryUI error={error} onRetry={onReset} {...uiProps} />;
}

/**
 * Wrapper component for ErrorBoundary that injects logger from context
 *
 * Since ErrorBoundary is a class component and cannot use hooks,
 * this wrapper component provides the logger from LoggerProvider context.
 *
 * By default, uses ErrorBoundaryUI component for the error display.
 * You can customize it via uiProps or provide a completely custom fallback.
 *
 * @example
 * ```tsx
 * <ErrorBoundaryWrapper>
 *   <App />
 * </ErrorBoundaryWrapper>
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundaryWrapper
 *   uiProps={{
 *     variant: 'minimal',
 *     title: 'Oops!',
 *     description: 'Something went wrong.'
 *   }}
 * >
 *   <App />
 * </ErrorBoundaryWrapper>
 * ```
 */
export function ErrorBoundaryWrapper({ children, fallback, uiProps }: ErrorBoundaryWrapperProps) {
	const logger = useLogger();

	// Create a function fallback that uses ErrorBoundaryUI if no custom fallback is provided
	const errorFallback = useMemo(() => {
		if (fallback !== undefined) {
			return fallback;
		}

		// Return a function that ErrorBoundary can call with error and reset handler
		function createErrorFallback(error: Error | null, onReset: () => void) {
			return <ErrorBoundaryFallback error={error} onReset={onReset} uiProps={uiProps} />;
		}

		return createErrorFallback;
	}, [fallback, uiProps]);

	return (
		<ErrorBoundary logger={logger} fallback={errorFallback}>
			{children}
		</ErrorBoundary>
	);
}

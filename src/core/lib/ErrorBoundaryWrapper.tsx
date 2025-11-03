import { ErrorBoundary } from '@core/lib/ErrorBoundary';
import { useLogger } from '@core/providers/useLogger';
import type { ReactNode } from 'react';

interface ErrorBoundaryWrapperProps {
	readonly children: ReactNode;
	readonly fallback?: ReactNode;
}

/**
 * Wrapper component for ErrorBoundary that injects logger from context
 *
 * Since ErrorBoundary is a class component and cannot use hooks,
 * this wrapper component provides the logger from LoggerProvider context.
 */
export function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryWrapperProps) {
	const logger = useLogger();

	return (
		<ErrorBoundary logger={logger} fallback={fallback}>
			{children}
		</ErrorBoundary>
	);
}

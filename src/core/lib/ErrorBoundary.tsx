import { env } from '@core/config/env.client';
import { ROUTES } from '@core/config/routes';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

interface ErrorBoundaryProps {
	readonly children: ReactNode;
	readonly fallback?: ReactNode;
	readonly logger: LoggerPort;
}

/**
 * Global Error Boundary component
 * Catches React component errors and displays a fallback UI
 * Should wrap the entire app in App.tsx
 *
 * Note: logger must be provided as a prop since ErrorBoundary is a class component
 * and cannot use hooks. The logger should be injected via a wrapper component.
 *
 * Framework Dependencies:
 * This component is in `core/lib/` (not `core/utils/`) because it:
 * - Is a React component (requires React framework)
 * - Uses react-router-dom for navigation links
 * - Integrates with the React/DOM ecosystem
 *
 * See: src/core/README.md for distinction between `lib/` and `utils/`
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	override componentDidCatch(error: Error, errorInfo: { componentStack: string }): void {
		// Log error using the centralized logger
		this.props.logger.error('ErrorBoundary caught an error', error, {
			componentStack: errorInfo.componentStack,
			environment: env.DEV ? 'development' : 'production',
		});
	}

	handleReset = (): void => {
		this.setState({
			hasError: false,
			error: null,
		});
	};

	private renderDevErrorDetails(): ReactNode {
		if (!env.DEV || !this.state.error) {
			return null;
		}

		return (
			<div className="mt-6 rounded-lg bg-red-50 p-4 text-left dark:bg-red-900/20">
				<p className="font-mono text-sm text-red-800 dark:text-red-200">
					{this.state.error.toString()}
				</p>
				{this.state.error.stack ? (
					<pre className="mt-2 overflow-auto text-xs text-red-600 dark:text-red-300">
						{this.state.error.stack}
					</pre>
				) : null}
			</div>
		);
	}

	private renderErrorActions(): ReactNode {
		return (
			<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
				<button
					type="button"
					onClick={this.handleReset}
					aria-label="Try again to reload the application"
					className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-lg px-6 py-3 font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
				>
					Try again
				</button>
				<Link
					to={ROUTES.HOME}
					className="focus:ring-primary rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-800"
				>
					Go to Home
				</Link>
			</div>
		);
	}

	private renderErrorFallback(): ReactNode {
		if (this.props.fallback) {
			return this.props.fallback;
		}

		return (
			<main className="flex min-h-screen flex-col items-center justify-center p-6">
				<div className="max-w-md text-center">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
						Something went wrong
					</h1>
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
						We&apos;re sorry, but something unexpected happened.
					</p>
					{this.renderDevErrorDetails()}
					{this.renderErrorActions()}
				</div>
			</main>
		);
	}

	override render(): ReactNode {
		if (this.state.hasError) {
			return this.renderErrorFallback();
		}

		return this.props.children;
	}
}

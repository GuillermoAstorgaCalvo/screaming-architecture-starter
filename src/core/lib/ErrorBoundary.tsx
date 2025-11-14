import { env } from '@core/config/env.client';
import { ROUTES } from '@core/config/routes';
import i18n from '@core/i18n/i18n';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

type ErrorBoundaryFallback = ReactNode | ((error: Error | null, reset: () => void) => ReactNode);

interface ErrorBoundaryProps {
	readonly children: ReactNode;
	readonly fallback?: ErrorBoundaryFallback;
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
			<div className="mt-6 rounded-lg bg-destructive-light p-4 text-left dark:bg-destructive-dark/20">
				<p className="font-mono text-sm text-destructive dark:text-destructive-foreground">
					{this.state.error.toString()}
				</p>
				{this.state.error.stack ? (
					<pre className="mt-2 overflow-auto text-xs text-destructive dark:text-destructive-foreground/80">
						{this.state.error.stack}
					</pre>
				) : null}
			</div>
		);
	}

	private renderErrorActions(): ReactNode {
		const t = (key: string) => i18n.t(key, { ns: 'common' });
		const tryAgainLabel = t('errors.errorBoundary.tryAgain');
		const goToHomeLabel = t('errors.errorBoundary.goToHome');
		const tryAgainAriaLabel = t('errors.errorBoundary.tryAgainAriaLabel');

		return (
			<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
				<button
					type="button"
					onClick={this.handleReset}
					aria-label={tryAgainAriaLabel}
					className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary rounded-lg px-6 py-3 font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-surface"
				>
					{tryAgainLabel}
				</button>
				<Link
					to={ROUTES.HOME}
					className="focus:ring-primary rounded-lg border border-border px-6 py-3 font-medium text-text-primary hover:bg-muted focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-border dark:text-text-primary dark:hover:bg-muted dark:focus:ring-offset-surface"
				>
					{goToHomeLabel}
				</Link>
			</div>
		);
	}

	private renderErrorFallback(): ReactNode {
		if (this.props.fallback) {
			// Support both ReactNode and function fallback
			if (typeof this.props.fallback === 'function') {
				return this.props.fallback(this.state.error, this.handleReset);
			}
			return this.props.fallback;
		}

		const t = (key: string) => i18n.t(key, { ns: 'common' });
		const title = t('errors.errorBoundary.title');
		const description = t('errors.errorBoundary.description');

		return (
			<main className="flex min-h-screen flex-col items-center justify-center p-6">
				<div className="max-w-md text-center">
					<h1 className="text-4xl font-bold text-text-primary dark:text-text-primary">{title}</h1>
					<p className="mt-4 text-lg text-text-secondary dark:text-text-secondary">{description}</p>
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

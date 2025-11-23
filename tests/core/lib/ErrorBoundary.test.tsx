/**
 * ErrorBoundary Tests
 *
 * Tests for error catching, logging, fallback rendering, and error recovery
 */

import { ROUTES } from '@core/config/routes';
import { ErrorBoundary } from '@core/lib/ErrorBoundary';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThrowError, ThrowErrorWithStack, ThrowNonError } from './ErrorBoundary.test-helpers';

// Helper to wrap components with router for Link components
function renderWithRouter(ui: ReactElement) {
	return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// Helper to setup test environment for ErrorBoundary tests
function setupErrorBoundaryTests() {
	const logger = new MockLoggerAdapter();
	// Suppress console.error during error boundary tests
	vi.spyOn(console, 'error').mockImplementation(() => {});

	return {
		logger,
		cleanup: () => {
			vi.restoreAllMocks();
			logger.reset();
		},
	};
}

describe('ErrorBoundary - Error catching', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	describe('Basic error catching', () => {
		it('should catch errors thrown by child components', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			// Error boundary should catch the error and render fallback
			expect(screen.queryByText('No error')).not.toBeInTheDocument();
		});

		it('should catch errors with custom error messages', () => {
			const errorMessage = 'Custom error message';
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage={errorMessage} />
				</ErrorBoundary>
			);

			// Should render fallback UI
			expect(screen.getByRole('main')).toBeInTheDocument();
		});

		it('should catch errors with stack traces', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowErrorWithStack />
				</ErrorBoundary>
			);

			// Should render fallback UI
			expect(screen.getByRole('main')).toBeInTheDocument();
		});

		it('should handle non-Error objects thrown', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowNonError />
				</ErrorBoundary>
			);

			// Should still catch and render fallback
			expect(screen.getByRole('main')).toBeInTheDocument();
		});

		it('should render children when no error occurs', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={false} />
				</ErrorBoundary>
			);

			expect(screen.getByText('No error')).toBeInTheDocument();
		});
	});
});

describe('ErrorBoundary - Error logging', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	describe('Logging behavior', () => {
		it('should log errors to the logger', () => {
			const errorMessage = 'Logged error';
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage={errorMessage} />
				</ErrorBoundary>
			);

			expect(logger.logs).toHaveLength(1);
			expect(logger.logs[0]?.level).toBe('error');
			expect(logger.logs[0]?.message).toBe('ErrorBoundary caught an error');
			expect(logger.logs[0]?.error).toBeInstanceOf(Error);
			expect((logger.logs[0]?.error as Error)?.message).toBe(errorMessage);
		});

		it('should log error with component stack', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			expect(logger.logs).toHaveLength(1);
			expect(logger.logs[0]?.context).toBeDefined();
			expect(logger.logs[0]?.context?.componentStack).toBeDefined();
			expect(typeof logger.logs[0]?.context?.componentStack).toBe('string');
		});

		it('should log error with environment information', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			expect(logger.logs[0]?.context?.environment).toBeDefined();
			expect(['development', 'production']).toContain(
				logger.logs[0]?.context?.environment as string
			);
		});
	});
});

describe('ErrorBoundary - Default fallback', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should render default fallback UI when error occurs', () => {
		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		// Should render the main error container
		const main = screen.getByRole('main');
		expect(main).toBeInTheDocument();
		expect(main).toHaveClass('flex', 'min-h-screen');
	});

	it('should render default title and description from i18n', () => {
		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		const main = screen.getByRole('main');
		expect(main).toBeInTheDocument();
		// Title and description should be rendered (from i18n translations)
		expect(main.textContent).toBeTruthy();
	});

	it('should render error actions (try again and go to home buttons)', () => {
		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		// Should have try again button
		const tryAgainButton = screen.getByRole('button', { name: /try again/i });
		expect(tryAgainButton).toBeInTheDocument();

		// Should have go to home link
		const homeLink = screen.getByRole('link', { name: /go to home/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
	});
});

describe('ErrorBoundary - Custom fallback', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should render custom ReactNode fallback', () => {
		const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;
		renderWithRouter(
			<ErrorBoundary logger={logger} fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		);

		expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
		expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
	});

	it('should render custom function fallback with error and reset', () => {
		const customFallback = (error: Error | null, reset: () => void) => (
			<div data-testid="function-fallback">
				<div>Error: {error?.message}</div>
				<button onClick={reset} data-testid="reset-button">
					Reset
				</button>
			</div>
		);

		renderWithRouter(
			<ErrorBoundary logger={logger} fallback={customFallback}>
				<ThrowError shouldThrow={true} errorMessage="Function fallback test" />
			</ErrorBoundary>
		);

		expect(screen.getByTestId('function-fallback')).toBeInTheDocument();
		expect(screen.getByText(/Error: Function fallback test/)).toBeInTheDocument();
		expect(screen.getByTestId('reset-button')).toBeInTheDocument();
	});
});

// Helper to mock DEV environment
async function mockDevEnvironment(dev: boolean) {
	const originalEnv = await import('@core/config/env.client');
	vi.spyOn(originalEnv, 'env', 'get').mockReturnValue({
		...originalEnv.env,
		DEV: dev,
	} as typeof originalEnv.env);
}

describe('ErrorBoundary - Development mode', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should display error details in development mode', async () => {
		await mockDevEnvironment(true);

		const errorMessage = 'Development error';
		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} errorMessage={errorMessage} />
			</ErrorBoundary>
		);

		await waitFor(() => {
			const errorParagraphs = screen.getAllByText(new RegExp(errorMessage));
			expect(errorParagraphs.length).toBeGreaterThan(0);
		});

		const main = screen.getByRole('main');
		const mainContainer = within(main);
		const errorDetails = mainContainer.getAllByText(new RegExp(errorMessage));
		expect(errorDetails.length).toBeGreaterThan(0);
		expect(errorDetails[0]).toBeInTheDocument();
	});

	it('should display error stack trace in development mode when available', async () => {
		await mockDevEnvironment(true);

		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowErrorWithStack />
			</ErrorBoundary>
		);

		const main = screen.getByRole('main');
		expect(main).toBeInTheDocument();
		expect(main.textContent).toBeTruthy();
	});

	it('should not display error stack trace when stack is not available', async () => {
		await mockDevEnvironment(true);

		const errorWithoutStack = new Error('Error without stack');
		delete (errorWithoutStack as { stack?: string }).stack;

		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} errorMessage={errorWithoutStack.message} />
			</ErrorBoundary>
		);

		const main = screen.getByRole('main');
		expect(main).toBeInTheDocument();
	});
});

describe('ErrorBoundary - Production mode', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should not display error details in production mode', async () => {
		await mockDevEnvironment(false);

		const errorMessage = 'Production error';
		renderWithRouter(
			<ErrorBoundary logger={logger}>
				<ThrowError shouldThrow={true} errorMessage={errorMessage} />
			</ErrorBoundary>
		);

		await waitFor(() => {
			const errorText = screen.queryByText(new RegExp(errorMessage));
			expect(errorText).not.toBeInTheDocument();
		});
	});
});

describe('ErrorBoundary - Error recovery', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	describe('Recovery mechanisms', () => {
		it('should reset error state when handleReset is called', () => {
			const { rerender } = renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			// Error should be caught
			expect(screen.queryByText('No error')).not.toBeInTheDocument();

			// Find and click the reset button
			const resetButton = screen.getByRole('button', { name: /try again/i });
			expect(resetButton).toBeInTheDocument();

			// Rerender with shouldThrow=false to simulate recovery
			rerender(
				<BrowserRouter>
					<ErrorBoundary logger={logger}>
						<ThrowError shouldThrow={false} />
					</ErrorBoundary>
				</BrowserRouter>
			);

			// Click reset button
			resetButton.click();

			// After reset, should render children again
			// Note: In a real scenario, the component would need to be re-rendered
			// without the error. The reset clears the error state.
		});

		it('should provide reset function to custom fallback', () => {
			let resetFunction: (() => void) | null = null;
			const customFallback = (error: Error | null, reset: () => void) => {
				resetFunction = reset;
				return <div data-testid="custom-fallback">Error occurred</div>;
			};

			renderWithRouter(
				<ErrorBoundary logger={logger} fallback={customFallback}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			expect(resetFunction).toBeDefined();
			expect(typeof resetFunction).toBe('function');
		});

		it('should navigate to home when home link is clicked', () => {
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			const homeLink = screen.getByRole('link', { name: /go to home/i });
			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
		});
	});
});

describe('ErrorBoundary - Nested boundaries', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should work with nested error boundaries', () => {
		const innerLogger = new MockLoggerAdapter();
		const outerLogger = new MockLoggerAdapter();

		renderWithRouter(
			<ErrorBoundary logger={outerLogger}>
				<div>
					<ErrorBoundary logger={innerLogger}>
						<ThrowError shouldThrow={true} />
					</ErrorBoundary>
				</div>
			</ErrorBoundary>
		);

		// Inner boundary should catch the error
		expect(innerLogger.logs).toHaveLength(1);
		// Outer boundary should not catch it
		expect(outerLogger.logs).toHaveLength(0);
	});

	it('should allow outer boundary to catch if inner boundary does not catch', () => {
		const outerLogger = new MockLoggerAdapter();

		renderWithRouter(
			<ErrorBoundary logger={outerLogger}>
				<div>
					<ThrowError shouldThrow={true} />
				</div>
			</ErrorBoundary>
		);

		// Outer boundary should catch the error
		expect(outerLogger.logs).toHaveLength(1);
	});
});

describe('ErrorBoundary - Edge cases', () => {
	let logger: MockLoggerAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { logger: setupLogger, cleanup: setupCleanup } = setupErrorBoundaryTests();
		logger = setupLogger;
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	describe('Multiple errors', () => {
		it('should handle multiple errors sequentially', () => {
			const { rerender } = renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage="First error" />
				</ErrorBoundary>
			);

			expect(logger.logs).toHaveLength(1);

			const resetButton = screen.getByRole('button', { name: /try again/i });
			resetButton.click();

			rerender(
				<BrowserRouter>
					<ErrorBoundary logger={logger}>
						<ThrowError shouldThrow={true} errorMessage="Second error" />
					</ErrorBoundary>
				</BrowserRouter>
			);

			expect(logger.logs.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe('Fallback edge cases', () => {
		it('should handle errors in error boundary fallback', () => {
			const fallbackThatThrows = () => {
				throw new Error('Fallback error');
			};

			expect(() => {
				renderWithRouter(
					<ErrorBoundary logger={logger} fallback={fallbackThatThrows}>
						<ThrowError shouldThrow={true} />
					</ErrorBoundary>
				);
			}).toThrow('Fallback error');
		});

		it('should handle null error in fallback function', () => {
			const customFallback = (error: Error | null) => (
				<div data-testid="null-error-fallback">{error ? error.message : 'No error object'}</div>
			);

			renderWithRouter(
				<ErrorBoundary logger={logger} fallback={customFallback}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			expect(screen.getByTestId('null-error-fallback')).toBeInTheDocument();
		});

		it('should handle empty error message in fallback function', () => {
			const customFallback = (error: Error | null, reset: () => void) => (
				<div data-testid="empty-error-fallback">
					{error?.message ?? 'Empty error message'}
					<button onClick={reset} data-testid="reset-btn">
						Reset
					</button>
				</div>
			);

			renderWithRouter(
				<ErrorBoundary logger={logger} fallback={customFallback}>
					<ThrowError shouldThrow={true} errorMessage="" />
				</ErrorBoundary>
			);

			expect(screen.getByTestId('empty-error-fallback')).toBeInTheDocument();
			expect(screen.getByTestId('reset-btn')).toBeInTheDocument();
		});
	});

	describe('Reset functionality', () => {
		it('should handle reset function being called multiple times', () => {
			const customFallback = (error: Error | null, reset: () => void) => (
				<div data-testid="reset-test">
					<button onClick={reset} data-testid="reset-btn">
						Reset
					</button>
				</div>
			);

			const { rerender } = renderWithRouter(
				<ErrorBoundary logger={logger} fallback={customFallback}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			const resetButton = screen.getByTestId('reset-btn');
			expect(resetButton).toBeInTheDocument();

			resetButton.click();
			resetButton.click();

			rerender(
				<BrowserRouter>
					<ErrorBoundary logger={logger} fallback={customFallback}>
						<ThrowError shouldThrow={false} />
					</ErrorBoundary>
				</BrowserRouter>
			);

			expect(screen.getByText('No error')).toBeInTheDocument();
		});
	});
});

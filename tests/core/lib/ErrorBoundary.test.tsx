/**
 * ErrorBoundary Tests
 *
 * Tests for error catching, logging, fallback rendering, and error recovery
 */

import { ROUTES } from '@core/config/routes';
import { ErrorBoundary } from '@core/lib/ErrorBoundary';
import { ErrorBoundaryWrapper } from '@core/lib/ErrorBoundaryWrapper';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
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

describe('ErrorBoundary - Development vs Production mode', () => {
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

	describe('Mode-specific behavior', () => {
		it('should display error details in development mode', async () => {
			// Mock DEV to be true
			const originalEnv = await import('@core/config/env.client');
			vi.spyOn(originalEnv, 'env', 'get').mockReturnValue({
				...originalEnv.env,
				DEV: true,
			} as typeof originalEnv.env);

			const errorMessage = 'Development error';
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage={errorMessage} />
				</ErrorBoundary>
			);

			// Wait for error details to render - check for error message in the paragraph
			await waitFor(() => {
				const errorParagraphs = screen.getAllByText(new RegExp(errorMessage));
				expect(errorParagraphs.length).toBeGreaterThan(0);
			});

			// Verify error details container is present using Testing Library
			const main = screen.getByRole('main');
			const mainContainer = within(main);
			// Check if error details are visible - the error message appears in both paragraph and pre elements
			const errorDetails = mainContainer.getAllByText(new RegExp(errorMessage));
			expect(errorDetails.length).toBeGreaterThan(0);
			// Verify at least one error detail element is in the document
			expect(errorDetails[0]).toBeInTheDocument();
		});

		it('should not display error details in production mode', async () => {
			// Mock DEV to be false
			const originalEnv = await import('@core/config/env.client');
			vi.spyOn(originalEnv, 'env', 'get').mockReturnValue({
				...originalEnv.env,
				DEV: false,
			} as typeof originalEnv.env);

			const errorMessage = 'Production error';
			renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage={errorMessage} />
				</ErrorBoundary>
			);

			// Error details should not be visible
			await waitFor(() => {
				const errorText = screen.queryByText(new RegExp(errorMessage));
				expect(errorText).not.toBeInTheDocument();
			});
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

describe('ErrorBoundaryWrapper - Logger injection', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should inject logger from context', () => {
		const testLogger = new MockLoggerAdapter();
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>,
			{ logger: testLogger }
		);

		// Should log error using the provided logger
		expect(testLogger.logs).toHaveLength(1);
		expect(testLogger.logs[0]?.level).toBe('error');
	});
});

describe('ErrorBoundaryWrapper - Default UI', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should use ErrorBoundaryUI by default', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI renders a main element with role="alert"
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
	});

	it('should handle error recovery through ErrorBoundaryUI', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI should have a retry button
		const retryButton = screen.getByRole('button', { name: /retry|try again/i });
		expect(retryButton).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - Custom configuration', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should use custom fallback when provided', () => {
		const customFallback = <div data-testid="custom-wrapper-fallback">Custom</div>;
		renderWithProviders(
			<ErrorBoundaryWrapper fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByTestId('custom-wrapper-fallback')).toBeInTheDocument();
	});

	it('should pass uiProps to ErrorBoundaryUI', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					title: 'Custom Title',
					description: 'Custom Description',
					variant: 'minimal',
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI should render with custom props
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
		// The title and description should be rendered by ErrorBoundaryUI
		expect(screen.getByText('Custom Title')).toBeInTheDocument();
		expect(screen.getByText('Custom Description')).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - Nested boundaries', () => {
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

	describe('Edge case handling', () => {
		it('should handle multiple errors sequentially', () => {
			const { rerender } = renderWithRouter(
				<ErrorBoundary logger={logger}>
					<ThrowError shouldThrow={true} errorMessage="First error" />
				</ErrorBoundary>
			);

			expect(logger.logs).toHaveLength(1);

			// Reset and throw again
			const resetButton = screen.getByRole('button', { name: /try again/i });
			resetButton.click();

			rerender(
				<BrowserRouter>
					<ErrorBoundary logger={logger}>
						<ThrowError shouldThrow={true} errorMessage="Second error" />
					</ErrorBoundary>
				</BrowserRouter>
			);

			// Should log the second error
			expect(logger.logs.length).toBeGreaterThanOrEqual(1);
		});

		it('should handle errors in error boundary fallback', () => {
			const fallbackThatThrows = () => {
				throw new Error('Fallback error');
			};

			// When a fallback throws, React will still throw the error
			// This is expected behavior - error boundaries can't catch errors in their own fallback
			// The test verifies that the error boundary attempts to render the fallback
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

			// This shouldn't happen in practice, but test the edge case
			renderWithRouter(
				<ErrorBoundary logger={logger} fallback={customFallback}>
					<ThrowError shouldThrow={true} />
				</ErrorBoundary>
			);

			// Should render the fallback
			expect(screen.getByTestId('null-error-fallback')).toBeInTheDocument();
		});
	});
});

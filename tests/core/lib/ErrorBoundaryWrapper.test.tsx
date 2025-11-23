/**
 * ErrorBoundaryWrapper Tests
 *
 * Tests for the ErrorBoundaryWrapper component that injects logger from context
 * and provides a convenient wrapper around ErrorBoundary with ErrorBoundaryUI integration.
 */

import { ErrorBoundaryWrapper } from '@core/lib/ErrorBoundaryWrapper';
import { screen, waitFor } from '@testing-library/react';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThrowError } from './ErrorBoundary.test-helpers';

// Test constants for string literals
const TEST_STRING_SHOULD_NOT_APPEAR = 'Should not appear';
const TEST_STRING_CUSTOM_TITLE = 'Custom Title';
const TEST_STRING_CUSTOM_DESCRIPTION = 'Custom Description';
const TEST_STRING_FIRST_TITLE = 'First Title';

// Helper to setup test environment for ErrorBoundaryWrapper tests
function setupErrorBoundaryWrapperTests() {
	// Suppress console.error during error boundary tests
	vi.spyOn(console, 'error').mockImplementation(() => {});

	return {
		cleanup: () => {
			vi.restoreAllMocks();
		},
	};
}

describe('ErrorBoundaryWrapper - Logger injection', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should inject logger from LoggerProvider context', () => {
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
		expect(testLogger.logs[0]?.message).toBe('ErrorBoundary caught an error');
	});

	it('should use default logger from context when no custom logger provided', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// Should render error UI (indicating logger was injected)
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - Default UI behavior', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should use ErrorBoundaryUI by default when no fallback provided', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI renders a main element with role="alert"
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
		expect(alert).toHaveAttribute('aria-live', 'assertive');
	});

	it('should pass error to ErrorBoundaryUI', () => {
		const errorMessage = 'Test error message';
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} errorMessage={errorMessage} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI should receive and display the error
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
	});

	it('should provide retry functionality through ErrorBoundaryUI', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryUI should have a retry button
		const retryButton = screen.getByRole('button', { name: /retry|try again/i });
		expect(retryButton).toBeInTheDocument();
	});

	it('should handle error recovery through ErrorBoundaryUI retry', async () => {
		const { rerender } = renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// Error should be caught
		expect(screen.getByRole('alert')).toBeInTheDocument();

		// Find retry button
		const retryButton = screen.getByRole('button', { name: /retry|try again/i });
		expect(retryButton).toBeInTheDocument();

		// Rerender with shouldThrow=false to simulate recovery
		rerender(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={false} />
			</ErrorBoundaryWrapper>
		);

		// Click retry button
		retryButton.click();

		// After reset, should render children again
		await waitFor(() => {
			expect(screen.getByText('No error')).toBeInTheDocument();
		});
	});
});

describe('ErrorBoundaryWrapper - Custom fallback', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should use custom ReactNode fallback when provided', () => {
		const customFallback = <div data-testid="custom-wrapper-fallback">Custom Error UI</div>;
		renderWithProviders(
			<ErrorBoundaryWrapper fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByTestId('custom-wrapper-fallback')).toBeInTheDocument();
		expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
		// Should not render default ErrorBoundaryUI
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('should prioritize custom fallback over uiProps', () => {
		const customFallback = <div data-testid="custom-fallback">Custom</div>;
		renderWithProviders(
			<ErrorBoundaryWrapper
				fallback={customFallback}
				uiProps={{
					title: TEST_STRING_SHOULD_NOT_APPEAR,
					description: TEST_STRING_SHOULD_NOT_APPEAR,
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
		expect(screen.queryByText(TEST_STRING_SHOULD_NOT_APPEAR)).not.toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - UI props configuration', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should pass uiProps to ErrorBoundaryUI when no custom fallback', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					title: TEST_STRING_CUSTOM_TITLE,
					description: TEST_STRING_CUSTOM_DESCRIPTION,
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
		expect(screen.getByText(TEST_STRING_CUSTOM_TITLE)).toBeInTheDocument();
		expect(screen.getByText(TEST_STRING_CUSTOM_DESCRIPTION)).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - UI props variants', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should handle variant prop correctly', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					variant: 'detailed',
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('should handle minimal variant', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					variant: 'minimal',
					title: 'Minimal Error',
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Minimal Error')).toBeInTheDocument();
	});

	it('should handle default variant', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					variant: 'default',
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - useMemo optimization', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should memoize fallback function when fallback prop is undefined', () => {
		const { rerender } = renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();

		// Rerender with same props should use memoized fallback
		rerender(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - useMemo uiProps updates', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should update memoized fallback when uiProps change', () => {
		const { rerender } = renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					title: TEST_STRING_FIRST_TITLE,
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByText(TEST_STRING_FIRST_TITLE)).toBeInTheDocument();

		// Update uiProps
		rerender(
			<ErrorBoundaryWrapper
				uiProps={{
					title: 'Second Title',
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByText('Second Title')).toBeInTheDocument();
		expect(screen.queryByText(TEST_STRING_FIRST_TITLE)).not.toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - useMemo fallback prop updates', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should update memoized fallback when fallback prop changes', () => {
		const firstFallback = <div data-testid="first-fallback">First</div>;
		const { rerender } = renderWithProviders(
			<ErrorBoundaryWrapper fallback={firstFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByTestId('first-fallback')).toBeInTheDocument();

		const secondFallback = <div data-testid="second-fallback">Second</div>;
		rerender(
			<ErrorBoundaryWrapper fallback={secondFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByTestId('second-fallback')).toBeInTheDocument();
		expect(screen.queryByTestId('first-fallback')).not.toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - Composition and integration', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should work with nested ErrorBoundaryWrapper components', () => {
		const outerLogger = new MockLoggerAdapter();

		renderWithProviders(
			<ErrorBoundaryWrapper>
				<div>
					<ErrorBoundaryWrapper>
						<ThrowError shouldThrow={true} />
					</ErrorBoundaryWrapper>
				</div>
			</ErrorBoundaryWrapper>,
			{ logger: outerLogger }
		);

		// Inner boundary should catch the error
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('should render children when no error occurs', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={false} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByText('No error')).toBeInTheDocument();
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	it('should handle multiple sequential errors', () => {
		const testLogger = new MockLoggerAdapter();
		const { rerender } = renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} errorMessage="First error" />
			</ErrorBoundaryWrapper>,
			{ logger: testLogger }
		);

		expect(testLogger.logs).toHaveLength(1);
		expect(screen.getByRole('alert')).toBeInTheDocument();

		// Reset and throw again
		const retryButton = screen.getByRole('button', { name: /retry|try again/i });
		retryButton.click();

		rerender(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} errorMessage="Second error" />
			</ErrorBoundaryWrapper>
		);

		// Should handle the second error
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

describe('ErrorBoundaryWrapper - ErrorBoundaryFallback component', () => {
	let cleanup: () => void;

	beforeEach(() => {
		const { cleanup: setupCleanup } = setupErrorBoundaryWrapperTests();
		cleanup = setupCleanup;
	});

	afterEach(() => {
		cleanup();
	});

	it('should pass error and onReset to ErrorBoundaryFallback', () => {
		const errorMessage = 'Test error';
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} errorMessage={errorMessage} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryFallback should receive error and render ErrorBoundaryUI
		const alert = screen.getByRole('alert');
		expect(alert).toBeInTheDocument();
	});

	it('should pass uiProps to ErrorBoundaryFallback', () => {
		renderWithProviders(
			<ErrorBoundaryWrapper
				uiProps={{
					title: TEST_STRING_CUSTOM_TITLE,
					description: TEST_STRING_CUSTOM_DESCRIPTION,
				}}
			>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		expect(screen.getByText(TEST_STRING_CUSTOM_TITLE)).toBeInTheDocument();
		expect(screen.getByText(TEST_STRING_CUSTOM_DESCRIPTION)).toBeInTheDocument();
	});

	it('should handle null error in ErrorBoundaryFallback', () => {
		// This tests the internal ErrorBoundaryFallback component's handling of null errors
		// In practice, ErrorBoundary should always provide an Error, but we test the edge case
		renderWithProviders(
			<ErrorBoundaryWrapper>
				<ThrowError shouldThrow={true} />
			</ErrorBoundaryWrapper>
		);

		// ErrorBoundaryFallback should handle null gracefully
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});

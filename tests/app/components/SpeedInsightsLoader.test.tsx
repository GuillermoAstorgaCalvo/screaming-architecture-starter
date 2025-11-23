/**
 * SpeedInsightsLoader Tests
 *
 * Tests for lazy loading the Vercel Speed Insights component including:
 * - Dynamic import behavior
 * - Loading states
 * - Error handling
 * - Cleanup on unmount
 * - Environment-specific error logging
 */

import { SpeedInsightsLoader } from '@app/components/SpeedInsightsLoader';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ComponentType } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SPEED_INSIGHTS_TEST_ID = 'speed-insights';
const FAILED_TO_LOAD_MESSAGE = 'Failed to load Speed Insights';
const SPEED_INSIGHTS_MODULE_PATH = '@vercel/speed-insights/react';
const UNEXPECTED_ERROR_MESSAGE = 'Unexpected Speed Insights error';

// Hoisted mock control and component
const { mockEnvDev, MockSpeedInsights } = vi.hoisted(() => {
	const mockDev = { current: false };
	const MockSpeedInsightsComponent: ComponentType = () => {
		return <div data-testid={SPEED_INSIGHTS_TEST_ID}>Speed Insights</div>;
	};
	return {
		mockEnvDev: mockDev,
		MockSpeedInsights: MockSpeedInsightsComponent,
	};
});

// Mock the env module
vi.mock('@core/config/env.client', () => ({
	env: {
		get DEV() {
			return mockEnvDev.current;
		},
	},
}));

// Mock the Speed Insights module - default successful import
// Note: For dynamic imports, the mock factory should return the module directly
// Note: Cannot use constant here as vi.mock() is hoisted
// Using async factory to ensure it works with dynamic imports
vi.mock('@vercel/speed-insights/react', async () => {
	return {
		SpeedInsights: MockSpeedInsights,
	};
});

// Helper functions for error handling tests
async function setupErrorMock(
	mockFactory: () =>
		| { SpeedInsights?: ComponentType }
		| Promise<{ SpeedInsights?: ComponentType }>
		| never
): Promise<typeof SpeedInsightsLoader> {
	vi.doMock(SPEED_INSIGHTS_MODULE_PATH, mockFactory);
	const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');
	return Loader;
}

function createThrowingMock(errorMessage: string): () => never {
	return () => {
		throw new Error(errorMessage);
	};
}

function createRejectingMock(errorMessage: string): () => Promise<never> {
	return () => Promise.reject(new Error(errorMessage));
}

async function waitForComponentNotRendered(timeout = 1000): Promise<void> {
	await waitFor(
		() => {
			expect(screen.queryByTestId(SPEED_INSIGHTS_TEST_ID)).not.toBeInTheDocument();
		},
		{ timeout }
	);
}

async function waitForWarningLog(
	consoleWarnSpy: ReturnType<typeof vi.spyOn>,
	message: string,
	timeout = 1000
): Promise<void> {
	await waitFor(
		() => {
			expect(consoleWarnSpy).toHaveBeenCalledWith(message, expect.any(Error));
		},
		{ timeout }
	);
}

async function waitForNoWarningLog(
	consoleWarnSpy: ReturnType<typeof vi.spyOn>,
	timeout = 1000
): Promise<void> {
	await waitFor(
		() => {
			expect(consoleWarnSpy).not.toHaveBeenCalled();
		},
		{ timeout }
	);
}

async function waitForNoErrorLog(
	consoleErrorSpy: ReturnType<typeof vi.spyOn>,
	timeout = 1000
): Promise<void> {
	await waitFor(
		() => {
			expect(consoleErrorSpy).not.toHaveBeenCalled();
		},
		{ timeout }
	);
}

describe('SpeedInsightsLoader - Successful Loading', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockEnvDev.current = false;
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('renders null initially when SpeedInsights is not loaded', () => {
		renderWithProviders(<SpeedInsightsLoader />);

		// Initially should render nothing (before useEffect runs)
		// Use queryByTestId instead of direct node access
		expect(screen.queryByTestId(SPEED_INSIGHTS_TEST_ID)).not.toBeInTheDocument();
	});

	it('loads and renders SpeedInsights component after dynamic import', async () => {
		// Ensure mock is set up for this test
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, () => ({
			SpeedInsights: MockSpeedInsights,
		}));

		// Reset modules to ensure fresh import with mock
		vi.resetModules();
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');

		renderWithProviders(<Loader />);

		// Wait for component to load - dynamic imports may take a moment
		// The component uses useEffect which runs after render, so we need to wait
		await waitFor(
			() => {
				expect(screen.getByTestId(SPEED_INSIGHTS_TEST_ID)).toBeInTheDocument();
			},
			{ timeout: 3000 }
		);

		// Verify the component renders with expected content
		expect(screen.getByText('Speed Insights')).toBeInTheDocument();
	});
});

describe('SpeedInsightsLoader - Error Handling', () => {
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		mockEnvDev.current = false;
		// Reset modules to allow vi.doMock to work
		vi.resetModules();
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
		consoleErrorSpy.mockRestore();
		vi.clearAllMocks();
		// Reset modules to restore default mock
		vi.resetModules();
	});

	it('handles import errors gracefully and renders nothing', async () => {
		const Loader = await setupErrorMock(createThrowingMock('Failed to load module'));
		renderWithProviders(<Loader />);
		await waitForComponentNotRendered();
	});

	it('logs warning in DEV mode when import fails', async () => {
		mockEnvDev.current = true;
		const Loader = await setupErrorMock(createThrowingMock('Failed to load Speed Insights module'));
		renderWithProviders(<Loader />);
		await waitForWarningLog(consoleWarnSpy, FAILED_TO_LOAD_MESSAGE);
	});

	it('does not log warning in production mode when import fails', async () => {
		mockEnvDev.current = false;
		const Loader = await setupErrorMock(createThrowingMock('Failed to load Speed Insights module'));
		renderWithProviders(<Loader />);
		await waitForNoWarningLog(consoleWarnSpy);
	});

	it('does not log error in production mode when promise rejection occurs', async () => {
		mockEnvDev.current = false;
		const Loader = await setupErrorMock(createRejectingMock(UNEXPECTED_ERROR_MESSAGE));
		renderWithProviders(<Loader />);
		await waitForNoErrorLog(consoleErrorSpy);
	});
});

describe('SpeedInsightsLoader - Outer Catch Handler', () => {
	let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();
		consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		mockEnvDev.current = false;
		vi.resetModules();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
		consoleWarnSpy.mockRestore();
		vi.clearAllMocks();
		vi.resetModules();
	});

	it('logs error in DEV mode when outer catch handler is triggered', async () => {
		mockEnvDev.current = true;
		// The outer catch handler (lines 30-34) is defensive code designed to catch
		// unhandled promise rejections. Since loadSpeedInsights is an async function
		// with a try-catch, it will always resolve even on errors, making the outer
		// catch essentially unreachable in normal operation.
		//
		// To test this code path, we need to make the promise reject in a way that
		// bypasses the try-catch. The only way to do this is to make the async function
		// itself throw an error that's not caught by the try-catch. However, with the
		// current structure, this is not possible because all errors are caught.
		//
		// Solution: Refactor the component to make the outer catch testable by
		// re-throwing the error in the catch block. This allows the outer catch to
		// execute while maintaining the same error handling behavior (errors are
		// still logged as warnings in the try-catch, and then re-thrown for the
		// outer catch to handle).
		const error = new Error(UNEXPECTED_ERROR_MESSAGE);

		// Make the import return a promise that rejects
		// This will be caught by the try-catch, which will log a warning and then
		// re-throw the error (if we refactor the component), allowing the outer catch to handle it
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, async () => {
			throw error;
		});
		vi.resetModules();
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');
		renderWithProviders(<Loader />);

		// Wait for both the warning (from try-catch) and error (from outer catch) to be logged
		await waitFor(
			() => {
				// First, the try-catch should log a warning
				expect(consoleWarnSpy).toHaveBeenCalledWith(FAILED_TO_LOAD_MESSAGE, expect.any(Error));
				// Then, the outer catch should log an error (if component is refactored to re-throw)
				expect(consoleErrorSpy).toHaveBeenCalledWith(
					'Unexpected Speed Insights error',
					expect.any(Error)
				);
			},
			{ timeout: 2000 }
		);
	});

	it('does not log error in production mode when outer catch handler is triggered', async () => {
		mockEnvDev.current = false;
		const error = new Error(UNEXPECTED_ERROR_MESSAGE); // Make the import throw synchronously to trigger the outer catch
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, () => {
			throw error;
		});
		vi.resetModules();
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');
		renderWithProviders(<Loader />);

		// Wait a bit to ensure outer catch would have been triggered
		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});
		// In production, errors should not be logged
		await waitForNoErrorLog(consoleErrorSpy);
	});
});

describe('SpeedInsightsLoader - Cleanup and Unmounting', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('does not update state after unmount', async () => {
		let resolveImport: () => void = () => {};
		const importPromise = new Promise<void>(resolve => {
			resolveImport = resolve;
		});

		// Mock delayed import
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, async () => {
			await importPromise;
			return { SpeedInsights: MockSpeedInsights };
		});

		// Re-import component to get new mock
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');

		const { unmount } = renderWithProviders(<Loader />);

		// Unmount before import completes
		unmount();

		// Resolve the import after unmount
		resolveImport();

		// Wait a bit to ensure state doesn't update
		await new Promise(resolve => {
			setTimeout(resolve, 100);
		});

		// Component should be unmounted, so no updates should occur
		expect(screen.queryByTestId(SPEED_INSIGHTS_TEST_ID)).not.toBeInTheDocument();
	});

	it('cleans up isMounted flag on unmount', () => {
		const { unmount } = renderWithProviders(<SpeedInsightsLoader />);

		// Unmount should not throw
		expect(() => {
			unmount();
		}).not.toThrow();
	});
});

describe('SpeedInsightsLoader - Edge Cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('handles module with missing SpeedInsights export', async () => {
		// Mock module that doesn't export SpeedInsights
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, () => ({
			SpeedInsights: undefined,
		}));

		// Re-import component to get new mock
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');

		renderWithProviders(<Loader />);

		// Wait a bit - should handle gracefully
		await waitFor(
			() => {
				// Should render nothing if SpeedInsights is undefined
				expect(screen.queryByTestId(SPEED_INSIGHTS_TEST_ID)).not.toBeInTheDocument();
			},
			{ timeout: 1000 }
		);
	});

	it('handles delayed import correctly', async () => {
		// Mock delayed import
		vi.doMock(SPEED_INSIGHTS_MODULE_PATH, async () => {
			await new Promise<void>(resolve => {
				setTimeout(resolve, 50);
			});
			return { SpeedInsights: MockSpeedInsights };
		});

		// Re-import component to get new mock
		const { SpeedInsightsLoader: Loader } = await import('@app/components/SpeedInsightsLoader');

		renderWithProviders(<Loader />);

		// Initially should render nothing
		expect(screen.queryByTestId(SPEED_INSIGHTS_TEST_ID)).not.toBeInTheDocument();

		// Wait for import to complete
		await waitFor(
			() => {
				expect(screen.getByTestId(SPEED_INSIGHTS_TEST_ID)).toBeInTheDocument();
			},
			{ timeout: 1000 }
		);
	});

	it('handles multiple renders correctly', async () => {
		const { rerender } = renderWithProviders(<SpeedInsightsLoader />);

		// Wait for first render to complete
		await waitFor(
			() => {
				expect(screen.getByTestId(SPEED_INSIGHTS_TEST_ID)).toBeInTheDocument();
			},
			{ timeout: 1000 }
		);

		// Rerender should still show the component
		rerender(<SpeedInsightsLoader />);

		expect(screen.getByTestId(SPEED_INSIGHTS_TEST_ID)).toBeInTheDocument();
	});
});

// This file exports utility functions and re-exports testing library utilities,
// not just React components. The component (TestProviders) is in a separate file.
import type { HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { render, type RenderOptions } from '@testing-library/react';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import type { ReactElement, ReactNode } from 'react';

/**
 * Test utilities for rendering components with all providers
 *
 * Provides a custom render function that wraps components with:
 * - ThemeProvider
 * - QueryProvider (React Query)
 * - StorageProvider
 * - HttpProvider
 * - LoggerProvider
 *
 * This ensures consistent test setup across all domain tests and matches
 * the production provider composition.
 */

/**
 * Default test providers configuration
 */
const defaultTestProviders = {
	storage: new MockStorageAdapter(),
	logger: new MockLoggerAdapter(),
	http: new MockHttpAdapter(),
	defaultTheme: 'light' as const,
} as const;

/**
 * Options for custom render function
 * Allows overriding default providers for specific test scenarios
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	/**
	 * Custom storage adapter (defaults to MockStorageAdapter)
	 */
	storage?: StoragePort;

	/**
	 * Custom logger adapter (defaults to MockLoggerAdapter)
	 */
	logger?: LoggerPort;

	/**
	 * Custom HTTP adapter (defaults to MockHttpAdapter)
	 */
	http?: HttpPort;

	/**
	 * Default theme for ThemeProvider (defaults to 'light')
	 */
	defaultTheme?: 'light' | 'dark' | 'system';
}

/**
 * Custom render function with all providers
 *
 * @param ui - The component to render
 * @param options - Render options including provider overrides
 * @returns Render result with all Testing Library utilities
 *
 * @example
 * ```ts
 * import { renderWithProviders } from '@tests/utils/testUtils';
 *
 * test('my component', () => {
 *   const { getByText } = renderWithProviders(<MyComponent />);
 *   expect(getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 *
 * @example
 * ```ts
 * // With custom storage
 * const mockStorage = new MockStorageAdapter();
 * renderWithProviders(<MyComponent />, {
 *   storage: mockStorage,
 * });
 * ```
 */
export function renderWithProviders(
	ui: ReactElement,
	options: CustomRenderOptions = {}
): ReturnType<typeof render> {
	const {
		storage = defaultTestProviders.storage,
		logger = defaultTestProviders.logger,
		http = defaultTestProviders.http,
		defaultTheme = defaultTestProviders.defaultTheme,
		...renderOptions
	} = options;

	const wrapper = ({ children }: { children: ReactNode }): ReactElement => {
		return (
			<TestProviders storage={storage} logger={logger} http={http} defaultTheme={defaultTheme}>
				{children}
			</TestProviders>
		);
	};

	return render(ui, { ...renderOptions, wrapper });
}

/**
 * Re-export commonly used testing utilities for convenience
 */
export * from '@testing-library/react';

/**
 * Export mock adapters for use in tests that need direct access
 */
export { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
export { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
export { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';

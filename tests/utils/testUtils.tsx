// This file exports utility functions and testing library utilities,
// not just React components. The component (TestProviders) is in a separate file.
import type { AnalyticsInitOptions, AnalyticsPort } from '@core/ports/AnalyticsPort';
import type { AuthPort } from '@core/ports/AuthPort';
import type { HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { render, type RenderOptions } from '@testing-library/react';
import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
// Import mock adapters directly to avoid module resolution issues
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import type { ReactElement, ReactNode } from 'react';

/**
 * Test utilities for rendering components with all providers
 *
 * Provides a custom render function that wraps components with:
 * - LoggerProvider
 * - HttpProvider
 * - StorageProvider
 * - I18nProvider
 * - ThemeProvider
 * - QueryProvider (React Query)
 *
 * This ensures consistent test setup across all domain tests and matches
 * the production provider composition.
 */

/**
 * Default test providers configuration
 * Created lazily to avoid module loading issues
 *
 * Note: Instances are created fresh each time to avoid state leakage between tests
 * Using direct instantiation to ensure proper module resolution in Vitest
 */
function getDefaultTestProviders() {
	return {
		auth: new MockAuthAdapter(),
		storage: new MockStorageAdapter(),
		logger: new MockLoggerAdapter(),
		http: new MockHttpAdapter(),
		analytics: new MockAnalyticsAdapter(),
		defaultTheme: 'light' as const,
	} as const;
}

/**
 * Options for custom render function
 * Allows overriding default providers for specific test scenarios
 */
export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	/**
	 * Custom auth adapter (defaults to MockAuthAdapter)
	 */
	auth?: AuthPort;

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

	/**
	 * Custom analytics adapter (defaults to MockAnalyticsAdapter)
	 */
	analytics?: AnalyticsPort;

	/**
	 * Optional analytics configuration passed to AnalyticsProvider
	 */
	analyticsConfig?: AnalyticsInitOptions | null;
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
	const defaultProviders = getDefaultTestProviders();
	const {
		auth = defaultProviders.auth,
		storage = defaultProviders.storage,
		logger = defaultProviders.logger,
		http = defaultProviders.http,
		analytics = defaultProviders.analytics,
		defaultTheme = defaultProviders.defaultTheme,
		analyticsConfig = null,
		...renderOptions
	} = options;

	const wrapper = ({ children }: { children: ReactNode }): ReactElement => {
		return (
			<TestProviders
				auth={auth}
				storage={storage}
				logger={logger}
				http={http}
				defaultTheme={defaultTheme}
				analytics={analytics}
				analyticsConfig={analyticsConfig}
			>
				{children}
			</TestProviders>
		);
	};

	return render(ui, { ...renderOptions, wrapper });
}

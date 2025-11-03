/**
 * Configuration initialization
 * Sets up runtime configuration and initializes app-wide config dependencies
 *
 * This should be called early in the app lifecycle (e.g., in main.tsx or App.tsx)
 * to ensure runtime config is loaded and httpClient is configured before other code runs.
 *
 * See: .cursor/rules/config/config.mdc
 */

import { httpClient } from '@core/lib/httpClient';

import { getRuntimeConfig } from './runtime';

/**
 * Initialize app configuration
 * Loads runtime config and applies it to global services (e.g., httpClient)
 *
 * @returns Promise that resolves when initialization is complete
 */
export async function initConfig(): Promise<void> {
	try {
		const runtimeConfig = await getRuntimeConfig();

		// Configure httpClient with API base URL from runtime config
		if (runtimeConfig.API_BASE_URL) {
			httpClient.setDefaultConfig({
				baseURL: runtimeConfig.API_BASE_URL,
			});
		}
	} catch (error) {
		// Log error but don't throw - app should still work with defaults
		console.error('Failed to initialize configuration:', error);
	}
}

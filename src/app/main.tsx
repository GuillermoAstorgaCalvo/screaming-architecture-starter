import '@domains/landing/i18n';
import '@styles/globals.css';

import App from '@app/App';
import { initConfig } from '@core/config/init';
import { i18nInitPromise } from '@core/i18n/i18n';
import { reportWebVitals } from '@core/perf/reportWebVitals';
import { loggerAdapter } from '@infra/logging/loggerAdapter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Initialize application configuration
 * Loads runtime config and sets up global services (e.g., httpClient baseURL)
 */
await initConfig();

/**
 * Initialize i18n
 * Ensure translations are loaded before rendering the app
 */
await i18nInitPromise;

/**
 * Initialize Core Web Vitals tracking
 * Only runs in production mode
 */
reportWebVitals(loggerAdapter);

const container = document.querySelector('#root');
if (!container) {
	throw new Error('Root element #root not found');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>
);

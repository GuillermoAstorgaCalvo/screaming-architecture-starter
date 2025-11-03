import '@styles/globals.css';

import App from '@app/App';
import { initConfig } from '@core/config/init';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Initialize application configuration
 * Loads runtime config and sets up global services (e.g., httpClient baseURL)
 */
await initConfig();

const container = document.querySelector('#root');
if (!container) {
	throw new Error('Root element #root not found');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>
);

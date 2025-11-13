import Error500 from '@app/pages/Error500';
import { I18nProvider } from '@app/providers/I18nProvider';
import { QueryProvider } from '@app/providers/QueryProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import Router from '@app/router';
import { env } from '@core/config/env.client';
import { getCachedRuntimeConfig } from '@core/config/runtime';
import { useHttpClientAuth } from '@core/hooks/useHttpClientAuth';
import { ErrorBoundaryWrapper } from '@core/lib/ErrorBoundaryWrapper';
import { httpClient } from '@core/lib/httpClient';
import type { AnalyticsInitOptions } from '@core/ports/AnalyticsPort';
import { AnalyticsProvider } from '@core/providers/AnalyticsProvider';
import { AuthProvider } from '@core/providers/AuthProvider';
import { HttpProvider } from '@core/providers/HttpProvider';
import { LoggerProvider } from '@core/providers/LoggerProvider';
import { StorageProvider } from '@core/providers/StorageProvider';
import { ToastProvider } from '@core/providers/ToastProvider';
import ToastContainer from '@core/ui/feedback/toast/components/ToastContainer';
import { LayoutGroup } from '@core/ui/utilities/motion/components/LayoutGroup';
import { MotionProvider } from '@core/ui/utilities/motion/components/MotionProvider';
import {
	googleAnalyticsAdapter,
	noopAnalyticsAdapter,
} from '@infra/analytics/googleAnalyticsAdapter';
import { JwtAuthAdapter } from '@infra/auth/jwtAuthAdapter';
import { loggerAdapter } from '@infra/logging/loggerAdapter';
import { localStorageAdapter } from '@infra/storage/localStorageAdapter';
import { BrowserRouter } from 'react-router-dom';

const authAdapter = new JwtAuthAdapter({
	storage: localStorageAdapter,
});

/**
 * App component - Root composition
 * Composition order: LoggerProvider > ErrorBoundary > HttpProvider > AuthProvider >
 * StorageProvider > ThemeProvider > I18nProvider > QueryProvider > AnalyticsProvider >
 * MotionProvider > ToastProvider > BrowserRouter > LayoutGroup > Router > ToastContainer
 * - LoggerProvider must be outermost to provide logger to all components including ErrorBoundary
 * - ErrorBoundaryWrapper uses logger from context and wraps the rest of the app with Error500 as fallback UI
 * - HttpProvider provides HTTP client for domain services and hooks
 * - AuthProvider exposes authentication state and adapters for downstream consumers
 * - StorageProvider must be before ThemeProvider since ThemeProvider uses storage via useStorage hook
 * - I18nProvider provides i18next instance for translations
 * - AnalyticsProvider exposes analytics port implementations while keeping domains decoupled from adapters
 * - ToastProvider provides toast notification queue management
 * - ToastContainer renders toast notifications (should be inside ToastProvider)
 * See: .cursor/rules/architecture/folder-structure-root-app.mdc
 */
export default function App() {
	useHttpClientAuth(authAdapter);

	const analyticsEnabled = env.ANALYTICS_ENABLED;
	const analyticsAdapter = analyticsEnabled ? googleAnalyticsAdapter : noopAnalyticsAdapter;
	const analyticsConfig = getAnalyticsConfig(analyticsEnabled);

	return (
		<LoggerProvider logger={loggerAdapter}>
			<ErrorBoundaryWrapper fallback={<Error500 />}>
				<HttpProvider http={httpClient}>
					<AuthProvider auth={authAdapter}>
						<StorageProvider storage={localStorageAdapter}>
							<ThemeProvider>
								<I18nProvider>
									<QueryProvider>
										<AnalyticsProvider analytics={analyticsAdapter} config={analyticsConfig}>
											<MotionProvider reducedMotion="user">
												<ToastProvider>
													<BrowserRouter>
														<LayoutGroup id="app-route-transitions">
															<Router />
														</LayoutGroup>
													</BrowserRouter>
													<ToastContainer />
												</ToastProvider>
											</MotionProvider>
										</AnalyticsProvider>
									</QueryProvider>
								</I18nProvider>
							</ThemeProvider>
						</StorageProvider>
					</AuthProvider>
				</HttpProvider>
			</ErrorBoundaryWrapper>
		</LoggerProvider>
	);
}

function getAnalyticsConfig(isAnalyticsEnabled: boolean): AnalyticsInitOptions | null {
	if (!isAnalyticsEnabled) {
		return null;
	}

	const runtimeConfig = getCachedRuntimeConfig();
	const runtimeWriteKey = runtimeConfig?.ANALYTICS_WRITE_KEY?.trim();
	const envWriteKey = env.GA_MEASUREMENT_ID;
	const writeKey = runtimeWriteKey ?? envWriteKey;

	if (!writeKey) {
		return null;
	}

	const debugOverride = env.GA_DEBUG;
	const debug = debugOverride ?? env.DEV;

	const config: AnalyticsInitOptions = {
		writeKey,
		dataLayerName: env.GA_DATALAYER_NAME,
	};

	if (debug) {
		config.debug = true;
	}

	return config;
}

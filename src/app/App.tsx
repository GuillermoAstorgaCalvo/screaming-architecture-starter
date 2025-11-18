import Error500 from '@app/pages/Error500';
import { DeferredMotionProvider } from '@app/providers/DeferredMotionProvider';
import { I18nProvider } from '@app/providers/I18nProvider';
import { QueryProvider } from '@app/providers/QueryProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import Router from '@app/router';
import { env } from '@core/config/env.client';
import { getCachedRuntimeConfig } from '@core/config/runtime';
import { useHttpClientAuth } from '@core/hooks/http/useHttpClientAuth';
import { ErrorBoundaryWrapper } from '@core/lib/ErrorBoundaryWrapper';
import { httpClient } from '@core/lib/http/httpClient';
import type { AnalyticsInitOptions, AnalyticsPort } from '@core/ports/AnalyticsPort';
import { AnalyticsProvider } from '@core/providers/analytics/AnalyticsProvider';
import { AuthProvider } from '@core/providers/auth/AuthProvider';
import { HttpProvider } from '@core/providers/http/HttpProvider';
import { LoggerProvider } from '@core/providers/logger/LoggerProvider';
import { StorageProvider } from '@core/providers/storage/StorageProvider';
import { ToastProvider } from '@core/providers/toast/ToastProvider';
import ToastContainer from '@core/ui/feedback/toast/components/ToastContainer';
import { LazyLayoutGroup } from '@core/ui/utilities/motion/components/LayoutGroup.lazy';
import { noopAnalyticsAdapter } from '@infra/analytics/noopAnalyticsAdapter';
import { JwtAuthAdapter } from '@infra/auth/jwtAuthAdapter';
import { loggerAdapter } from '@infra/logging/loggerAdapter';
import { localStorageAdapter } from '@infra/storage/localStorageAdapter';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

const authAdapter = new JwtAuthAdapter({
	storage: localStorageAdapter,
});

interface AppProvidersProps {
	readonly analytics: AnalyticsPort;
	readonly config: AnalyticsInitOptions | null;
	readonly children: ReactNode;
}

/**
 * App component - Root composition
 * Composition order: LoggerProvider > ErrorBoundary > HttpProvider > AuthProvider >
 * StorageProvider > ThemeProvider > I18nProvider > QueryProvider > AnalyticsProvider >
 * DeferredMotionProvider > ToastProvider > BrowserRouter > LayoutGroup > Router > ToastContainer
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

	const { analyticsAdapter, analyticsConfig, shouldLoadAnalytics } = useAnalytics(
		env.ANALYTICS_ENABLED
	);
	const analyticsProviderConfig = shouldLoadAnalytics ? analyticsConfig : null;

	return (
		<AppProviders analytics={analyticsAdapter} config={analyticsProviderConfig}>
			<BrowserRouter>
				<LazyLayoutGroup id="app-route-transitions">
					<div data-testid="router">
						<Router />
					</div>
				</LazyLayoutGroup>
			</BrowserRouter>
		</AppProviders>
	);
}

function AppProviders({ analytics, config, children }: AppProvidersProps) {
	return (
		<LoggerProvider logger={loggerAdapter}>
			<ErrorBoundaryWrapper fallback={<Error500 />}>
				<HttpProvider http={httpClient}>
					<AuthProvider auth={authAdapter}>
						<StorageProvider storage={localStorageAdapter}>
							<ThemeProvider>
								<I18nProvider>
									<QueryProvider>
										<AnalyticsProvider analytics={analytics} config={config}>
											<DeferredMotionProvider>
												<ToastProvider>
													{children}
													<ToastContainer />
												</ToastProvider>
											</DeferredMotionProvider>
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

function useAnalytics(isAnalyticsEnabled: boolean) {
	const analyticsConfig = useMemo(
		() => getAnalyticsConfig(isAnalyticsEnabled),
		[isAnalyticsEnabled]
	);
	const shouldLoadAnalytics = Boolean(analyticsConfig);
	const [analyticsAdapter, setAnalyticsAdapter] = useState<AnalyticsPort>(noopAnalyticsAdapter);

	useEffect(() => {
		if (!shouldLoadAnalytics) {
			setAnalyticsAdapter(noopAnalyticsAdapter);
			return;
		}

		let isMounted = true;

		const loadAnalyticsAdapter = async () => {
			try {
				const module = await import('@infra/analytics/googleTagManagerAdapter');
				if (isMounted) {
					setAnalyticsAdapter(module.googleTagManagerAdapter);
				}
			} catch (error) {
				console.warn('Failed to load analytics adapter', error);
				if (isMounted) {
					setAnalyticsAdapter(noopAnalyticsAdapter);
				}
			}
		};

		loadAnalyticsAdapter().catch(error => {
			console.error('Unexpected analytics adapter error', error);
		});

		return () => {
			isMounted = false;
		};
	}, [shouldLoadAnalytics]);

	return { analyticsAdapter, analyticsConfig, shouldLoadAnalytics };
}

function getAnalyticsConfig(isAnalyticsEnabled: boolean): AnalyticsInitOptions | null {
	if (!isAnalyticsEnabled) {
		return null;
	}

	const runtimeConfig = getCachedRuntimeConfig();
	const runtimeContainerId = runtimeConfig?.ANALYTICS_WRITE_KEY?.trim();
	const envContainerId = env.GTM_CONTAINER_ID;
	const containerId = runtimeContainerId ?? envContainerId;

	if (!containerId) {
		return null;
	}

	const debugOverride = env.GTM_DEBUG;
	const debug = debugOverride ?? env.DEV;

	const config: AnalyticsInitOptions = {
		writeKey: containerId,
		containerId,
		dataLayerName: env.GTM_DATALAYER_NAME,
	};

	if (debug) {
		config.debug = true;
	}

	return config;
}

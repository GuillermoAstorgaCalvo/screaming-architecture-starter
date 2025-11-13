import { I18nProvider } from '@app/providers/I18nProvider';
import { QueryProvider } from '@app/providers/QueryProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import type { AnalyticsInitOptions, AnalyticsPort } from '@core/ports/AnalyticsPort';
import type { AuthPort } from '@core/ports/AuthPort';
import type { HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { AnalyticsProvider } from '@core/providers/AnalyticsProvider';
import { AuthProvider } from '@core/providers/AuthProvider';
import { HttpProvider } from '@core/providers/HttpProvider';
import { LoggerProvider } from '@core/providers/LoggerProvider';
import { StorageProvider } from '@core/providers/StorageProvider';
import { ToastProvider } from '@core/providers/ToastProvider';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Provider wrapper component for tests
 * Composes all app providers in the correct order
 *
 * This component is exported separately to maintain Fast Refresh compatibility
 * while allowing test utilities to export non-component functions.
 */
export function TestProviders({
	children,
	storage,
	logger,
	http,
	auth,
	defaultTheme,
	analytics,
	analyticsConfig = null,
}: {
	readonly children: ReactNode;
	readonly storage: StoragePort;
	readonly logger: LoggerPort;
	readonly http: HttpPort;
	readonly auth: AuthPort;
	readonly defaultTheme: 'light' | 'dark' | 'system';
	readonly analytics: AnalyticsPort;
	readonly analyticsConfig?: AnalyticsInitOptions | null;
}): ReactElement {
	return (
		<LoggerProvider logger={logger}>
			<HttpProvider http={http}>
				<AuthProvider auth={auth}>
					<StorageProvider storage={storage}>
						<I18nProvider>
							<ThemeProvider defaultTheme={defaultTheme}>
								<QueryProvider>
									<AnalyticsProvider analytics={analytics} config={analyticsConfig}>
										<ToastProvider>
											<BrowserRouter>{children}</BrowserRouter>
										</ToastProvider>
									</AnalyticsProvider>
								</QueryProvider>
							</ThemeProvider>
						</I18nProvider>
					</StorageProvider>
				</AuthProvider>
			</HttpProvider>
		</LoggerProvider>
	);
}

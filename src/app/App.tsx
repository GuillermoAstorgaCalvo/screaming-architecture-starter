import { QueryProvider } from '@app/providers/QueryProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import Router from '@app/router';
import { ErrorBoundaryWrapper } from '@core/lib/ErrorBoundaryWrapper';
import { httpClient } from '@core/lib/httpClient';
import { HttpProvider } from '@core/providers/HttpProvider';
import { LoggerProvider } from '@core/providers/LoggerProvider';
import { StorageProvider } from '@core/providers/StorageProvider';
import { loggerAdapter } from '@infra/logging/loggerAdapter';
import { localStorageAdapter } from '@infra/storage/localStorageAdapter';
import { BrowserRouter } from 'react-router-dom';

/**
 * App component - Root composition
 * Composition order: LoggerProvider > ErrorBoundary > HttpProvider > StorageProvider > ThemeProvider > QueryProvider > BrowserRouter > Router
 * - LoggerProvider must be outermost to provide logger to all components including ErrorBoundary
 * - ErrorBoundaryWrapper uses logger from context and wraps the rest of the app
 * - HttpProvider provides HTTP client for domain services and hooks
 * - StorageProvider must be before ThemeProvider since ThemeProvider uses storage via useStorage hook
 * See: .cursor/rules/architecture/folder-structure-root-app.mdc
 */
export default function App() {
	return (
		<LoggerProvider logger={loggerAdapter}>
			<ErrorBoundaryWrapper>
				<HttpProvider http={httpClient}>
					<StorageProvider storage={localStorageAdapter}>
						<ThemeProvider>
							<QueryProvider>
								<BrowserRouter>
									<Router />
								</BrowserRouter>
							</QueryProvider>
						</ThemeProvider>
					</StorageProvider>
				</HttpProvider>
			</ErrorBoundaryWrapper>
		</LoggerProvider>
	);
}

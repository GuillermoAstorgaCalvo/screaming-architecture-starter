import { QueryProvider } from '@app/providers/QueryProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import type { HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { StoragePort } from '@core/ports/StoragePort';
import { HttpProvider } from '@core/providers/HttpProvider';
import { LoggerProvider } from '@core/providers/LoggerProvider';
import { StorageProvider } from '@core/providers/StorageProvider';
import type { ReactElement, ReactNode } from 'react';

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
	defaultTheme,
}: {
	readonly children: ReactNode;
	readonly storage: StoragePort;
	readonly logger: LoggerPort;
	readonly http: HttpPort;
	readonly defaultTheme: 'light' | 'dark' | 'system';
}): ReactElement {
	return (
		<LoggerProvider logger={logger}>
			<HttpProvider http={http}>
				<StorageProvider storage={storage}>
					<ThemeProvider defaultTheme={defaultTheme}>
						<QueryProvider>{children}</QueryProvider>
					</ThemeProvider>
				</StorageProvider>
			</HttpProvider>
		</LoggerProvider>
	);
}

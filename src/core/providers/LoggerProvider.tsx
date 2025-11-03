import type { LoggerPort } from '@core/ports/LoggerPort';
import { LoggerContext, type LoggerContextValue } from '@core/providers/LoggerContext';
import { type ReactNode, useMemo } from 'react';

export interface LoggerProviderProps {
	readonly children: ReactNode;
	readonly logger: LoggerPort;
}

/**
 * LoggerProvider - Provides LoggerPort instance to the component tree
 *
 * This allows domains and core to access logging via the useLogger hook without
 * directly importing infrastructure adapters, respecting hexagonal architecture boundaries.
 *
 * The LoggerPort instance should be injected at the app level.
 */
export function LoggerProvider({ children, logger }: LoggerProviderProps) {
	const value: LoggerContextValue = useMemo(() => ({ logger }), [logger]);

	return <LoggerContext.Provider value={value}>{children}</LoggerContext.Provider>;
}

LoggerProvider.displayName = 'LoggerProvider';

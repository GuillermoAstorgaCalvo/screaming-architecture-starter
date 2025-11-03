import type { LoggerPort } from '@core/ports/LoggerPort';
import { createContext } from 'react';

export interface LoggerContextValue {
	readonly logger: LoggerPort;
}

export const LoggerContext = createContext<LoggerContextValue | undefined>(undefined);

LoggerContext.displayName = 'LoggerContext';

import type { LoggerPort } from '@core/ports/LoggerPort';
import { LoggerContext } from '@core/providers/logger/LoggerContext';
import { useContext } from 'react';

/**
 * Hook to access LoggerPort from context
 * @returns The LoggerPort instance
 * @throws Error if used outside LoggerProvider
 */
export function useLogger(): LoggerPort {
	const context = useContext(LoggerContext);
	if (context === undefined) {
		throw new Error('useLogger must be used within a LoggerProvider');
	}
	return context.logger;
}

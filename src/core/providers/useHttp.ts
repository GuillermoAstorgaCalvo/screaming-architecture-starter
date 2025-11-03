import type { HttpPort } from '@core/ports/HttpPort';
import { HttpContext } from '@core/providers/HttpContext';
import { useContext } from 'react';

/**
 * Hook to access HttpPort from context
 * @returns The HttpPort instance
 * @throws Error if used outside HttpProvider
 */
export function useHttp(): HttpPort {
	const context = useContext(HttpContext);
	if (context === undefined) {
		throw new Error('useHttp must be used within an HttpProvider');
	}
	return context.http;
}

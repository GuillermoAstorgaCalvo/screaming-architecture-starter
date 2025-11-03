import type { HttpPort } from '@core/ports/HttpPort';
import { HttpContext, type HttpContextValue } from '@core/providers/HttpContext';
import { type ReactNode, useMemo } from 'react';

export interface HttpProviderProps {
	readonly children: ReactNode;
	readonly http: HttpPort;
}

/**
 * HttpProvider - Provides HttpPort instance to the component tree
 *
 * This allows domains and core to access HTTP client via the useHttp hook without
 * directly importing infrastructure adapters, respecting hexagonal architecture boundaries.
 *
 * The HttpPort instance should be injected at the app level.
 */
export function HttpProvider({ children, http }: HttpProviderProps) {
	const value: HttpContextValue = useMemo(() => ({ http }), [http]);

	return <HttpContext.Provider value={value}>{children}</HttpContext.Provider>;
}

HttpProvider.displayName = 'HttpProvider';

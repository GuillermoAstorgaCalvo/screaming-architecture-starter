import type { HttpPort } from '@core/ports/HttpPort';
import { createContext } from 'react';

export interface HttpContextValue {
	readonly http: HttpPort;
}

export const HttpContext = createContext<HttpContextValue | undefined>(undefined);

HttpContext.displayName = 'HttpContext';

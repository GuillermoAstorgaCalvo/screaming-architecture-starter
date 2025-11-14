/**
 * Hook to attach auth interceptor to httpClient
 * Ensures the auth token interceptor is attached to the httpClient instance
 * if not already attached.
 *
 * @param authAdapter - The auth adapter to use for token retrieval
 */
import { createAuthTokenRequestInterceptor } from '@core/lib/httpAuthInterceptor';
import { httpClient } from '@core/lib/httpClient';
import type { AuthPort } from '@core/ports/AuthPort';
import { useEffect } from 'react';

export function useHttpClientAuth(authAdapter: AuthPort): void {
	useEffect(() => {
		const httpClientWithAuthFlag = httpClient as typeof httpClient & {
			__authInterceptorAttached?: boolean;
		};

		if (!httpClientWithAuthFlag.__authInterceptorAttached) {
			httpClientWithAuthFlag.addRequestInterceptor(createAuthTokenRequestInterceptor(authAdapter));
			httpClientWithAuthFlag.__authInterceptorAttached = true;
		}
	}, [authAdapter]);
}

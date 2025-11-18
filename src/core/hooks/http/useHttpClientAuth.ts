/**
 * Hook to attach auth interceptor to httpClient
 * Ensures the auth token interceptor is attached to the httpClient instance
 * if not already attached.
 *
 * @param authAdapter - The auth adapter to use for token retrieval
 */
import { createAuthTokenRequestInterceptor } from '@core/lib/http/httpAuthInterceptor';
import { httpClient } from '@core/lib/http/httpClient';
import type { RequestInterceptor } from '@core/lib/http/httpClientInterceptors';
import type { AuthPort } from '@core/ports/AuthPort';
import { useEffect } from 'react';

export function useHttpClientAuth(authAdapter: AuthPort): void {
	useEffect(() => {
		const httpClientWithAuthFlag = httpClient as typeof httpClient & {
			__authInterceptorAttached?: boolean;
			__authInterceptorCleanup?: (() => void) | null;
			__authInterceptorAdapter?: AuthPort | undefined;
			__authInterceptorSubscribers?: number;
			removeRequestInterceptor: (interceptor: RequestInterceptor) => void;
		};

		const ensureAuthInterceptor = () => {
			if (httpClientWithAuthFlag.__authInterceptorAttached) {
				if (httpClientWithAuthFlag.__authInterceptorAdapter === authAdapter) {
					return;
				}

				httpClientWithAuthFlag.__authInterceptorCleanup?.();
			}

			const interceptor = createAuthTokenRequestInterceptor(authAdapter);
			httpClientWithAuthFlag.addRequestInterceptor(interceptor);
			httpClientWithAuthFlag.__authInterceptorAttached = true;
			httpClientWithAuthFlag.__authInterceptorAdapter = authAdapter;
			httpClientWithAuthFlag.__authInterceptorCleanup = () => {
				httpClientWithAuthFlag.removeRequestInterceptor(interceptor);
				httpClientWithAuthFlag.__authInterceptorAttached = false;
				httpClientWithAuthFlag.__authInterceptorAdapter = undefined;
				httpClientWithAuthFlag.__authInterceptorCleanup = null;
				httpClientWithAuthFlag.__authInterceptorSubscribers = 0;
			};
		};

		ensureAuthInterceptor();

		httpClientWithAuthFlag.__authInterceptorSubscribers =
			(httpClientWithAuthFlag.__authInterceptorSubscribers ?? 0) + 1;

		return () => {
			const subscribers = httpClientWithAuthFlag.__authInterceptorSubscribers ?? 0;
			const nextSubscribers = Math.max(subscribers - 1, 0);
			httpClientWithAuthFlag.__authInterceptorSubscribers = nextSubscribers;

			if (nextSubscribers === 0) {
				httpClientWithAuthFlag.__authInterceptorCleanup?.();
			}
		};
	}, [authAdapter]);
}

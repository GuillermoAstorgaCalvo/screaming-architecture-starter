import { useHttpClientAuth } from '@core/hooks/http/useHttpClientAuth';
import * as httpAuthInterceptor from '@core/lib/http/httpAuthInterceptor';
import { httpClient } from '@core/lib/http/httpClient';
import type { RequestInterceptor } from '@core/lib/http/httpClientInterceptors';
import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type HttpClientWithInternals = typeof httpClient & {
	__authInterceptorAttached?: boolean;
	__authInterceptorCleanup?: (() => void) | null;
	__authInterceptorSubscribers?: number;
	__authInterceptorAdapter?: AuthPort | undefined;
};

const getHttpClientWithInternals = () => httpClient as HttpClientWithInternals;

const getRequestInterceptors = () =>
	(httpClient as unknown as { requestInterceptors: RequestInterceptor[] }).requestInterceptors;

const resetHttpClientState = () => {
	const client = getHttpClientWithInternals();
	client.__authInterceptorCleanup?.();
	client.__authInterceptorAttached = false;
	client.__authInterceptorCleanup = null;
	client.__authInterceptorSubscribers = 0;
	client.__authInterceptorAdapter = undefined;
	getRequestInterceptors().length = 0;
};

const createMockAuthAdapter = (tokenPrefix = 'token'): AuthPort => {
	const tokens: AuthTokens = {
		accessToken: `${tokenPrefix}-access`,
		refreshToken: `${tokenPrefix}-refresh`,
	};
	return {
		getTokens: vi.fn().mockReturnValue(tokens),
		getAccessToken: vi.fn().mockReturnValue(tokens.accessToken),
		getRefreshToken: vi.fn().mockReturnValue(tokens.refreshToken),
		setTokens: vi.fn(),
		clearTokens: vi.fn(),
		subscribe: vi.fn().mockReturnValue(() => {}),
		decode: vi.fn().mockReturnValue(null),
		isTokenExpired: vi.fn().mockReturnValue(false),
	};
};

describe('useHttpClientAuth', () => {
	beforeEach(() => {
		resetHttpClientState();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		resetHttpClientState();
	});

	it('attaches the auth interceptor to the httpClient', async () => {
		const authAdapter = createMockAuthAdapter();
		renderHook(() => useHttpClientAuth(authAdapter));

		await waitFor(() => {
			expect(getRequestInterceptors()).toHaveLength(1);
			expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(true);
		});
	});

	it('attaches the interceptor only once for repeated renders with the same adapter', async () => {
		const authAdapter = createMockAuthAdapter();
		const { rerender } = renderHook(({ auth }) => useHttpClientAuth(auth), {
			initialProps: { auth: authAdapter },
		});

		await waitFor(() => expect(getRequestInterceptors()).toHaveLength(1));
		const [initialInterceptor] = getRequestInterceptors();

		rerender({ auth: authAdapter });

		await waitFor(() => {
			expect(getRequestInterceptors()).toHaveLength(1);
			expect(getRequestInterceptors()[0]).toBe(initialInterceptor);
		});
	});

	it('cleans up the interceptor on unmount', async () => {
		const authAdapter = createMockAuthAdapter();
		const { unmount } = renderHook(() => useHttpClientAuth(authAdapter));

		await waitFor(() => expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(true));

		unmount();

		await waitFor(() => {
			expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(false);
			expect(getRequestInterceptors()).toHaveLength(0);
		});
	});

	it('reattaches the interceptor when the adapter changes', async () => {
		const adapterA = createMockAuthAdapter('alpha');
		const adapterB = createMockAuthAdapter('beta');

		const createInterceptorSpy = vi.spyOn(httpAuthInterceptor, 'createAuthTokenRequestInterceptor');

		const { rerender } = renderHook(({ auth }) => useHttpClientAuth(auth), {
			initialProps: { auth: adapterA },
		});

		await waitFor(() => expect(getRequestInterceptors()).toHaveLength(1));
		const [firstInterceptor] = getRequestInterceptors();

		rerender({ auth: adapterB });

		await waitFor(() => {
			expect(getRequestInterceptors()).toHaveLength(1);
			expect(getRequestInterceptors()[0]).not.toBe(firstInterceptor);
		});

		expect(createInterceptorSpy).toHaveBeenCalledWith(adapterA);
		expect(createInterceptorSpy).toHaveBeenCalledWith(adapterB);
	});
});

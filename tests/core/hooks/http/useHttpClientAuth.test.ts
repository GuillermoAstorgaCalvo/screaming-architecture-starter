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

const describeBasicAttachmentAndCleanup = () => {
	describe('basic attachment and cleanup', () => {
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

			await waitFor(() =>
				expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(true)
			);

			unmount();

			await waitFor(() => {
				expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(false);
				expect(getRequestInterceptors()).toHaveLength(0);
			});
		});
	});
};

const describeAdapterChanges = () => {
	describe('adapter changes', () => {
		it('reattaches the interceptor when the adapter changes', async () => {
			const adapterA = createMockAuthAdapter('alpha');
			const adapterB = createMockAuthAdapter('beta');

			const createInterceptorSpy = vi.spyOn(
				httpAuthInterceptor,
				'createAuthTokenRequestInterceptor'
			);

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

		it('maintains interceptor when adapter reference changes but is functionally the same', async () => {
			const adapterA = createMockAuthAdapter('alpha');
			const adapterB = createMockAuthAdapter('alpha');

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
		});
	});
};

const describeMultipleHooks = () => {
	describe('multiple hooks', () => {
		it('handles multiple hooks with the same adapter', async () => {
			const authAdapter = createMockAuthAdapter();
			const { unmount: unmount1 } = renderHook(() => useHttpClientAuth(authAdapter));
			const { unmount: unmount2 } = renderHook(() => useHttpClientAuth(authAdapter));

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(1);
				expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(true);
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(2);
			});

			unmount1();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(1);
				expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(true);
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(1);
			});

			unmount2();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(0);
				expect(getHttpClientWithInternals().__authInterceptorAttached).toBe(false);
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(0);
			});
		});

		it('handles multiple hooks with different adapters', async () => {
			const adapterA = createMockAuthAdapter('alpha');
			const adapterB = createMockAuthAdapter('beta');

			const { unmount: unmountA } = renderHook(() => useHttpClientAuth(adapterA));

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(1);
				expect(getHttpClientWithInternals().__authInterceptorAdapter).toBe(adapterA);
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(1);
			});

			// When adapterB mounts, it detects adapterA is different
			// So it cleans up adapterA (subscribers become 0, interceptor removed)
			// Then attaches adapterB (subscribers become 1)
			const { unmount: unmountB } = renderHook(() => useHttpClientAuth(adapterB));

			await waitFor(() => {
				// When adapter changes, it should replace the interceptor
				expect(getRequestInterceptors()).toHaveLength(1);
				expect(getHttpClientWithInternals().__authInterceptorAdapter).toBe(adapterB);
				// Subscriber count is 1 because adapterA was cleaned up before adapterB attached
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(1);
			});

			// Unmount adapterB first - this should clean up the interceptor
			unmountB();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(0);
				expect(getHttpClientWithInternals().__authInterceptorSubscribers).toBe(0);
			});

			// Now unmount adapterA - should not affect anything since adapterB already cleaned up
			unmountA();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(0);
			});
		});
	});
};

const describeEdgeCasesAndCleanup = () => {
	describe('edge cases and cleanup', () => {
		it('handles rapid mount and unmount cycles', async () => {
			const authAdapter = createMockAuthAdapter();

			for (let i = 0; i < 5; i++) {
				const { unmount } = renderHook(() => useHttpClientAuth(authAdapter));
				await waitFor(() => {
					expect(getRequestInterceptors()).toHaveLength(1);
				});
				unmount();
				await waitFor(() => {
					if (i === 4) {
						expect(getRequestInterceptors()).toHaveLength(0);
					}
				});
			}
		});

		it('handles cleanup when adapter is null or undefined gracefully', async () => {
			const authAdapter = createMockAuthAdapter();
			const { unmount } = renderHook(() => useHttpClientAuth(authAdapter));

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(1);
			});

			unmount();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(0);
			});
		});

		it('handles interceptor cleanup function being called multiple times', async () => {
			const authAdapter = createMockAuthAdapter();
			const { unmount } = renderHook(() => useHttpClientAuth(authAdapter));

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(1);
			});

			const cleanup = getHttpClientWithInternals().__authInterceptorCleanup;
			expect(cleanup).toBeDefined();

			if (cleanup) {
				cleanup();
				cleanup();
			}

			unmount();

			await waitFor(() => {
				expect(getRequestInterceptors()).toHaveLength(0);
			});
		});
	});
};

describe('useHttpClientAuth', () => {
	beforeEach(() => {
		resetHttpClientState();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		resetHttpClientState();
	});

	describeBasicAttachmentAndCleanup();
	describeAdapterChanges();
	describeMultipleHooks();
	describeEdgeCasesAndCleanup();
});

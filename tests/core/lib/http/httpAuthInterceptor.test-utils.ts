import type { RequestInterceptor } from '@core/lib/http/httpClientInterceptors';
import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import type { HttpClientConfig } from '@core/ports/HttpPort';
import { vi } from 'vitest';

export const AUTHORIZATION_HEADER = 'Authorization';
export const TEST_TOKEN = 'test-token';
export const BEARER_PREFIX = 'Bearer';
export const X_AUTH_TOKEN_HEADER = 'X-Auth-Token';
export const X_CUSTOM_HEADER = 'X-Custom-Header';

export const createMockAuthAdapter = (tokens: AuthTokens | null = null): AuthPort => {
	const defaultTokens: AuthTokens = {
		accessToken: 'test-access-token',
		refreshToken: 'test-refresh-token',
		expiresAt: Date.now() + 3600000,
	};
	const mockTokens = tokens === null ? null : tokens || defaultTokens;

	return {
		getTokens: vi.fn().mockReturnValue(mockTokens),
		getAccessToken: vi.fn().mockReturnValue(mockTokens?.accessToken ?? null),
		getRefreshToken: vi.fn().mockReturnValue(mockTokens?.refreshToken ?? null),
		setTokens: vi.fn(),
		clearTokens: vi.fn(),
		subscribe: vi.fn().mockReturnValue(() => {}),
		decode: vi.fn().mockReturnValue(null),
		isTokenExpired: vi.fn().mockReturnValue(false),
	};
};

export const createMockConfig = (
	overrides?: Partial<HttpClientConfig & { url: string }>
): HttpClientConfig & { url: string } => ({
	url: '/api/test',
	method: 'GET',
	headers: {},
	...overrides,
});

export const setupNullTokenAuth = (auth: AuthPort): void => {
	(auth.getTokens as ReturnType<typeof vi.fn>).mockReturnValue(null);
	(auth.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue(null);
};

export const executeInterceptor = (
	interceptor: RequestInterceptor,
	config: HttpClientConfig & { url: string }
): HttpClientConfig & { url: string } => {
	const result = interceptor(config);
	if (result instanceof Promise) {
		throw new TypeError('Interceptor returned a Promise, but tests expect synchronous execution');
	}
	return result;
};

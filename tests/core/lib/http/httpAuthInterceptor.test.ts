import { createAuthTokenRequestInterceptor } from '@core/lib/http/httpAuthInterceptor';
import { describe, expect, it, vi } from 'vitest';

import {
	AUTHORIZATION_HEADER,
	BEARER_PREFIX,
	createMockAuthAdapter,
	createMockConfig,
	executeInterceptor,
	setupNullTokenAuth,
	TEST_TOKEN,
	X_AUTH_TOKEN_HEADER,
	X_CUSTOM_HEADER,
} from './httpAuthInterceptor.test-utils';

describe('createAuthTokenRequestInterceptor - token injection', () => {
	it('injects access token from tokens when available', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'my-access-token',
			refreshToken: 'my-refresh-token',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} my-access-token`);
		expect(auth.getTokens).toHaveBeenCalled();
	});

	it('injects access token from getAccessToken when tokens is null', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		(auth.getAccessToken as ReturnType<typeof vi.fn>).mockReturnValue('fallback-token');
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} fallback-token`);
		expect(auth.getAccessToken).toHaveBeenCalled();
	});

	it('does not inject token when no token is available', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(result).toBe(config);
	});

	it('preserves existing headers when injecting token', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig({
			headers: {
				'Content-Type': 'application/json',
				[X_CUSTOM_HEADER]: 'custom-value',
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty('Content-Type', 'application/json');
		expect(result.headers).toHaveProperty(X_CUSTOM_HEADER, 'custom-value');
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});
});
describe('createAuthTokenRequestInterceptor - token scheme', () => {
	it('uses Bearer scheme by default', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});

	it('uses custom scheme when provided', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			scheme: 'Custom',
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `Custom ${TEST_TOKEN}`);
	});

	it('omits scheme when scheme is null', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			scheme: null,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, TEST_TOKEN);
	});

	it('omits scheme when scheme is empty string', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			scheme: '',
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, TEST_TOKEN);
	});
});
describe('createAuthTokenRequestInterceptor - header name customization', () => {
	it('uses Authorization header by default', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER);
	});

	it('uses custom header name when provided', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: X_AUTH_TOKEN_HEADER,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(X_AUTH_TOKEN_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
	});

	it('normalizes header name case (lowercase input)', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: 'x-custom-header',
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(X_CUSTOM_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});

	it('normalizes header name case (mixed case input)', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: 'X-CuStOm-HeAdEr',
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(X_CUSTOM_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});
});
describe('createAuthTokenRequestInterceptor - shouldAttach predicate', () => {
	it('attaches token when shouldAttach returns true', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach: () => true,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});

	it('does not attach token when shouldAttach returns false', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach: () => false,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(result).toBe(config);
	});
});
describe('createAuthTokenRequestInterceptor - shouldAttach predicate - parameter passing', () => {
	it('passes config and tokens to shouldAttach predicate', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const shouldAttach = vi.fn().mockReturnValue(true);
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach,
		});
		const config = createMockConfig({
			url: '/api/specific-endpoint',
			method: 'POST',
		});

		executeInterceptor(interceptor, config);

		expect(shouldAttach).toHaveBeenCalledWith(
			expect.objectContaining({
				url: '/api/specific-endpoint',
				method: 'POST',
			}),
			expect.objectContaining({
				accessToken: TEST_TOKEN,
			})
		);
	});

	it('does not attach token when tokens is null and shouldAttach receives null', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		const shouldAttach = vi.fn().mockReturnValue(true);
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach,
		});
		const config = createMockConfig();

		executeInterceptor(interceptor, config);

		expect(shouldAttach).toHaveBeenCalledWith(expect.any(Object), null);
	});

	it('skips token injection when shouldAttach returns false even if token exists', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach: config => config.url !== '/api/public',
		});
		const publicConfig = createMockConfig({ url: '/api/public' });
		const privateConfig = createMockConfig({ url: '/api/private' });

		const publicResult = executeInterceptor(interceptor, publicConfig);
		const privateResult = executeInterceptor(interceptor, privateConfig);

		expect(publicResult.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(privateResult.headers).toHaveProperty(
			AUTHORIZATION_HEADER,
			`${BEARER_PREFIX} ${TEST_TOKEN}`
		);
	});
});
describe('createAuthTokenRequestInterceptor - custom token selector', () => {
	it('uses custom token selector when provided', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'access-token',
			refreshToken: 'refresh-token',
		});
		const getToken = vi.fn().mockReturnValue('custom-token');
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			getToken,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} custom-token`);
		expect(getToken).toHaveBeenCalledWith({
			auth,
			config: expect.objectContaining({ url: '/api/test' }),
			tokens: expect.objectContaining({ accessToken: 'access-token' }),
		});
	});

	it('falls back to default token selection when custom selector returns null', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'fallback-token',
		});
		const getToken = vi.fn().mockReturnValue(null);
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			getToken,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} fallback-token`);
	});
});
describe('createAuthTokenRequestInterceptor - custom token selector - edge cases', () => {
	it('does not inject token when custom selector returns null and no fallback token', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		const getToken = vi.fn().mockReturnValue(null);
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			getToken,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(result).toBe(config);
	});
});
describe('createAuthTokenRequestInterceptor - custom token selector - parameter passing', () => {
	it('passes auth, config, and tokens to custom token selector', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const getToken = vi.fn().mockReturnValue('selected-token');
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			getToken,
		});
		const config = createMockConfig({
			url: '/api/custom',
			method: 'PUT',
		});

		executeInterceptor(interceptor, config);

		expect(getToken).toHaveBeenCalledWith({
			auth,
			config: expect.objectContaining({
				url: '/api/custom',
				method: 'PUT',
			}),
			tokens: expect.objectContaining({
				accessToken: TEST_TOKEN,
			}),
		});
	});
});

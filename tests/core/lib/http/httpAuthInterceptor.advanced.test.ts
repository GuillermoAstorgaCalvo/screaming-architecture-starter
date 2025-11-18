import { createAuthTokenRequestInterceptor } from '@core/lib/http/httpAuthInterceptor';
import { describe, expect, it } from 'vitest';

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

describe('createAuthTokenRequestInterceptor - header collision detection', () => {
	it('does not override existing Authorization header', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'new-token',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig({
			headers: {
				Authorization: `${BEARER_PREFIX} existing-token`,
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} existing-token`);
	});

	it('does not override existing header with different case', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'new-token',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig({
			headers: {
				authorization: `${BEARER_PREFIX} existing-token`,
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty('authorization', `${BEARER_PREFIX} existing-token`);
		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
	});
});
describe('createAuthTokenRequestInterceptor - header collision detection - custom headers', () => {
	it('does not override existing custom header', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'new-token',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: X_AUTH_TOKEN_HEADER,
		});
		const config = createMockConfig({
			headers: {
				[X_AUTH_TOKEN_HEADER]: 'existing-token',
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(X_AUTH_TOKEN_HEADER, 'existing-token');
	});

	it('does not override existing header with different case (custom header)', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'new-token',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: X_CUSTOM_HEADER,
		});
		const config = createMockConfig({
			headers: {
				'x-custom-header': 'existing-value',
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty('x-custom-header', 'existing-value');
	});

	it('handles undefined headers gracefully', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		delete (config as { headers?: unknown }).headers;

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});
});
describe('createAuthTokenRequestInterceptor - interceptor attachment', () => {
	it('returns a function that can be used as a request interceptor', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);

		expect(typeof interceptor).toBe('function');
	});

	it('returns modified config object (not mutating original)', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig({
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result).not.toBe(config);
		expect(result.headers).not.toBe(config.headers);
		expect(config.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
	});
});
describe('createAuthTokenRequestInterceptor - interceptor attachment - config preservation', () => {
	it('preserves all config properties when modifying headers', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig({
			url: '/api/test',
			method: 'POST',
			body: { key: 'value' },
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const result = executeInterceptor(interceptor, config);

		expect(result.url).toBe('/api/test');
		expect(result.method).toBe('POST');
		expect(result.body).toEqual({ key: 'value' });
		expect(result.timeout).toBe(5000);
		expect(result.headers).toHaveProperty('Content-Type', 'application/json');
		expect(result.headers).toHaveProperty(AUTHORIZATION_HEADER, `${BEARER_PREFIX} ${TEST_TOKEN}`);
	});

	it('returns original config when no modifications are needed', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result).toBe(config);
	});
});
describe('createAuthTokenRequestInterceptor - edge cases', () => {
	it('handles empty token string', () => {
		const auth = createMockAuthAdapter({
			accessToken: '',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);
		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(result).toBe(config);
	});

	it('handles token with special characters', () => {
		const auth = createMockAuthAdapter({
			accessToken: 'token.with-special_chars@123',
		});
		const interceptor = createAuthTokenRequestInterceptor(auth);
		const config = createMockConfig();
		const result = executeInterceptor(interceptor, config);
		expect(result.headers).toHaveProperty(
			AUTHORIZATION_HEADER,
			`${BEARER_PREFIX} token.with-special_chars@123`
		);
	});

	it('handles multiple header segments correctly', () => {
		const auth = createMockAuthAdapter({
			accessToken: TEST_TOKEN,
		});
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			header: 'x-multi-segment-header-name',
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).toHaveProperty(
			'X-Multi-Segment-Header-Name',
			`${BEARER_PREFIX} ${TEST_TOKEN}`
		);
	});

	it('handles shouldAttach that depends on tokens being null', () => {
		const auth = createMockAuthAdapter(null);
		setupNullTokenAuth(auth);
		const interceptor = createAuthTokenRequestInterceptor(auth, {
			shouldAttach: (_config, tokens) => tokens !== null,
		});
		const config = createMockConfig();

		const result = executeInterceptor(interceptor, config);

		expect(result.headers).not.toHaveProperty(AUTHORIZATION_HEADER);
		expect(result).toBe(config);
	});
});

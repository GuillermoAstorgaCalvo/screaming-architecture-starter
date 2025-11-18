import { createApiService } from '@core/api/createApiService';
import type { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { beforeEach, describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

function createServiceWithDefaultConfig(
	http: MockHttpAdapter,
	defaultConfig: { headers?: Record<string, string>; timeout?: number }
) {
	return createApiService(http, {
		endpoint: API_ENDPOINT,
		defaultConfig,
	});
}

function createServiceWithRequestMapper<T>(
	http: MockHttpAdapter,
	requestMapper: (args: { request: T }) => { query?: Record<string, unknown>; path?: string }
) {
	return createApiService<T>(http, {
		endpoint: API_ENDPOINT,
		requestMapper,
	});
}

function assertRequestCount(http: MockHttpAdapter, expectedCount: number) {
	expect(http.requests).toHaveLength(expectedCount);
}

function assertRequestHeaders(http: MockHttpAdapter, expectedHeaders: Record<string, string>) {
	expect(http.requests[0]?.config?.headers).toMatchObject(expectedHeaders);
}

function assertRequestTimeout(http: MockHttpAdapter, expectedTimeout: number) {
	expect(http.requests[0]?.config?.timeout).toBe(expectedTimeout);
}

function assertRequestUrlContains(http: MockHttpAdapter, ...substrings: string[]) {
	for (const substring of substrings) {
		expect(http.requests[0]?.url).toContain(substring);
	}
}

function assertRequestUrlEquals(http: MockHttpAdapter, expectedUrl: string) {
	expect(http.requests[0]?.url).toBe(expectedUrl);
}

function assertRequestSignal(http: MockHttpAdapter, expectedSignal: AbortSignal) {
	expect(http.requests[0]?.config?.signal).toBe(expectedSignal);
}

describe('createApiService - Request Configuration', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Config Merging', () => {
		it('merges defaultConfig with request config', async () => {
			const service = createServiceWithDefaultConfig(http, {
				headers: { 'X-Custom': 'default' },
				timeout: 5000,
			});
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({});
			assertRequestCount(http, 1);
			assertRequestHeaders(http, { 'X-Custom': 'default' });
			assertRequestTimeout(http, 5000);
		});
		it('merges options with default config', async () => {
			const service = createServiceWithDefaultConfig(http, { headers: { 'X-Default': 'default' } });
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({}, { headers: { 'X-Custom': 'override' }, timeout: 10000 });
			assertRequestCount(http, 1);
			assertRequestHeaders(http, { 'X-Default': 'default', 'X-Custom': 'override' });
			assertRequestTimeout(http, 10000);
		});
	});

	describe('Request Mapper Options', () => {
		it('handles query parameters from requestMapper', async () => {
			const service = createServiceWithRequestMapper<{ page: number }>(http, ({ request }) => ({
				query: { page: request.page, limit: 10 },
			}));
			http.mockResponse(`${API_ENDPOINT}?page=1&limit=10`, 'GET', createMockHttpResponse([]));
			await service.execute({ page: 1 });
			assertRequestCount(http, 1);
			assertRequestUrlContains(http, 'page=1', 'limit=10');
		});
		it('handles path override from requestMapper', async () => {
			const service = createServiceWithRequestMapper<{ id: string }>(http, ({ request }) => ({
				path: `/api/users/${request.id}`,
			}));
			http.mockResponse('/api/users/123', 'GET', createMockHttpResponse({ id: '123' }));
			await service.execute({ id: '123' });
			assertRequestCount(http, 1);
			assertRequestUrlEquals(http, '/api/users/123');
		});
	});

	describe('Execute Options', () => {
		it('handles AbortSignal from options', async () => {
			const service = createApiService(http, { endpoint: API_ENDPOINT });
			const abortController = new AbortController();
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));
			await service.execute({}, { signal: abortController.signal });
			assertRequestCount(http, 1);
			assertRequestSignal(http, abortController.signal);
		});
	});
});

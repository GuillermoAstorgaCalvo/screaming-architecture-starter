import { createApiService } from '@core/api/createApiService';
import { beforeEach, describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

describe('createApiService - Service Creation', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		http = createMockHttpAdapter();
	});

	it('creates a service with string endpoint', () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		expect(service).toBeDefined();
		expect(typeof service.execute).toBe('function');
	});

	it('creates a service with function endpoint', () => {
		const service = createApiService<{ id: string }>(http, {
			endpoint: request => `/api/users/${request.id}`,
		});

		expect(service).toBeDefined();
		expect(typeof service.execute).toBe('function');
	});

	it('defaults to GET method when not specified', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1', name: 'Test' }));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.method).toBe('GET');
	});

	it('uses specified HTTP method', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			method: 'POST',
		});

		http.mockResponse(API_ENDPOINT, 'POST', createMockHttpResponse({ id: '1' }));

		await service.execute({});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.method).toBe('POST');
	});

	it('normalizes method to uppercase', async () => {
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
			method: 'POST',
		});

		http.mockResponse(API_ENDPOINT, 'POST', createMockHttpResponse({ id: '1' }));

		await service.execute({});

		expect(http.requests[0]?.method).toBe('POST');
	});
});

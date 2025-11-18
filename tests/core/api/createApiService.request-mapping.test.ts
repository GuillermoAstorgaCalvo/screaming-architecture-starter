import { createApiService } from '@core/api/createApiService';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
import { beforeEach, describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

const USER_ENDPOINT = '/api/users/1';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

describe('createApiService - Request Execution', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('executes request and returns success result', async () => {
		const service = createApiService<{ id: string }, { id: string; name: string }>(http, {
			endpoint: request => `/api/users/${request.id}`,
		});

		const mockResponse = createMockHttpResponse<{ id: string; name: string }>({
			id: '1',
			name: 'Test User',
		});

		http.mockResponse(USER_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({ id: '1' });

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			expect(result.data.data).toEqual({ id: '1', name: 'Test User' });
			expect(result.data.status).toBe(200);
			expect(result.data.statusText).toBe('OK');
		}
	});
});

describe('createApiService - Request Mapping', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('maps request using requestMapper', async () => {
		const service = createApiService<{ name: string; email: string }>(http, {
			endpoint: API_ENDPOINT,
			method: 'POST',
			requestMapper: ({ request }) => ({
				body: request,
				query: { include: 'profile' },
			}),
		});

		http.mockResponse(
			`${API_ENDPOINT}?include=profile`,
			'POST',
			createMockHttpResponse({ id: '1', name: 'Test' })
		);

		await service.execute({ name: 'Test', email: 'test@example.com' });

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.body).toEqual({ name: 'Test', email: 'test@example.com' });
		expect(http.requests[0]?.url).toContain('include=profile');
	});
});

describe('createApiService - Response Mapping', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('uses default response mapper when not provided', async () => {
		const service = createApiService<unknown, { data: { id: string } }>(http, {
			endpoint: API_ENDPOINT,
		});

		const mockResponse = createMockHttpResponse<{ data: { id: string } }>({ data: { id: '1' } });

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			// Default mapper extracts data from envelope
			expect(result.data.data).toEqual({ id: '1' });
		}
	});

	it('uses custom response mapper', async () => {
		const service = createApiService<unknown, RawResponse, MappedResponse>(http, {
			endpoint: USER_ENDPOINT,
			responseMapper: context => ({
				id: context.raw.user.id,
				name: context.raw.user.full_name,
			}),
		});

		const mockResponse = createRawResponseMock({
			id: '1',
			full_name: 'Test User',
		});

		http.mockResponse(USER_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			expect(result.data.data).toEqual({ id: '1', name: 'Test User' });
		}
	});
});

describe('createApiService - Response Envelope Handling', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	it('handles response without envelope', async () => {
		const service = createApiService<unknown, { id: string; name: string }>(http, {
			endpoint: API_ENDPOINT,
		});

		const mockResponse = createMockHttpResponse<{ id: string; name: string }>({
			id: '1',
			name: 'Test',
		});

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			expect(result.data.data).toEqual({ id: '1', name: 'Test' });
		}
	});

	it('extracts apiMeta from response', async () => {
		const service = createApiService<unknown, ResponseWithMeta>(http, {
			endpoint: API_ENDPOINT,
		});

		const mockResponse = createResponseWithMetaMock({
			data: { id: '1' },
			apiMeta: {
				version: '1.0.0',
				requestId: 'req-123',
				timestamp: '2024-01-01T00:00:00Z',
			},
		});

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			expect(result.data.apiMeta).toEqual({
				version: '1.0.0',
				requestId: 'req-123',
				timestamp: '2024-01-01T00:00:00Z',
			});
		}
	});

	it('preserves rawData in response', async () => {
		const rawData = { id: '1', name: 'Test' };
		const service = createApiService<unknown, typeof rawData>(http, {
			endpoint: API_ENDPOINT,
		});

		const mockResponse = createMockHttpResponse(rawData);

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});

		expect(isSuccess(result)).toBe(true);
		if (isSuccess(result)) {
			expect(result.data.rawData).toEqual(rawData);
		}
	});
});

interface RawResponse {
	user: {
		id: string;
		full_name: string;
	};
}

interface MappedResponse {
	id: string;
	name: string;
}

interface ResponseWithMeta {
	data: { id: string };
	apiMeta: {
		version: string;
		requestId: string;
		timestamp: string;
	};
}

function createRawResponseMock(data: RawResponse['user']): HttpClientResponse<RawResponse> {
	return {
		data: { user: data },
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

function createResponseWithMetaMock<T extends { data: unknown; apiMeta: unknown }>(
	data: T
): HttpClientResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

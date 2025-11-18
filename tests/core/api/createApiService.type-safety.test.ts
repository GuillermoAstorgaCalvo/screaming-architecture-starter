import { createApiService } from '@core/api/createApiService';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
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

interface RawResponse {
	data: {
		user: {
			id: string;
			full_name: string;
		};
	};
}

interface MappedResponse {
	id: string;
	name: string;
}

function createRawResponseMock(): HttpClientResponse<RawResponse> {
	return {
		data: {
			data: {
				user: {
					id: '1',
					full_name: 'Test User',
				},
			},
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

function createServiceWithMapper(http: ReturnType<typeof createMockHttpAdapter>) {
	return createApiService<unknown, RawResponse, MappedResponse>(http, {
		endpoint: API_ENDPOINT,
		responseMapper: context => ({
			id: context.raw.data.user.id,
			name: context.raw.data.user.full_name,
		}),
	});
}

function assertMappedResponse(mapped: MappedResponse) {
	expect(mapped.id).toBe('1');
	expect(mapped.name).toBe('Test User');
}

function assertRawResponse(raw: RawResponse) {
	expect(raw.data.user.id).toBe('1');
}

async function testRequestTypeSafety(http: ReturnType<typeof createMockHttpAdapter>) {
	interface UserRequest {
		id: string;
	}

	const service = createApiService<UserRequest, { id: string; name: string }>(http, {
		endpoint: request => `/api/users/${request.id}`,
	});

	http.mockResponse('/api/users/1', 'GET', createMockHttpResponse({ id: '1', name: 'Test' }));

	const result = await service.execute({ id: '1' });
	expect(isSuccess(result)).toBe(true);
}

async function testResponseTypeSafety(http: ReturnType<typeof createMockHttpAdapter>) {
	interface UserResponse {
		id: string;
		name: string;
	}

	const service = createApiService<unknown, UserResponse>(http, {
		endpoint: API_ENDPOINT,
	});

	const mockResponse = createMockHttpResponse<UserResponse>({ id: '1', name: 'Test' });
	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});
	expect(isSuccess(result)).toBe(true);

	if (isSuccess(result)) {
		const user: UserResponse = result.data.data;
		expect(user.id).toBe('1');
		expect(user.name).toBe('Test');
	}
}

async function testMappedResponse(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createServiceWithMapper(http);
	const mockResponse = createRawResponseMock();

	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});
	expect(isSuccess(result)).toBe(true);

	if (isSuccess(result)) {
		const mapped: MappedResponse = result.data.data;
		assertMappedResponse(mapped);
	}
}

async function testRawResponsePreservation(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createServiceWithMapper(http);
	const mockResponse = createRawResponseMock();

	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});
	expect(isSuccess(result)).toBe(true);

	if (isSuccess(result)) {
		const raw: RawResponse = result.data.rawData;
		assertRawResponse(raw);
	}
}

describe('createApiService - Type Safety', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Request Types', () => {
		it('maintains type safety for request types', async () => {
			await testRequestTypeSafety(http);
		});
	});

	describe('Response Types', () => {
		it('maintains type safety for response types', async () => {
			await testResponseTypeSafety(http);
		});
	});

	describe('Raw and Mapped Types', () => {
		it('creates service with raw and mapped response types', () => {
			const service = createServiceWithMapper(http);
			expect(service).toBeDefined();
		});

		it('maps raw response to mapped response type', async () => {
			await testMappedResponse(http);
		});

		it('preserves raw response data', async () => {
			await testRawResponsePreservation(http);
		});
	});
});

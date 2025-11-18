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

interface ResponseWithMessage {
	data: { id: string };
	message: string;
}

interface ResponseWithMetadata {
	data: { id: string };
	metadata: { count: number };
}

interface ResponseWithPartialMeta {
	data: { id: string };
	apiMeta: {
		version?: string;
		requestId?: string;
		timestamp?: string;
	};
}

function createMockResponseWithMessage(): HttpClientResponse<ResponseWithMessage> {
	return {
		data: {
			data: { id: '1' },
			message: 'Success',
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

function createMockResponseWithMetadata(): HttpClientResponse<ResponseWithMetadata> {
	return {
		data: {
			data: { id: '1' },
			metadata: { count: 10 },
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

function createMockResponseWithPartialMeta(): HttpClientResponse<ResponseWithPartialMeta> {
	return {
		data: {
			data: { id: '1' },
			apiMeta: {
				version: '1.0.0',
			},
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

async function testEmptyRequestObject(
	http: ReturnType<typeof createMockHttpAdapter>
): Promise<void> {
	const service = createApiService<Record<string, never>>(http, {
		endpoint: API_ENDPOINT,
	});

	http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse([]));

	const result = await service.execute({});

	expect(isSuccess(result)).toBe(true);
}

async function testResponseWithMessage(
	http: ReturnType<typeof createMockHttpAdapter>
): Promise<void> {
	const service = createApiService<unknown, ResponseWithMessage>(http, {
		endpoint: API_ENDPOINT,
	});

	const mockResponse = createMockResponseWithMessage();
	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});

	expect(isSuccess(result)).toBe(true);
	if (isSuccess(result)) {
		expect(result.data.message).toBe('Success');
	}
}

async function testResponseWithMetadata(
	http: ReturnType<typeof createMockHttpAdapter>
): Promise<void> {
	const service = createApiService<unknown, ResponseWithMetadata>(http, {
		endpoint: API_ENDPOINT,
	});

	const mockResponse = createMockResponseWithMetadata();
	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});

	expect(isSuccess(result)).toBe(true);
	if (isSuccess(result)) {
		expect(result.data.metadata).toEqual({ count: 10 });
	}
}

async function testRequestMapperUndefined(
	http: ReturnType<typeof createMockHttpAdapter>
): Promise<void> {
	const service = createApiService(http, {
		endpoint: API_ENDPOINT,
		requestMapper: () => undefined,
	});

	http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

	const result = await service.execute({});

	expect(isSuccess(result)).toBe(true);
}

async function testPartialApiMeta(http: ReturnType<typeof createMockHttpAdapter>): Promise<void> {
	const service = createApiService<unknown, ResponseWithPartialMeta>(http, {
		endpoint: API_ENDPOINT,
	});

	const mockResponse = createMockResponseWithPartialMeta();
	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});

	expect(isSuccess(result)).toBe(true);
	if (isSuccess(result)) {
		expect(result.data.apiMeta).toEqual({ version: '1.0.0' });
	}
}

describe('createApiService - Edge Cases', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Empty Requests', () => {
		it('handles empty request object', () => testEmptyRequestObject(http));
	});

	describe('Response Envelopes', () => {
		it('handles response with message in envelope', () => testResponseWithMessage(http));

		it('handles response with metadata in envelope', () => testResponseWithMetadata(http));
	});

	describe('Optional Mappers', () => {
		it('handles requestMapper returning undefined', () => testRequestMapperUndefined(http));
	});

	describe('Partial Metadata', () => {
		it('handles partial apiMeta in response', () => testPartialApiMeta(http));
	});
});

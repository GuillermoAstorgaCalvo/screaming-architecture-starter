import { createApiService } from '@core/api/createApiService';
import type { ApiServiceResult } from '@core/api/createApiService.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { isFailure } from '@src-types/result';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { API_ENDPOINT, createMockHttpAdapter } from './createApiService.test-utils';

const NETWORK_ERROR_MESSAGE = 'Network error';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

function expectErrorResult<TResponse, TRawResponse>(
	result: ApiServiceResult<TResponse, TRawResponse>
): result is Extract<ApiServiceResult<TResponse, TRawResponse>, { success: false }> {
	expect(isFailure(result)).toBe(true);
	return isFailure(result);
}

function createInvalidResponseMock(): HttpClientResponse<{ id: number; name: string }> {
	return {
		data: { id: 1, name: 'Test' },
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

function mockNetworkError(http: ReturnType<typeof createMockHttpAdapter>) {
	http.mockResponse(API_ENDPOINT, 'GET', () => {
		throw new Error(NETWORK_ERROR_MESSAGE);
	});
}

async function testHttpRequestFailure(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createApiService(http, {
		endpoint: API_ENDPOINT,
	});

	mockNetworkError(http);

	const result = await service.execute({});

	if (expectErrorResult(result)) {
		expect(result.error).toBeDefined();
		// Error adapter may classify generic errors as 'network' or 'unknown'
		expect(['network', 'unknown']).toContain(result.error.type);
	}
}

async function testDefaultErrorMessage(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createApiService(http, {
		endpoint: API_ENDPOINT,
		defaultErrorMessage: 'Failed to load users',
	});

	mockNetworkError(http);

	const result = await service.execute({});

	if (expectErrorResult(result)) {
		expect(result.error.message).toBe('Failed to load users');
	}
}

async function testCustomErrorMessage(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createApiService(http, {
		endpoint: API_ENDPOINT,
		defaultErrorMessage: 'Default error',
	});

	mockNetworkError(http);

	const result = await service.execute({}, { errorMessage: 'Custom error' });

	if (expectErrorResult(result)) {
		expect(result.error.message).toBe('Custom error');
	}
}

async function testErrorMapper(http: ReturnType<typeof createMockHttpAdapter>) {
	const service = createApiService(http, {
		endpoint: API_ENDPOINT,
		errorMapper: (error, _context) => {
			return {
				...error,
				message: `Custom: ${error.message}`,
				code: 'CUSTOM_ERROR',
			};
		},
	});

	mockNetworkError(http);

	const result = await service.execute({});

	if (expectErrorResult(result)) {
		expect(result.error.message).toContain('Custom:');
		expect(result.error.code).toBe('CUSTOM_ERROR');
	}
}

async function testValidationErrors(http: ReturnType<typeof createMockHttpAdapter>) {
	const userSchema = z.object({
		id: z.string(),
		name: z.string(),
	});

	const service = createApiService<unknown, { id: number; name: string }, unknown>(http, {
		endpoint: API_ENDPOINT,
		responseSchema: userSchema,
	});

	// Response has wrong type for id (number instead of string)
	const mockResponse = createInvalidResponseMock();
	http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

	const result = await service.execute({});

	if (expectErrorResult(result)) {
		expect(result.error.type).toBe('validation');
		expect(result.error.code).toBe('INVALID_RESPONSE');
		expect(result.error.validationErrors).toBeDefined();
		expect(result.error.validationErrors?.length).toBeGreaterThan(0);
	}
}

describe('createApiService - Error Handling', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Error Results', () => {
		it('returns error result when HTTP request fails', async () => {
			await testHttpRequestFailure(http);
		});
	});

	describe('Error Messages', () => {
		it('uses default error message when provided', async () => {
			await testDefaultErrorMessage(http);
		});

		it('uses error message from options when provided', async () => {
			await testCustomErrorMessage(http);
		});
	});

	describe('Error Transformation', () => {
		it('uses error mapper when provided', async () => {
			await testErrorMapper(http);
		});
	});

	describe('Validation Errors', () => {
		it('handles validation errors from response schema', async () => {
			await testValidationErrors(http);
		});
	});
});

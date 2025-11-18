import { createApiService } from '@core/api/createApiService';
import type { ApiServiceResult } from '@core/api/createApiService.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

function setupTest() {
	const http = createMockHttpAdapter();
	return { http };
}

function createUserSchema() {
	return z.object({
		id: z.string(),
		name: z.string(),
		email: z.email(),
	});
}

function createServiceWithSchema<TRequest, TResponse>(
	http: ReturnType<typeof createMockHttpAdapter>,
	schema: z.ZodType<TResponse>
) {
	return createApiService<TRequest, TResponse>(http, {
		endpoint: API_ENDPOINT,
		responseSchema: schema,
	});
}

function createValidUserResponse() {
	return createMockHttpResponse<{ id: string; name: string; email: string }>({
		id: '1',
		name: 'Test',
		email: 'test@example.com',
	});
}

function createInvalidUserResponse() {
	return createMockHttpResponse<{ id: string; name: string }>({
		id: '1',
		name: 'Test',
	});
}

function assertSuccessResult<T>(result: ApiServiceResult<T>, expectedData: T) {
	expect(isSuccess(result)).toBe(true);
	if (isSuccess(result)) {
		expect(result.data.data).toEqual(expectedData);
	}
}

function assertValidationError<T>(result: ApiServiceResult<T>) {
	expect(isSuccess(result)).toBe(false);
	if (!isSuccess(result)) {
		expect(result.error.type).toBe('validation');
		expect(result.error.validationErrors).toBeDefined();
	}
}

interface RawResponse {
	user: {
		id: number;
		full_name: string;
	};
}

interface MappedResponse {
	id: string;
	name: string;
}

function createMappedSchema() {
	return z.object({
		id: z.string(),
		name: z.string(),
	});
}

function createServiceWithMapper(
	http: ReturnType<typeof createMockHttpAdapter>,
	schema: z.ZodType<MappedResponse>
) {
	return createApiService<unknown, RawResponse, MappedResponse>(http, {
		endpoint: API_ENDPOINT,
		responseMapper: context => ({
			id: String(context.raw.user.id),
			name: context.raw.user.full_name,
		}),
		responseSchema: schema,
	});
}

function createRawMockResponse(): HttpClientResponse<RawResponse> {
	return {
		data: {
			user: {
				id: 1,
				full_name: 'Test User',
			},
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

describe('createApiService - Validation', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		({ http } = setupTest());
	});

	describe('Schema Validation', () => {
		it('validates response with Zod schema', async () => {
			const userSchema = createUserSchema();
			const service = createServiceWithSchema<unknown, { id: string; name: string; email: string }>(
				http,
				userSchema
			);
			const mockResponse = createValidUserResponse();

			http.mockResponse(API_ENDPOINT, 'GET', mockResponse);
			const result = await service.execute({});

			assertSuccessResult(result, { id: '1', name: 'Test', email: 'test@example.com' });
		});

		it('fails validation when response does not match schema', async () => {
			const userSchema = createUserSchema();
			const service = createServiceWithSchema<unknown, { id: string; name: string }>(
				http,
				userSchema
			);
			const mockResponse = createInvalidUserResponse();

			http.mockResponse(API_ENDPOINT, 'GET', mockResponse);
			const result = await service.execute({});

			assertValidationError(result);
		});
	});

	describe('Validation with Mapping', () => {
		it('validates after response mapping', async () => {
			const mappedSchema = createMappedSchema();
			const service = createServiceWithMapper(http, mappedSchema);
			const mockResponse = createRawMockResponse();

			http.mockResponse(API_ENDPOINT, 'GET', mockResponse);
			const result = await service.execute({});

			assertSuccessResult(result, { id: '1', name: 'Test User' });
		});
	});
});

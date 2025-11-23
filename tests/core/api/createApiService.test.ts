import { createApiService } from '@core/api/createApiService';
import type { ApiServiceExecuteOptions } from '@core/api/createApiService.types';
import type { DomainError } from '@core/http/errorAdapter.types';
import { isFailure, isSuccess } from '@src-types/result';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

// Mock buildApiUrl
vi.mock('@core/constants/endpoints', () => ({
	buildApiUrl: (endpoint: string) => endpoint,
}));

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string) => key,
	},
}));

describe('createApiService', () => {
	let http: ReturnType<typeof createMockHttpAdapter>;

	beforeEach(() => {
		http = createMockHttpAdapter();
	});

	describe('API Service Creation', () => {
		it('should create an API service with default GET method', () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			expect(service).toBeDefined();
			expect(typeof service.execute).toBe('function');
		});

		it('should create an API service with specified HTTP method', () => {
			const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;

			for (const method of methods) {
				const service = createApiService(http, {
					endpoint: API_ENDPOINT,
					method,
				});

				expect(service).toBeDefined();
				expect(typeof service.execute).toBe('function');
			}
		});

		it('should normalize method to uppercase', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				method: 'GET', // Already uppercase
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

			await service.execute({});

			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.method).toBe('GET');
		});

		it('should create service with string endpoint', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.url).toBe(API_ENDPOINT);
		});

		it('should create service with function endpoint', async () => {
			const service = createApiService<{ id: string }>(http, {
				endpoint: request => `/api/users/${request.id}`,
			});

			http.mockResponse('/api/users/123', 'GET', createMockHttpResponse({ id: '123' }));

			const result = await service.execute({ id: '123' });

			expect(isSuccess(result)).toBe(true);
			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.url).toBe('/api/users/123');
		});
	});

	describe('Request Handling', () => {
		it('should execute request and return success result', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const responseData = { id: '1', name: 'Test' };
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(responseData));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual(responseData);
				expect(result.data.rawData).toEqual(responseData);
				expect(result.data.status).toBe(200);
			}
		});

		it('should handle request with requestMapper', async () => {
			const requestMapper = ({ request }: { request: { name: string } }) => ({
				body: { name: request.name },
			});

			const service = createApiService<{ name: string }>(http, {
				endpoint: API_ENDPOINT,
				requestMapper,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ success: true }));

			await service.execute({ name: 'Test' });

			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.body).toEqual({ name: 'Test' });
		});

		it('should pass options to requestMapper', async () => {
			const requestMapper = vi.fn(() => ({}));

			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				requestMapper,
			});

			const options: ApiServiceExecuteOptions = {
				signal: new AbortController().signal,
			};

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			await service.execute({}, options);

			expect(requestMapper).toHaveBeenCalledWith({
				request: {},
				options,
			});
		});

		it('should use defaultConfig when provided', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				defaultConfig: {
					headers: { 'X-Custom': 'value' },
				},
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			await service.execute({});

			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.config?.headers).toEqual({ 'X-Custom': 'value' });
		});

		it('should merge options.httpConfig with defaultConfig', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				defaultConfig: {
					headers: { 'X-Default': 'default' },
				},
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			await service.execute(
				{},
				{
					httpConfig: {
						headers: { 'X-Custom': 'custom' },
					},
				}
			);

			expect(http.requests).toHaveLength(1);
			expect(http.requests[0]?.config?.headers).toEqual({
				'X-Default': 'default',
				'X-Custom': 'custom',
			});
		});
	});

	describe('Response Mapping and Validation', () => {
		it('should handle request with responseMapper', async () => {
			interface RawResponse {
				user: { id: string; full_name: string };
			}
			interface MappedResponse {
				id: string;
				name: string;
			}

			const responseMapper = (context: { raw: RawResponse }) => ({
				id: context.raw.user.id,
				name: context.raw.user.full_name,
			});

			const service = createApiService<unknown, RawResponse, MappedResponse>(http, {
				endpoint: API_ENDPOINT,
				responseMapper,
			});

			const rawResponse: RawResponse = {
				user: { id: '1', full_name: 'John Doe' },
			};
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(rawResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual({ id: '1', name: 'John Doe' });
				expect(result.data.rawData).toEqual(rawResponse);
			}
		});

		it('should handle request with responseSchema validation', async () => {
			const schema = z.object({
				id: z.string(),
				name: z.string(),
			});

			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				responseSchema: schema,
			});

			const validData = { id: '1', name: 'Test' };
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(validData));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual(validData);
			}
		});

		it('should handle request with both responseMapper and responseSchema', async () => {
			interface RawResponse {
				user: { id: string; full_name: string };
			}
			interface MappedResponse {
				id: string;
				name: string;
			}

			const schema = z.object({
				id: z.string(),
				name: z.string(),
			});

			const responseMapper = (context: { raw: RawResponse }) => ({
				id: context.raw.user.id,
				name: context.raw.user.full_name,
			});

			const service = createApiService<unknown, RawResponse, MappedResponse>(http, {
				endpoint: API_ENDPOINT,
				responseMapper,
				responseSchema: schema,
			});

			const rawResponse: RawResponse = {
				user: { id: '1', full_name: 'John Doe' },
			};
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(rawResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual({ id: '1', name: 'John Doe' });
			}
		});
	});

	describe('Error Handling', () => {
		const ORIGINAL_ERROR_MESSAGE = 'Original error';

		it('should return error result when HTTP request fails', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const throwError = () => {
				throw new Error('Network error');
			};
			http.mockResponse(API_ENDPOINT, 'GET', throwError);

			const result = await service.execute({});

			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error).toBeDefined();
				expect(result.error.type).toBeDefined();
			}
		});

		it('should handle validation errors from responseSchema', async () => {
			const schema = z.object({
				id: z.string(),
				name: z.string(),
			});

			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				responseSchema: schema,
			});

			const invalidData = { id: 123 }; // missing name, wrong type for id
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(invalidData));

			const result = await service.execute({});

			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error.type).toBe('validation');
				expect(result.error.code).toBe('INVALID_RESPONSE');
			}
		});

		it('should use errorMapper when provided', async () => {
			const errorMapper = vi.fn((error: DomainError) => ({
				...error,
				message: 'Custom error message',
			}));

			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				errorMapper,
			});

			const throwError = () => {
				throw new Error(ORIGINAL_ERROR_MESSAGE);
			};
			http.mockResponse(API_ENDPOINT, 'GET', throwError);

			const result = await service.execute({});

			expect(isFailure(result)).toBe(true);
			expect(errorMapper).toHaveBeenCalled();
			if (isFailure(result)) {
				expect(result.error.message).toBe('Custom error message');
			}
		});

		it('should pass error context to errorMapper', async () => {
			const errorMapper = vi.fn((error: DomainError) => error);
			const request = { id: '123' };
			const options: ApiServiceExecuteOptions = {
				signal: new AbortController().signal,
			};

			const service = createApiService<typeof request>(http, {
				endpoint: API_ENDPOINT,
				errorMapper,
			});

			const throwTestError = () => {
				throw new Error('Test error');
			};
			http.mockResponse(API_ENDPOINT, 'GET', throwTestError);

			await service.execute(request, options);

			expect(errorMapper).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					request,
					options,
				})
			);
		});

		it('should use defaultErrorMessage when provided', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				defaultErrorMessage: 'Custom default error',
			});

			const throwError = () => {
				throw new Error(ORIGINAL_ERROR_MESSAGE);
			};
			http.mockResponse(API_ENDPOINT, 'GET', throwError);

			const result = await service.execute({});

			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error.message).toBe('Custom default error');
			}
		});

		it('should use options.errorMessage over defaultErrorMessage', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				defaultErrorMessage: 'Default error',
			});

			const throwError = () => {
				throw new Error(ORIGINAL_ERROR_MESSAGE);
			};
			http.mockResponse(API_ENDPOINT, 'GET', throwError);

			const result = await service.execute(
				{},
				{
					errorMessage: 'Options error',
				}
			);

			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error.message).toBe('Options error');
			}
		});
	});

	describe('Response Processing', () => {
		it('should include response metadata in success result', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const responseData = { id: '1' };
			const mockResponse = createMockHttpResponse(responseData);
			mockResponse.status = 201;
			mockResponse.statusText = 'Created';
			mockResponse.headers = new Headers({ 'X-Custom': 'value' });

			http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.status).toBe(201);
				expect(result.data.statusText).toBe('Created');
				expect(result.data.headers).toBeDefined();
			}
		});

		it('should handle envelope responses with data field', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const envelopeResponse = {
				data: { id: '1', name: 'Test' },
				message: 'Success',
			};
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(envelopeResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual({ id: '1', name: 'Test' });
				expect(result.data.message).toBe('Success');
			}
		});

		it('should handle envelope responses with metadata', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const envelopeResponse = {
				data: { id: '1' },
				metadata: { page: 1, total: 10 },
			};
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(envelopeResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual({ id: '1' });
				expect(result.data.metadata).toEqual({ page: 1, total: 10 });
			}
		});

		it('should handle envelope responses with apiMeta', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const envelopeResponse = {
				data: { id: '1' },
				apiMeta: {
					version: '1.0.0',
					requestId: 'req-123',
					timestamp: '2024-01-01T00:00:00Z',
				},
			};
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(envelopeResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.apiMeta).toBeDefined();
				expect(result.data.apiMeta?.version).toBe('1.0.0');
				expect(result.data.apiMeta?.requestId).toBe('req-123');
				expect(result.data.apiMeta?.timestamp).toBe('2024-01-01T00:00:00Z');
			}
		});

		it('should handle non-envelope responses', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			const directResponse = { id: '1', name: 'Test' };
			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse(directResponse));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data.data).toEqual(directResponse);
				expect(result.data.message).toBeUndefined();
			}
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty request object', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
		});

		it('should handle requestMapper returning undefined', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				requestMapper: () => undefined,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
		});

		it('should handle requestMapper returning empty config', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				requestMapper: () => ({}),
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
		});

		it('should handle execute without options', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			const result = await service.execute({});

			expect(isSuccess(result)).toBe(true);
		});

		it('should handle execute with empty options', async () => {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
			});

			http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({}));

			const result = await service.execute({}, {});

			expect(isSuccess(result)).toBe(true);
		});
	});
});

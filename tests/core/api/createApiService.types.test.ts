import { createApiService } from '@core/api/createApiService';
import type {
	ApiHttpMethod,
	ApiService,
	ApiServiceConfig,
	ApiServiceErrorContext,
	ApiServiceErrorMapper,
	ApiServiceExecuteOptions,
	ApiServiceRequestConfig,
	ApiServiceResponseContext,
	ApiServiceResponseMapper,
	ApiServiceResult,
	ApiServiceSuccess,
} from '@core/api/createApiService.types';
import type { DomainError } from '@core/http/errorAdapter.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
import { describe, expect, it } from 'vitest';

import {
	API_ENDPOINT,
	createMockHttpAdapter,
	createMockHttpResponse,
} from './createApiService.test-utils';

/**
 * Test file for API Service Types
 *
 * This file tests the type definitions in createApiService.types.ts
 * by using them in runtime code to ensure they work correctly.
 */

const TEST_USER_PATH = '/api/users/1';

// Helper functions for test setup
function createMockUserResponse(
	id: string,
	name?: string
): HttpClientResponse<{ id: string; name?: string }> {
	const data: { id: string; name?: string } = { id };
	if (name !== undefined) {
		data.name = name;
	}
	return createMockHttpResponse(data);
}

function createMockUserWithFullNameResponse(
	id: string,
	fullName: string
): HttpClientResponse<{ user: { id: string; full_name: string } }> {
	return {
		data: {
			user: {
				id,
				full_name: fullName,
			},
		},
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

// Helper functions for ApiServiceConfig tests
function createEndpointFunction<Request extends { id: string }>(): (request: Request) => string {
	return (request: Request) => `/api/users/${request.id}`;
}

function createTestRequestMapper<Request extends { name: string }>() {
	return ({ request }: { request: Request }) => ({
		body: { name: request.name },
	});
}

function createTestResponseMapper<
	RawResponse extends { user: { id: string } },
	MappedResponse extends { id: string },
>(): ApiServiceResponseMapper<RawResponse, MappedResponse> {
	return context =>
		({
			id: context.raw.user.id,
		}) as MappedResponse;
}

function createTestErrorMapper<Request>(): ApiServiceErrorMapper<Request> {
	return error => error;
}

// Helper functions for ApiService tests
function createTestServiceWithMapper<
	RawResponse extends { user: { id: string; full_name: string } },
	MappedResponse extends { id: string; name: string },
>(
	httpAdapter: ReturnType<typeof createMockHttpAdapter>
): ApiService<unknown, MappedResponse, RawResponse> {
	const createResponseMapper = (): ApiServiceResponseMapper<RawResponse, MappedResponse> => {
		return context =>
			({
				id: context.raw.user.id,
				name: context.raw.user.full_name,
			}) as MappedResponse;
	};

	return createApiService<unknown, RawResponse, MappedResponse>(httpAdapter, {
		endpoint: API_ENDPOINT,
		responseMapper: createResponseMapper(),
	});
}

// Shared test setup helper
function setupHttpAdapter() {
	return createMockHttpAdapter();
}

describe('ApiHttpMethod', () => {
	it('should accept all valid HTTP methods', () => {
		const http = setupHttpAdapter();
		const methods: ApiHttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

		for (const method of methods) {
			const service = createApiService(http, {
				endpoint: API_ENDPOINT,
				method,
			});

			expect(service).toBeDefined();
			expect(typeof service.execute).toBe('function');
		}
	});
});

describe('ApiServiceExecuteOptions', () => {
	it('should accept signal option', async () => {
		const http = setupHttpAdapter();
		const controller = new AbortController();
		const { signal } = controller;

		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

		const options: ApiServiceExecuteOptions = {
			signal,
		};

		const result = await service.execute({}, options);
		expect(isSuccess(result)).toBe(true);
	});

	it('should accept httpConfig option', async () => {
		const http = setupHttpAdapter();
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

		const options: ApiServiceExecuteOptions = {
			httpConfig: {
				headers: { 'X-Custom-Header': 'value' },
			},
		};

		const result = await service.execute({}, options);
		expect(isSuccess(result)).toBe(true);
	});

	it('should accept errorMessage option', async () => {
		const http = setupHttpAdapter();
		const service = createApiService(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

		const options: ApiServiceExecuteOptions = {
			errorMessage: 'Custom error message',
		};

		const result = await service.execute({}, options);
		expect(isSuccess(result)).toBe(true);
	});
});

describe('ApiServiceRequestConfig', () => {
	it('should accept query parameters', () => {
		const config: ApiServiceRequestConfig = {
			query: {
				page: 1,
				limit: 10,
			},
		};

		expect(config.query).toBeDefined();
		expect(config.query?.page).toBe(1);
		expect(config.query?.limit).toBe(10);
	});

	it('should accept body', () => {
		const config: ApiServiceRequestConfig = {
			body: {
				name: 'Test',
				email: 'test@example.com',
			},
		};

		expect(config.body).toBeDefined();
	});

	it('should accept config', () => {
		const config: ApiServiceRequestConfig = {
			config: {
				headers: { 'Content-Type': 'application/json' },
			},
		};

		expect(config.config).toBeDefined();
	});

	it('should accept path', () => {
		const config: ApiServiceRequestConfig = {
			path: TEST_USER_PATH,
		};

		expect(config.path).toBe(TEST_USER_PATH);
	});
});

describe('ApiServiceSuccess', () => {
	it('should have correct structure with rawData', async () => {
		const http = setupHttpAdapter();
		interface Response {
			id: string;
			name: string;
		}

		const service = createApiService<unknown, Response>(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1', name: 'Test' }));

		const result = await service.execute({});

		if (isSuccess(result)) {
			const success: ApiServiceSuccess<Response> = result.data;
			expect(success.rawData).toBeDefined();
			expect(success.data).toBeDefined();
			expect(success.data.id).toBe('1');
			expect(success.data.name).toBe('Test');
		} else {
			throw new Error('Expected success result');
		}
	});

	it('should support optional message and metadata', async () => {
		const http = setupHttpAdapter();
		interface Response {
			id: string;
		}

		const service = createApiService<unknown, Response>(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

		const result = await service.execute({});

		if (isSuccess(result)) {
			const success: ApiServiceSuccess<Response> = result.data;
			// message and metadata are optional
			expect(success.message).toBeUndefined();
			expect(success.metadata).toBeUndefined();
		} else {
			throw new Error('Expected success result');
		}
	});
});

describe('ApiServiceResult', () => {
	it('should return Result type with success', async () => {
		const http = setupHttpAdapter();
		interface Response {
			id: string;
		}

		const service = createApiService<unknown, Response>(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ id: '1' }));

		const result: ApiServiceResult<Response> = await service.execute({});
		expect(isSuccess(result)).toBe(true);
	});
});

// Helper function for ApiServiceResponseContext tests
function createUserResponseMapper<
	RawResponse extends { user: { id: string; full_name: string } },
	MappedResponse extends { id: string; name: string },
>(): ApiServiceResponseMapper<RawResponse, MappedResponse> {
	return (context: ApiServiceResponseContext<RawResponse>) => {
		expect(context.raw).toBeDefined();
		expect(context.response).toBeDefined();
		expect(context.response.data).toBeDefined();

		return {
			id: context.raw.user.id,
			name: context.raw.user.full_name,
		} as MappedResponse;
	};
}

describe('ApiServiceResponseContext', () => {
	it('should provide correct context to response mapper', async () => {
		const http = setupHttpAdapter();
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

		const service = createApiService<unknown, RawResponse, MappedResponse>(http, {
			endpoint: API_ENDPOINT,
			responseMapper: createUserResponseMapper<RawResponse, MappedResponse>(),
		});

		const mockResponse = createMockUserWithFullNameResponse('1', 'Test User');

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});
		expect(isSuccess(result)).toBe(true);

		if (isSuccess(result)) {
			expect(result.data.data.id).toBe('1');
			expect(result.data.data.name).toBe('Test User');
		}
	});

	it('should support optional envelope in context', async () => {
		const http = setupHttpAdapter();
		interface RawResponse {
			data: {
				id: string;
			};
		}

		const responseMapper: ApiServiceResponseMapper<RawResponse, RawResponse> = (
			context: ApiServiceResponseContext<RawResponse>
		) => {
			// envelope is optional
			if (context.envelope) {
				expect(context.envelope).toBeDefined();
			}

			return context.raw;
		};

		const service = createApiService<unknown, RawResponse>(http, {
			endpoint: API_ENDPOINT,
			responseMapper,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockHttpResponse({ data: { id: '1' } }));

		const result = await service.execute({});
		expect(isSuccess(result)).toBe(true);
	});
});

describe('ApiServiceErrorContext', () => {
	it('should provide correct context to error mapper', async () => {
		const http = setupHttpAdapter();
		interface Request {
			id: string;
		}

		let capturedContext: ApiServiceErrorContext<Request> | undefined;

		const errorMapper: ApiServiceErrorMapper<Request> = (
			error: DomainError,
			context: ApiServiceErrorContext<Request>
		) => {
			capturedContext = context;
			expect(context.request).toBeDefined();
			expect(context.request.id).toBe('123');
			expect(context.options).toBeDefined();
			expect(context.options?.errorMessage).toBe('Test error');
			return error;
		};

		const service = createApiService<Request, { id: string }>(http, {
			endpoint: API_ENDPOINT,
			errorMapper,
		});

		// Force an error by mocking a network error
		http.mockResponse(API_ENDPOINT, 'GET', () => {
			throw new Error('Network error');
		});

		const result = await service.execute({ id: '123' }, { errorMessage: 'Test error' });

		// Result should be an error
		expect(isSuccess(result)).toBe(false);
		// Verify context was captured
		expect(capturedContext).toBeDefined();
		expect(capturedContext?.request.id).toBe('123');
	});
});

describe('ApiServiceConfig', () => {
	describe('endpoint', () => {
		it('should accept string endpoint', () => {
			const config: ApiServiceConfig<unknown> = {
				endpoint: API_ENDPOINT,
			};

			expect(config.endpoint).toBe(API_ENDPOINT);
		});

		it('should accept function endpoint', () => {
			interface Request {
				id: string;
			}

			const config: ApiServiceConfig<Request> = {
				endpoint: createEndpointFunction<Request>(),
			};

			expect(typeof config.endpoint).toBe('function');
			if (typeof config.endpoint === 'function') {
				expect(config.endpoint({ id: '1' })).toBe(TEST_USER_PATH);
			}
		});
	});
});

describe('ApiServiceConfig optional properties', () => {
	it('should accept optional method', () => {
		const config: ApiServiceConfig<unknown> = {
			endpoint: API_ENDPOINT,
			method: 'POST',
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.method).toBe('POST');
	});
});

describe('ApiServiceConfig mappers', () => {
	it('should accept optional requestMapper', () => {
		interface Request {
			name: string;
		}

		const config: ApiServiceConfig<Request> = {
			endpoint: API_ENDPOINT,
			requestMapper: createTestRequestMapper<Request>(),
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.requestMapper).toBeDefined();
		if (config.requestMapper) {
			const mapped = config.requestMapper({ request: { name: 'Test' } });
			expect(mapped?.body).toEqual({ name: 'Test' });
		}
	});

	it('should accept optional responseMapper', () => {
		interface RawResponse {
			user: { id: string };
		}

		interface MappedResponse {
			id: string;
		}

		const config: ApiServiceConfig<unknown, RawResponse, MappedResponse> = {
			endpoint: API_ENDPOINT,
			responseMapper: createTestResponseMapper<RawResponse, MappedResponse>(),
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.responseMapper).toBeDefined();
	});

	it('should accept optional errorMapper', () => {
		interface Request {
			id: string;
		}

		const config: ApiServiceConfig<Request> = {
			endpoint: API_ENDPOINT,
			errorMapper: createTestErrorMapper<Request>(),
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.errorMapper).toBeDefined();
	});
});

describe('ApiServiceConfig defaults', () => {
	it('should accept optional defaultErrorMessage', () => {
		const config: ApiServiceConfig<unknown> = {
			endpoint: API_ENDPOINT,
			defaultErrorMessage: 'Default error',
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.defaultErrorMessage).toBe('Default error');
	});

	it('should accept optional defaultConfig', () => {
		const config: ApiServiceConfig<unknown> = {
			endpoint: API_ENDPOINT,
			defaultConfig: {
				headers: { 'X-Custom': 'value' },
			},
		};

		expect(config.endpoint).toBe(API_ENDPOINT);
		expect(config.defaultConfig).toBeDefined();
		expect(config.defaultConfig?.headers).toEqual({ 'X-Custom': 'value' });
	});
});

describe('ApiService', () => {
	it('should have execute method with correct signature', () => {
		const http = setupHttpAdapter();
		interface Request {
			id: string;
		}

		interface Response {
			id: string;
			name: string;
		}

		const service: ApiService<Request, Response> = createApiService<Request, Response>(http, {
			endpoint: API_ENDPOINT,
		});

		expect(service).toBeDefined();
		expect(typeof service.execute).toBe('function');

		// Verify execute returns Promise<ApiServiceResult>
		const resultPromise = service.execute({ id: '1' });
		expect(resultPromise).toBeInstanceOf(Promise);
	});

	it('should support optional execute options', async () => {
		const http = setupHttpAdapter();
		interface Request {
			id: string;
		}

		interface Response {
			id: string;
		}

		const service: ApiService<Request, Response> = createApiService<Request, Response>(http, {
			endpoint: API_ENDPOINT,
		});

		http.mockResponse(API_ENDPOINT, 'GET', createMockUserResponse('1'));

		const options: ApiServiceExecuteOptions = {
			signal: new AbortController().signal,
		};

		const result = await service.execute({ id: '1' }, options);
		expect(isSuccess(result)).toBe(true);
	});

	it('should support raw and mapped response types', async () => {
		const http = setupHttpAdapter();
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

		const service = createTestServiceWithMapper<RawResponse, MappedResponse>(http);
		const mockResponse = createMockUserWithFullNameResponse('1', 'Test User');

		http.mockResponse(API_ENDPOINT, 'GET', mockResponse);

		const result = await service.execute({});
		expect(isSuccess(result)).toBe(true);

		if (isSuccess(result)) {
			// Mapped response
			expect(result.data.data.id).toBe('1');
			expect(result.data.data.name).toBe('Test User');
			// Raw response preserved
			expect(result.data.rawData.user.id).toBe('1');
		}
	});
});

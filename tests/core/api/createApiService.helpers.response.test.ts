import {
	ApiResponseValidationError,
	handleServiceError,
	processSuccessResponse,
} from '@core/api/createApiService.helpers';
import type {
	ApiServiceConfig,
	ApiServiceErrorContext,
	ApiServiceExecuteOptions,
} from '@core/api/createApiService.types';
import type { DomainError } from '@core/http/errorAdapter.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const TEST_ENDPOINT = '/api/test';

function createMockHttpResponseForHelpers<T>(data: T): HttpClientResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

const mockI18nT = vi.fn((key: string, _options?: { ns?: string }) => `translated:${key}`);

vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string, options?: { ns?: string }) => mockI18nT(key, options),
	},
}));

function createTestConfig(defaultErrorMessage?: string): ApiServiceConfig<unknown> {
	return {
		endpoint: TEST_ENDPOINT,
		...(defaultErrorMessage ? { defaultErrorMessage } : {}),
	};
}

function createTestContext(errorMessage?: string): ApiServiceErrorContext<unknown> {
	return {
		request: {},
		...(errorMessage ? { options: { errorMessage } } : {}),
	};
}

function createValidationError() {
	const schema = z.object({
		id: z.string(),
		name: z.string(),
	});

	const invalidData = { id: 123 };
	const parseResult = schema.safeParse(invalidData);

	if (!parseResult.success) {
		return ApiResponseValidationError.fromZodIssues(parseResult.error.issues);
	}
	throw new Error('Expected validation to fail');
}

describe('createApiService.helpers - processSuccessResponse - basic response processing', () => {
	it('should process success response without schema', () => {
		const responseData = { id: '1', name: 'Test' };
		const httpResponse = createMockHttpResponseForHelpers(responseData);
		const responseMapper = (context: { raw: unknown }) => context.raw;

		const result = processSuccessResponse({
			httpResponse,
			responseMapper,
		});

		expect(result.data).toEqual(responseData);
		expect(result.rawData).toEqual(responseData);
		expect(result.status).toBe(200);
		expect(result.statusText).toBe('OK');
	});

	it('should process success response with envelope', () => {
		const envelopeData = {
			data: { id: '1' },
			message: 'Success',
			metadata: { page: 1 },
		};
		const httpResponse = createMockHttpResponseForHelpers(envelopeData);
		const responseMapper = (context: { raw: unknown }) => context.raw;

		const result = processSuccessResponse({
			httpResponse,
			responseMapper,
		});

		expect(result.data).toEqual(envelopeData);
		expect(result.message).toBe('Success');
		expect(result.metadata).toEqual({ page: 1 });
	});
});

describe('createApiService.helpers - processSuccessResponse - schema validation', () => {
	it('should process success response with schema validation', () => {
		const schema = z.object({
			id: z.string(),
			name: z.string(),
		});
		const responseData = { id: '1', name: 'Test' };
		const httpResponse = createMockHttpResponseForHelpers(responseData);
		const responseMapper = (context: { raw: unknown }) => context.raw;

		const result = processSuccessResponse({
			httpResponse,
			responseMapper,
			responseSchema: schema,
		});

		expect(result.data).toEqual(responseData);
	});

	it('should throw validation error when schema validation fails', () => {
		const schema = z.object({
			id: z.string(),
			name: z.string(),
		});
		const invalidData = { id: 123 }; // wrong type, missing name
		const httpResponse = createMockHttpResponseForHelpers(invalidData);
		const responseMapper = (context: { raw: unknown }) => context.raw;

		expect(() => {
			processSuccessResponse({
				httpResponse,
				responseMapper,
				responseSchema: schema,
			});
		}).toThrow();

		try {
			processSuccessResponse({
				httpResponse,
				responseMapper,
				responseSchema: schema,
			});
		} catch (error) {
			expect(error).toBeInstanceOf(ApiResponseValidationError);
		}
	});
});

describe('createApiService.helpers - processSuccessResponse - response metadata', () => {
	it('should process response with apiMeta', () => {
		const responseData = {
			data: { id: '1' },
			apiMeta: {
				version: '1.0.0',
				requestId: 'req-123',
				timestamp: '2024-01-01T00:00:00Z',
			},
		};
		const httpResponse = createMockHttpResponseForHelpers(responseData);
		const responseMapper = (context: { raw: unknown }) => context.raw;

		const result = processSuccessResponse({
			httpResponse,
			responseMapper,
		});

		expect(result.apiMeta).toEqual({
			version: '1.0.0',
			requestId: 'req-123',
			timestamp: '2024-01-01T00:00:00Z',
		});
	});

	it('should include response headers in result', () => {
		const responseData = { id: '1' };
		const headers = new Headers({ 'X-Custom': 'value' });
		const httpResponse = {
			...createMockHttpResponseForHelpers(responseData),
			headers,
		};
		const responseMapper = (context: { raw: unknown }) => context.raw;

		const result = processSuccessResponse({
			httpResponse,
			responseMapper,
		});

		expect(result.headers).toBe(headers);
	});
});

describe('createApiService.helpers - handleServiceError - validation error handling', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should handle ApiResponseValidationError', () => {
		const config = createTestConfig();
		const context = createTestContext();
		const validationError = createValidationError();

		const result = handleServiceError(validationError, config, context);

		expect(result.type).toBe('validation');
		expect(result.code).toBe('INVALID_RESPONSE');
		expect(result.validationErrors).toBeDefined();
	});

	it('should apply errorMapper to validation errors', () => {
		const errorMapper = vi.fn((error: DomainError) => ({
			...error,
			message: 'Mapped validation error',
		}));
		const config: ApiServiceConfig<unknown> = {
			endpoint: TEST_ENDPOINT,
			errorMapper,
		};
		const context = createTestContext();
		const validationError = createValidationError();

		const result = handleServiceError(validationError, config, context);

		expect(errorMapper).toHaveBeenCalled();
		expect(result.message).toBe('Mapped validation error');
	});
});

describe('createApiService.helpers - handleServiceError - generic error handling', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should handle generic errors', () => {
		const config = createTestConfig();
		const context = createTestContext();
		const error = new Error('Generic error');

		const result = handleServiceError(error, config, context);

		expect(result).toBeDefined();
		expect(result.type).toBeDefined();
	});

	it('should apply errorMapper to generic errors', () => {
		const errorMapper = vi.fn((error: DomainError) => ({
			...error,
			message: 'Mapped error',
		}));
		const config: ApiServiceConfig<unknown> = {
			endpoint: TEST_ENDPOINT,
			errorMapper,
		};
		const context = createTestContext();
		const error = new Error('Original error');

		const result = handleServiceError(error, config, context);

		expect(errorMapper).toHaveBeenCalled();
		expect(result.message).toBe('Mapped error');
	});
});

describe('createApiService.helpers - handleServiceError - error mapper behavior', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should pass error context to errorMapper', () => {
		const errorMapper = vi.fn((error: DomainError) => error);
		const request = { id: '123' };
		const options: ApiServiceExecuteOptions = {
			signal: new AbortController().signal,
		};
		const config: ApiServiceConfig<typeof request> = {
			endpoint: TEST_ENDPOINT,
			errorMapper,
		};
		const context: ApiServiceErrorContext<typeof request> = {
			request,
			options,
		};
		const error = new Error('Test error');

		handleServiceError(error, config, context);

		expect(errorMapper).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				request,
				options,
			})
		);
	});

	it('should use default error mapper when not provided', () => {
		const config = createTestConfig();
		const context = createTestContext();
		const error = new Error('Test error');

		const result = handleServiceError(error, config, context);

		expect(result).toBeDefined();
		// Should return the adapted error as-is when no mapper
		expect(result.type).toBeDefined();
	});
});

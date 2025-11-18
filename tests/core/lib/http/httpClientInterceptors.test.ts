import {
	type ErrorInterceptor,
	executeErrorInterceptors,
	executeRequestInterceptors,
	executeResponseInterceptors,
	type RequestInterceptor,
	type ResponseInterceptor,
} from '@core/lib/http/httpClientInterceptors';
import type { HttpClientConfig, HttpClientError, HttpClientResponse } from '@core/ports/HttpPort';
import { describe, expect, it, vi } from 'vitest';

const BEARER_TOKEN = 'Bearer token';
const TEST_URL = '/api/test';
const MODIFIED_URL = '/api/v2/test';
const ORIGINAL_ERROR_MESSAGE = 'Original error';
const TEST_ERROR_MESSAGE = 'Test error';
const EMPTY_INTERCEPTORS: never[] = [];
const TEST_EMPTY_INTERCEPTOR_ARRAY = 'handles empty interceptor array';

const createTestConfig = (): HttpClientConfig & { url: string } => ({
	url: TEST_URL,
	headers: {},
});

const createTestResponse = (): HttpClientResponse<string> => ({
	data: 'original',
	status: 200,
	statusText: 'OK',
	headers: new Headers(),
	response: {} as Response,
});

const createTestError = (message = TEST_ERROR_MESSAGE): HttpClientError => {
	const error = new Error(message) as HttpClientError;
	error.status = 500;
	return error;
};

const createRequestInterceptorWithHeader = (
	headerKey: string,
	headerValue: string
): RequestInterceptor => {
	return vi.fn().mockImplementation(cfg => ({
		...cfg,
		headers: { ...cfg.headers, [headerKey]: headerValue },
	}));
};

const createRequestInterceptorWithUrl = (url: string): RequestInterceptor => {
	return vi.fn().mockImplementation(cfg => ({
		...cfg,
		url,
	}));
};

const createAsyncRequestInterceptor = (headers: Record<string, string>): RequestInterceptor => {
	return vi.fn().mockResolvedValue({
		...createTestConfig(),
		headers,
	});
};

const createResponseInterceptorWithData = (data: string): ResponseInterceptor => {
	return vi.fn().mockImplementation(resp => ({
		...resp,
		data,
	}));
};

const createAsyncResponseInterceptor = (data: string): ResponseInterceptor => {
	return vi.fn().mockResolvedValue({
		...createTestResponse(),
		data,
	});
};

const createResponseInterceptorWithStatus = (
	status: number,
	statusText: string
): ResponseInterceptor => {
	return vi.fn().mockImplementation(resp => ({
		...resp,
		status,
		statusText,
	}));
};

const createThrowingErrorInterceptor = (errorMessage: string): ErrorInterceptor => {
	return vi.fn().mockImplementation(() => {
		throw new Error(errorMessage);
	});
};

const createNonErrorThrowingInterceptor = (): ErrorInterceptor => {
	const throwString = (): never => {
		// Intentionally throwing a string (non-Error) to test that such throws are ignored
		// eslint-disable-next-line no-throw-literal
		throw 'String throw';
	};
	return vi.fn().mockImplementation(throwString);
};

describe('executeRequestInterceptors', () => {
	describe('execution order', () => {
		it('executes interceptors in order', async () => {
			const config = createTestConfig();
			const interceptor1 = createRequestInterceptorWithHeader('X-Request-Id', '1');
			const interceptor2 = createRequestInterceptorWithHeader('Authorization', BEARER_TOKEN);
			const result = await executeRequestInterceptors([interceptor1, interceptor2], config);
			expect(interceptor1).toHaveBeenCalledWith(config);
			expect(interceptor2).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({ 'X-Request-Id': '1' }),
				})
			);
			expect(result.headers).toEqual({
				'X-Request-Id': '1',
				Authorization: BEARER_TOKEN,
			});
		});
	});

	describe('async handling', () => {
		it('handles async interceptors', async () => {
			const config = createTestConfig();
			const interceptor = createAsyncRequestInterceptor({ Authorization: BEARER_TOKEN });
			const result = await executeRequestInterceptors([interceptor], config);
			expect(result.headers).toEqual({ Authorization: BEARER_TOKEN });
		});
	});

	describe('edge cases', () => {
		it(TEST_EMPTY_INTERCEPTOR_ARRAY, async () => {
			const config = createTestConfig();
			const result = await executeRequestInterceptors(EMPTY_INTERCEPTORS, config);
			expect(result).toBe(config);
		});

		it('allows interceptors to modify URL', async () => {
			const config = createTestConfig();
			const interceptor = createRequestInterceptorWithUrl(MODIFIED_URL);
			const result = await executeRequestInterceptors([interceptor], config);
			expect(result.url).toBe(MODIFIED_URL);
		});
	});
});

describe('executeResponseInterceptors', () => {
	describe('execution order', () => {
		it('executes interceptors in order', async () => {
			const response = createTestResponse();
			const interceptor1 = createResponseInterceptorWithData('modified1');
			const interceptor2 = createResponseInterceptorWithData('modified2');
			const result = await executeResponseInterceptors([interceptor1, interceptor2], response);
			expect(interceptor1).toHaveBeenCalledWith(response);
			expect(interceptor2).toHaveBeenCalledWith(expect.objectContaining({ data: 'modified1' }));
			expect(result.data).toBe('modified2');
		});
	});

	describe('async handling', () => {
		it('handles async interceptors', async () => {
			const response = createTestResponse();
			const interceptor = createAsyncResponseInterceptor('modified');
			const result = await executeResponseInterceptors([interceptor], response);
			expect(result.data).toBe('modified');
		});
	});

	describe('edge cases', () => {
		it(TEST_EMPTY_INTERCEPTOR_ARRAY, async () => {
			const response = createTestResponse();
			const result = await executeResponseInterceptors(EMPTY_INTERCEPTORS, response);
			expect(result).toBe(response);
		});

		it('allows interceptors to modify status', async () => {
			const response = createTestResponse();
			const interceptor = createResponseInterceptorWithStatus(201, 'Created');
			const result = await executeResponseInterceptors([interceptor], response);
			expect(result.status).toBe(201);
			expect(result.statusText).toBe('Created');
		});
	});
});

describe('executeErrorInterceptors - error propagation', () => {
	describe('multiple interceptors throwing', () => {
		it('executes all interceptors even if one throws', async () => {
			const error = createTestError();
			const interceptor1 = createThrowingErrorInterceptor('Interceptor 1 error');
			const interceptor2 = createThrowingErrorInterceptor('Interceptor 2 error');
			await expect(executeErrorInterceptors([interceptor1, interceptor2], error)).rejects.toThrow(
				'Interceptor 2 error'
			);
			expect(interceptor1).toHaveBeenCalledTimes(1);
			expect(interceptor2).toHaveBeenCalledTimes(1);
		});

		it('throws the last Error thrown by an interceptor', async () => {
			const error = createTestError(ORIGINAL_ERROR_MESSAGE);
			const interceptor1 = createThrowingErrorInterceptor('First error');
			const interceptor2 = createThrowingErrorInterceptor('Last error');
			await expect(executeErrorInterceptors([interceptor1, interceptor2], error)).rejects.toThrow(
				'Last error'
			);
		});
	});

	describe('no interceptor throws', () => {
		it('throws original error if no interceptor throws an Error', async () => {
			const error = createTestError(ORIGINAL_ERROR_MESSAGE);
			const interceptor: ErrorInterceptor = vi.fn();
			await expect(executeErrorInterceptors([interceptor], error)).rejects.toThrow(
				ORIGINAL_ERROR_MESSAGE
			);
		});
	});
});

describe('executeErrorInterceptors - non-Error handling', () => {
	it('ignores non-Error throws from interceptors', async () => {
		const error = createTestError(ORIGINAL_ERROR_MESSAGE);
		const interceptor1 = createNonErrorThrowingInterceptor();
		const interceptor2 = createThrowingErrorInterceptor('Error throw');
		await expect(executeErrorInterceptors([interceptor1, interceptor2], error)).rejects.toThrow(
			'Error throw'
		);
	});
});

describe('executeErrorInterceptors - edge cases', () => {
	it(TEST_EMPTY_INTERCEPTOR_ARRAY, async () => {
		const error = createTestError();
		await expect(executeErrorInterceptors(EMPTY_INTERCEPTORS, error)).rejects.toThrow(
			TEST_ERROR_MESSAGE
		);
	});

	it('calls all interceptors with the same error', async () => {
		const error = createTestError();
		const interceptor1: ErrorInterceptor = vi.fn();
		const interceptor2: ErrorInterceptor = vi.fn();
		try {
			await executeErrorInterceptors([interceptor1, interceptor2], error);
		} catch {
			// Expected to throw
		}
		expect(interceptor1).toHaveBeenCalledWith(error);
		expect(interceptor2).toHaveBeenCalledWith(error);
	});
});

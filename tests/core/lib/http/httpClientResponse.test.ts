import { createHttpError } from '@core/lib/http/httpClientErrorCreation';
import { executeResponseInterceptors } from '@core/lib/http/httpClientInterceptors';
import { processHttpResponse } from '@core/lib/http/httpClientResponse';
import { parseResponse } from '@core/lib/http/httpClientResponseParsing';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/lib/http/httpClientErrorCreation');
vi.mock('@core/lib/http/httpClientInterceptors');
vi.mock('@core/lib/http/httpClientResponseParsing');

// Helper functions
function createTestResponse(
	body: unknown,
	status = 200,
	statusText = 'OK',
	headers?: Record<string, string>
): Response {
	const defaultHeaders = { 'Content-Type': 'application/json' };
	return new Response(JSON.stringify(body), {
		status,
		statusText,
		headers: headers ?? defaultHeaders,
	});
}

function createHttpResponse<T>(response: Response, parsedData: T): HttpClientResponse<T> {
	return {
		data: parsedData,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
		response,
	};
}

function setupMocksForSuccess<T>(parsedData: T, httpResponse: HttpClientResponse<T>): void {
	vi.mocked(parseResponse).mockResolvedValue(parsedData);
	vi.mocked(executeResponseInterceptors).mockResolvedValue(httpResponse);
}

function setupMocksForError<T>(parsedData: T, httpError: Error): void {
	vi.mocked(parseResponse).mockResolvedValue(parsedData);
	vi.mocked(createHttpError).mockReturnValue(httpError);
}

function createZodSchema() {
	return {
		safeParse: vi.fn().mockReturnValue({ success: true, data: { key: 'value' } }),
	} as unknown as Parameters<typeof processHttpResponse>[2];
}

function createTestHttpError(parsedData: unknown, response: Response) {
	return {
		...new Error(`HTTP ${response.status}: ${response.statusText}`),
		status: response.status,
		data: parsedData,
		response,
	};
}

function setupSuccessTest<T>(parsedData: T) {
	const response = createTestResponse(parsedData);
	const httpResponse = createHttpResponse(response, parsedData);
	setupMocksForSuccess(parsedData, httpResponse);
	return { response, httpResponse };
}

describe('httpClientResponse', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('processHttpResponse', () => {
		describeSuccessfulResponses();
		describeErrorHandling();
		describeInterceptors();
		describeZodSchemaValidation();
		describeResponseStatusCodes();
	});
});

function describeSuccessfulResponses() {
	describe('successful responses', () => {
		it('processes successful response and executes interceptors', async () => {
			const { response, httpResponse } = setupSuccessTest({ key: 'value' });
			const result = await processHttpResponse(response, []);
			expect(parseResponse).toHaveBeenCalledWith(response, undefined);
			expect(executeResponseInterceptors).toHaveBeenCalledWith([], httpResponse);
			expect(result).toBe(httpResponse);
		});

		it('validates response with Zod schema when provided', async () => {
			const schema = createZodSchema();
			const { response, httpResponse } = setupSuccessTest({ key: 'value' });
			const result = await processHttpResponse(response, [], schema);
			expect(parseResponse).toHaveBeenCalledWith(response, schema);
			expect(result).toBe(httpResponse);
		});

		it('includes all response properties in httpResponse', async () => {
			const parsedData = { key: 'value' };
			const headers = { 'Content-Type': 'application/json', Location: '/api/resource/1' };
			const response = createTestResponse(parsedData, 201, 'Created', headers);
			const httpResponse = createHttpResponse(response, parsedData);
			setupMocksForSuccess(parsedData, httpResponse);
			const result = await processHttpResponse(response, []);
			expect(result.status).toBe(201);
			expect(result.statusText).toBe('Created');
			expect(result.headers).toBe(response.headers);
			expect(result.response).toBe(response);
		});
	});
}

function describeErrorHandling() {
	describe('error handling', () => {
		it('throws error for non-ok response', async () => {
			const parsedData = { error: 'Not found' };
			const response = createTestResponse(parsedData, 404, 'Not Found');
			const httpError = createTestHttpError(parsedData, response);
			setupMocksForError(parsedData, httpError);
			await expect(processHttpResponse(response, [])).rejects.toThrow();
			expect(parseResponse).toHaveBeenCalledWith(response, undefined);
			expect(createHttpError).toHaveBeenCalledWith(response, parsedData);
			expect(executeResponseInterceptors).not.toHaveBeenCalled();
		});
	});
}

function describeInterceptors() {
	describe('interceptors', () => {
		it('executes response interceptors with correct response', async () => {
			const { response, httpResponse } = setupSuccessTest({ key: 'value' });
			const interceptor = vi.fn().mockResolvedValue(httpResponse);
			await processHttpResponse(response, [interceptor]);
			expect(executeResponseInterceptors).toHaveBeenCalledWith([interceptor], httpResponse);
		});

		it('handles empty interceptor array', async () => {
			const { response, httpResponse } = setupSuccessTest({ key: 'value' });
			const result = await processHttpResponse(response, []);
			expect(executeResponseInterceptors).toHaveBeenCalledWith([], httpResponse);
			expect(result).toBe(httpResponse);
		});
	});
}

function describeZodSchemaValidation() {
	describe('Zod schema validation', () => {
		it('validates response data with Zod schema', async () => {
			const schema = createZodSchema();
			const { response, httpResponse } = setupSuccessTest({ key: 'value' });
			const result = await processHttpResponse(response, [], schema);
			expect(parseResponse).toHaveBeenCalledWith(response, schema);
			expect(result).toBe(httpResponse);
		});

		it('throws error when Zod schema validation fails', async () => {
			const schema = {
				safeParse: vi.fn().mockReturnValue({
					success: false,
					error: {
						issues: [{ message: 'Validation failed' }],
					},
				}),
			} as unknown as Parameters<typeof processHttpResponse>[2];
			const parsedData = { key: 123 };
			const response = createTestResponse(parsedData);
			// Mock parseResponse to throw the validation error
			vi.mocked(parseResponse).mockRejectedValue(
				new Error('Response validation failed: Validation failed')
			);

			await expect(processHttpResponse(response, [], schema)).rejects.toThrow(
				'Response validation failed'
			);
		});
	});
}

function describeResponseStatusCodes() {
	describe('response status codes', () => {
		it.each([
			{ status: 200, statusText: 'OK', shouldSucceed: true },
			{ status: 201, statusText: 'Created', shouldSucceed: true },
			{ status: 400, statusText: 'Bad Request', shouldSucceed: false },
			{ status: 401, statusText: 'Unauthorized', shouldSucceed: false },
			{ status: 403, statusText: 'Forbidden', shouldSucceed: false },
			{ status: 404, statusText: 'Not Found', shouldSucceed: false },
			{ status: 500, statusText: 'Internal Server Error', shouldSucceed: false },
		])('handles $status $statusText correctly', async ({ status, statusText, shouldSucceed }) => {
			const parsedData = { data: 'test' };
			const response = createTestResponse(parsedData, status, statusText);
			const httpResponse = createHttpResponse(response, parsedData);

			if (shouldSucceed) {
				setupMocksForSuccess(parsedData, httpResponse);
				const result = await processHttpResponse(response, []);
				expect(result.status).toBe(status);
				expect(result.statusText).toBe(statusText);
			} else {
				const httpError = createTestHttpError(parsedData, response);
				setupMocksForError(parsedData, httpError);
				await expect(processHttpResponse(response, [])).rejects.toThrow();
			}
		});

		it('handles 204 No Content correctly', async () => {
			// 204 No Content cannot have a body
			const response = new Response(null, {
				status: 204,
				statusText: 'No Content',
			});
			const parsedData = null;
			const httpResponse = createHttpResponse(response, parsedData);
			setupMocksForSuccess(parsedData, httpResponse);
			const result = await processHttpResponse(response, []);
			expect(result.status).toBe(204);
			expect(result.statusText).toBe('No Content');
		});
	});
}

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

		describe('interceptors', () => {
			it('executes response interceptors with correct response', async () => {
				const { response, httpResponse } = setupSuccessTest({ key: 'value' });
				const interceptor = vi.fn().mockResolvedValue(httpResponse);
				await processHttpResponse(response, [interceptor]);
				expect(executeResponseInterceptors).toHaveBeenCalledWith([interceptor], httpResponse);
			});
		});
	});
});

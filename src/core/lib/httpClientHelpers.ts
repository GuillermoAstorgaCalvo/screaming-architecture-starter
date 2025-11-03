/**
 * HTTP Client Helper Functions
 *
 * Utility functions for HTTP client operations.
 *
 * These functions are primarily used internally by HttpClient, but are exported
 * for advanced use cases such as:
 * - Custom HTTP client implementations
 * - Testing and mocking scenarios
 * - Building custom request/response handling logic
 *
 * For most use cases, prefer using the HttpClient class or httpClient instance
 * from @core/lib/httpClient rather than calling these helpers directly.
 */

import type { HttpClientError } from '@core/ports/HttpPort';

/**
 * Supported request body types
 */
export type RequestBody = string | FormData | Blob | ArrayBuffer | ReadableStream;

/**
 * Build the full URL from baseURL and path
 */
export function buildURL(url: string, baseURL?: string): string {
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	}
	const base = baseURL ?? '';
	if (!base) {
		return url;
	}
	const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base;
	const pathTrimmed = url.startsWith('/') ? url : `/${url}`;
	return `${baseTrimmed}${pathTrimmed}`;
}

/**
 * Add headers from a source to the target Headers object
 */
export function addHeadersFromSource(
	headers: Headers,
	source: Record<string, string> | HeadersInit
): void {
	if (source instanceof Headers) {
		for (const [key, value] of source.entries()) {
			headers.set(key, value);
		}
		return;
	}
	if (Array.isArray(source)) {
		for (const [key, value] of source) {
			headers.set(key, value);
		}
		return;
	}
	for (const [key, value] of Object.entries(source)) {
		headers.set(key, value);
	}
}

/**
 * Merge headers from multiple sources
 */
export function mergeHeaders(
	...headerSources: (Record<string, string> | Headers | HeadersInit | undefined)[]
): Headers {
	const headers = new Headers();
	for (const source of headerSources) {
		if (source) {
			addHeadersFromSource(headers, source);
		}
	}
	return headers;
}

/**
 * Check if body is a binary type
 */
export function isBinaryBody(
	body: unknown
): body is FormData | Blob | ArrayBuffer | ReadableStream {
	return (
		body instanceof FormData ||
		body instanceof Blob ||
		body instanceof ArrayBuffer ||
		body instanceof ReadableStream
	);
}

/**
 * Check if body is a primitive type
 */
export function isPrimitiveBody(body: unknown): body is string | number | boolean {
	return typeof body === 'string' || typeof body === 'number' || typeof body === 'boolean';
}

/**
 * Serialize request body
 */
export function serializeBody(body: unknown): RequestBody {
	if (body === null || body === undefined) {
		return '';
	}
	if (isBinaryBody(body)) {
		return body;
	}
	if (typeof body === 'object') {
		return JSON.stringify(body);
	}
	if (isPrimitiveBody(body)) {
		return String(body);
	}
	return JSON.stringify(body);
}

/**
 * Parse JSON response
 * Returns null for empty strings to avoid type issues with non-nullable types
 */
export async function parseJsonResponse<T>(text: string): Promise<T | null> {
	if (!text.trim()) {
		return null;
	}
	try {
		return JSON.parse(text) as T;
	} catch {
		// If JSON parsing fails, return text as-is (for non-JSON text responses)
		return text as unknown as T;
	}
}

/**
 * Parse response body based on Content-Type
 */
export async function parseResponse<T>(response: Response): Promise<T> {
	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) {
		const text = await response.text();
		const parsed = await parseJsonResponse<T>(text);
		// If parseJsonResponse returns null for empty strings, return null as T
		// This preserves backward compatibility while making the null case explicit
		if (parsed === null) {
			return null as unknown as T;
		}
		return parsed;
	}
	if (contentType.includes('text/')) {
		return (await response.text()) as unknown as T;
	}
	const isBinaryContent =
		contentType.startsWith('application/octet-stream') ||
		contentType.includes('image/') ||
		contentType.includes('video/') ||
		contentType.includes('audio/');
	if (isBinaryContent) {
		return (await response.blob()) as unknown as T;
	}
	return (await response.text()) as unknown as T;
}

/**
 * Result of createTimeoutController - includes both controller and timeout ID for cleanup
 */
export interface TimeoutController {
	controller: AbortController;
	timeoutId: ReturnType<typeof setTimeout>;
}

/**
 * Create an AbortController for timeout support
 * Returns both the controller and timeout ID so the timeout can be cleared if request completes early
 */
export function createTimeoutController(
	timeout?: number
): { controller: AbortController; timeoutId: ReturnType<typeof setTimeout> } | null {
	if (timeout) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, timeout);
		return { controller, timeoutId };
	}
	return null;
}

/**
 * Prepare request body and headers
 */
export function prepareRequestBody(
	body: unknown,
	headers: Record<string, string> | Headers | undefined
): { body?: RequestBody; headers: Headers } {
	const result: { body?: RequestBody; headers: Headers } = {
		headers: new Headers(headers),
	};

	if (body === undefined) {
		return result;
	}

	const serializedBody = serializeBody(body);
	result.body = serializedBody;

	// Remove Content-Type header for FormData (browser will set it automatically)
	if (serializedBody instanceof FormData) {
		result.headers.delete('Content-Type');
	}

	return result;
}

/**
 * Create HTTP error from response
 */
export function createHttpError<T>(response: Response, data: T): HttpClientError {
	const error: HttpClientError = new Error(
		`HTTP ${response.status}: ${response.statusText}`
	) as HttpClientError;
	error.status = response.status;
	error.data = data;
	error.response = response;
	return error;
}

/**
 * Convert Headers to Record for interceptor compatibility
 */
export function headersToRecord(headers: Headers): Record<string, string> {
	const headersRecord: Record<string, string> = {};
	for (const [key, value] of headers.entries()) {
		// Headers API guarantees string keys, but validate for safety
		headersRecord[key] = value;
	}
	return headersRecord;
}

/**
 * HTTP Client Body Utilities
 *
 * Utilities for serializing and preparing request bodies.
 */

/**
 * Supported request body types
 */
export type RequestBody = string | FormData | Blob | ArrayBuffer | ReadableStream;

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

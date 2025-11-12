/**
 * HTTP Client Header Utilities
 *
 * Utilities for manipulating and merging HTTP headers.
 */

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

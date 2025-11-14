/**
 * HTTP Client Error Creation Utilities
 *
 * Utilities for creating HTTP error objects from responses.
 */

import type { HttpClientError } from '@core/ports/HttpPort';

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

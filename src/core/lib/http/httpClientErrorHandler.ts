/**
 * HTTP Client Error Handler
 *
 * Handles error transformation and error interceptor execution.
 */

import { executeErrorInterceptors } from '@core/lib/http/httpClientInterceptors';
import type { HttpClientError } from '@core/ports/HttpPort';

/**
 * Handle and transform errors
 */
export async function handleHttpError(
	error: unknown,
	errorInterceptors: Parameters<typeof executeErrorInterceptors>[0]
): Promise<never> {
	// Handle AbortError (timeout)
	if (error instanceof DOMException && error.name === 'AbortError') {
		const timeoutError: HttpClientError = new Error('Request timeout') as HttpClientError;
		timeoutError.name = 'TimeoutError';
		return executeErrorInterceptors(errorInterceptors, timeoutError);
	}

	// Handle HttpClientError
	if (error && typeof error === 'object' && 'status' in error) {
		return executeErrorInterceptors(errorInterceptors, error as HttpClientError);
	}

	// Handle other errors
	const httpError: HttpClientError =
		error instanceof Error
			? (error as HttpClientError)
			: (new Error(String(error)) as HttpClientError);
	return executeErrorInterceptors(errorInterceptors, httpError);
}

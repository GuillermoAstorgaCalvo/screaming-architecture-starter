/**
 * HTTP Client Interceptor Types and Utilities
 *
 * Provides type definitions and execution utilities for HTTP client interceptors.
 * Interceptors allow you to modify requests, responses, or handle errors at different
 * stages of the HTTP request lifecycle.
 *
 * Usage:
 * - Request interceptors: Modify request config before sending (e.g., add auth tokens)
 * - Response interceptors: Transform response data before returning to caller
 * - Error interceptors: Handle and transform errors before throwing
 *
 * These interceptors are used internally by HttpClient but are exported for advanced
 * use cases such as custom client implementations or testing scenarios.
 *
 * See: @core/lib/httpClient for the HttpClient implementation that uses these interceptors
 */

import type { HttpClientConfig, HttpClientError, HttpClientResponse } from '@core/ports/HttpPort';

/**
 * Request interceptor function signature
 * Receives the request config and can modify it before sending
 */
export type RequestInterceptor = (
	_config: HttpClientConfig & { url: string }
) => Promise<HttpClientConfig & { url: string }> | (HttpClientConfig & { url: string });

/**
 * Response interceptor function signature
 * Receives the response and can modify it before returning
 */
export type ResponseInterceptor = <T>(
	_response: HttpClientResponse<T>
) => Promise<HttpClientResponse<T>> | HttpClientResponse<T>;

/**
 * Error interceptor function signature
 * Receives the error and can transform or rethrow it
 */
export type ErrorInterceptor = (_error: HttpClientError) => Promise<never> | never;

/**
 * Execute request interceptors
 */
export async function executeRequestInterceptors(
	interceptors: RequestInterceptor[],
	config: HttpClientConfig & { url: string }
): Promise<HttpClientConfig & { url: string }> {
	let processedConfig = config;
	for (const interceptor of interceptors) {
		processedConfig = await interceptor(processedConfig);
	}
	return processedConfig;
}

/**
 * Execute response interceptors
 */
export async function executeResponseInterceptors<T>(
	interceptors: ResponseInterceptor[],
	response: HttpClientResponse<T>
): Promise<HttpClientResponse<T>> {
	let processedResponse = response;
	for (const interceptor of interceptors) {
		processedResponse = await interceptor(processedResponse);
	}
	return processedResponse;
}

/**
 * Execute error interceptors
 */
export async function executeErrorInterceptors(
	interceptors: ErrorInterceptor[],
	error: HttpClientError
): Promise<never> {
	let lastError: Error | undefined;

	// Execute all interceptors, even if one throws
	for (const interceptor of interceptors) {
		try {
			await interceptor(error);
		} catch (interceptorError) {
			// Only remember Error instances; ignore non-Error throws
			if (interceptorError instanceof Error) {
				lastError = interceptorError;
			}
			// Continue to next interceptor regardless of what was thrown
		}
	}

	// Throw the last Error thrown by an interceptor, or the original error
	throw lastError ?? error;
}

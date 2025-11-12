/**
 * HTTP Client Method Helpers
 *
 * Convenience methods for making HTTP requests with specific methods.
 * These methods wrap the core request() method with method-specific configurations.
 */

import type { HttpClientConfig, HttpClientResponse, HttpPort } from '@core/ports/HttpPort';

/**
 * Type for request method that accepts URL and config
 */
export type RequestMethod = <T = unknown>(
	url: string,
	config?: HttpClientConfig
) => Promise<HttpClientResponse<T>>;

/**
 * Create GET request method
 */
export function createGetMethod(request: RequestMethod): HttpPort['get'] {
	return async <T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'GET' });
	};
}

/**
 * Create POST request method
 */
export function createPostMethod(request: RequestMethod): HttpPort['post'] {
	return async <T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'POST', body });
	};
}

/**
 * Create PUT request method
 */
export function createPutMethod(request: RequestMethod): HttpPort['put'] {
	return async <T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'PUT', body });
	};
}

/**
 * Create PATCH request method
 */
export function createPatchMethod(request: RequestMethod): HttpPort['patch'] {
	return async <T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'PATCH', body });
	};
}

/**
 * Create DELETE request method
 */
export function createDeleteMethod(request: RequestMethod): HttpPort['delete'] {
	return async <T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'DELETE' });
	};
}

/**
 * Create HEAD request method
 */
export function createHeadMethod(request: RequestMethod): HttpPort['head'] {
	return async <T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'HEAD' });
	};
}

/**
 * Create OPTIONS request method
 */
export function createOptionsMethod(request: RequestMethod): HttpPort['options'] {
	return async <T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> => {
		return request<T>(url, { ...config, method: 'OPTIONS' });
	};
}

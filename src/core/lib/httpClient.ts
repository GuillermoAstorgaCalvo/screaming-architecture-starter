/**
 * HTTP Client - Generic fetch-based wrapper for API calls
 *
 * Provides a centralized HTTP client for domain services to make API calls.
 * This abstraction enables:
 * - Consistent error handling
 * - Request/response transformation
 * - Interceptor support (request, response, and error interceptors)
 * - Type-safe API calls
 *
 * Domain services should use this client instead of calling fetch directly.
 * Interceptors are defined in core/lib/httpClientInterceptors.ts.
 *
 * Note: This client implements HttpPort interface to ensure contract compliance
 * with the hexagonal architecture port definition.
 */

import type {
	ErrorInterceptor,
	RequestInterceptor,
	ResponseInterceptor,
} from '@core/lib/httpClientInterceptors';
import type { HttpClientConfig, HttpClientResponse, HttpPort } from '@core/ports/HttpPort';

import { createDefaultConfig } from './httpClientConfig';
import { handleHttpError } from './httpClientErrorHandler';
import {
	createDeleteMethod,
	createGetMethod,
	createHeadMethod,
	createOptionsMethod,
	createPatchMethod,
	createPostMethod,
	createPutMethod,
} from './httpClientMethods';
import {
	clearTimeoutSafely,
	createRequestTimeout,
	prepareFetchConfig,
	prepareRequestConfig,
} from './httpClientRequest';
import { processHttpResponse } from './httpClientResponse';

class HttpClient implements HttpPort {
	private readonly requestInterceptors: RequestInterceptor[] = [];
	private readonly responseInterceptors: ResponseInterceptor[] = [];
	private readonly errorInterceptors: ErrorInterceptor[] = [];
	private defaultConfig: HttpClientConfig = createDefaultConfig();

	/**
	 * Set default configuration for all requests
	 */
	setDefaultConfig(config: Partial<HttpClientConfig>): void {
		this.defaultConfig = { ...this.defaultConfig, ...config };
	}

	/**
	 * Add a request interceptor
	 * Interceptors are executed in the order they are added
	 */
	addRequestInterceptor(interceptor: RequestInterceptor): void {
		this.requestInterceptors.push(interceptor);
	}

	/**
	 * Add a response interceptor
	 * Interceptors are executed in the order they are added
	 */
	addResponseInterceptor(interceptor: ResponseInterceptor): void {
		this.responseInterceptors.push(interceptor);
	}

	/**
	 * Add an error interceptor
	 * Interceptors are executed in the order they are added
	 */
	addErrorInterceptor(interceptor: ErrorInterceptor): void {
		this.errorInterceptors.push(interceptor);
	}

	/**
	 * Core request method
	 */
	async request<T = unknown>(
		url: string,
		config: HttpClientConfig = {}
	): Promise<HttpClientResponse<T>> {
		let timeoutController = null;
		try {
			const requestConfig = await prepareRequestConfig({
				url,
				config,
				defaultConfig: this.defaultConfig,
				requestInterceptors: this.requestInterceptors,
			});
			timeoutController = createRequestTimeout(requestConfig.timeout, this.defaultConfig.timeout);
			const { finalURL, finalFetchConfig } = prepareFetchConfig(requestConfig, timeoutController);

			const response = await fetch(finalURL, finalFetchConfig);
			clearTimeoutSafely(timeoutController);
			return await processHttpResponse<T>(response, this.responseInterceptors);
		} catch (error) {
			clearTimeoutSafely(timeoutController);
			return handleHttpError(error, this.errorInterceptors);
		}
	}

	/**
	 * GET request
	 */
	async get<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return createGetMethod(this.request.bind(this))<T>(url, config);
	}

	/**
	 * POST request
	 */
	async post<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return createPostMethod(this.request.bind(this))<T>(url, body, config);
	}

	/**
	 * PUT request
	 */
	async put<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return createPutMethod(this.request.bind(this))<T>(url, body, config);
	}

	/**
	 * PATCH request
	 */
	async patch<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return createPatchMethod(this.request.bind(this))<T>(url, body, config);
	}

	/**
	 * DELETE request
	 */
	async delete<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return createDeleteMethod(this.request.bind(this))<T>(url, config);
	}

	/**
	 * HEAD request
	 */
	async head<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return createHeadMethod(this.request.bind(this))<T>(url, config);
	}

	/**
	 * OPTIONS request
	 */
	async options<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return createOptionsMethod(this.request.bind(this))<T>(url, config);
	}
}

/**
 * HttpClient class - Implementation of HttpPort interface
 *
 * Provides a fetch-based HTTP client with interceptor support.
 * Implements the HttpPort contract to ensure type safety and architectural compliance.
 *
 * Most use cases should use the default `httpClient` instance, but the class is exported
 * for cases where multiple client instances are needed (e.g., different base URLs or configs).
 */
export { HttpClient };

/**
 * Default HTTP client instance
 * Domain services should import and use this instance
 */
export const httpClient = new HttpClient();

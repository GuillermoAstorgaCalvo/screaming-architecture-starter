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
	HttpClientConfig,
	HttpClientError,
	HttpClientResponse,
	HttpPort,
} from '@core/ports/HttpPort';

import {
	buildURL,
	createHttpError,
	createTimeoutController,
	headersToRecord,
	mergeHeaders,
	parseResponse,
	prepareRequestBody,
	type TimeoutController,
} from './httpClientHelpers';
import {
	type ErrorInterceptor,
	executeErrorInterceptors,
	executeRequestInterceptors,
	executeResponseInterceptors,
	type RequestInterceptor,
	type ResponseInterceptor,
} from './httpClientInterceptors';

/**
 * Type Re-exports for Convenience
 *
 * Types are re-exported here so domains can import everything from @core/lib/httpClient
 * without needing to know about the underlying port/interceptor structure.
 *
 * These types are also available from their original locations:
 * - HttpClientConfig, HttpClientError, HttpClientResponse: @core/ports/HttpPort
 * - RequestInterceptor, ResponseInterceptor, ErrorInterceptor: @core/lib/httpClientInterceptors
 * - RequestBody: @core/lib/httpClientHelpers
 */
export type { RequestBody } from './httpClientHelpers';
export type {
	ErrorInterceptor,
	RequestInterceptor,
	ResponseInterceptor,
} from './httpClientInterceptors';
export type { HttpClientConfig, HttpClientError, HttpClientResponse } from '@core/ports/HttpPort';

class HttpClient implements HttpPort {
	private readonly requestInterceptors: RequestInterceptor[] = [];
	private readonly responseInterceptors: ResponseInterceptor[] = [];
	private readonly errorInterceptors: ErrorInterceptor[] = [];
	private defaultConfig: HttpClientConfig = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

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
	 * Handle and transform errors
	 */
	private async handleError(error: unknown): Promise<never> {
		// Handle AbortError (timeout)
		if (error instanceof DOMException && error.name === 'AbortError') {
			const timeoutError: HttpClientError = new Error('Request timeout') as HttpClientError;
			timeoutError.name = 'TimeoutError';
			return executeErrorInterceptors(this.errorInterceptors, timeoutError);
		}

		// Handle HttpClientError
		if (error && typeof error === 'object' && 'status' in error) {
			return executeErrorInterceptors(this.errorInterceptors, error as HttpClientError);
		}

		// Handle other errors
		const httpError: HttpClientError =
			error instanceof Error
				? (error as HttpClientError)
				: (new Error(String(error)) as HttpClientError);
		return executeErrorInterceptors(this.errorInterceptors, httpError);
	}

	/**
	 * Merge configuration and headers
	 */
	private mergeConfigAndHeaders(
		url: string,
		config: HttpClientConfig
	): {
		mergedConfig: Omit<HttpClientConfig, 'headers'>;
		mergedHeaders: Headers;
		fullURL: string;
	} {
		const { headers: defaultHeaders, ...restDefaultConfig } = this.defaultConfig;
		const { headers: configHeaders, ...restConfig } = config;
		const mergedConfig: Omit<HttpClientConfig, 'headers'> = {
			...restDefaultConfig,
			...restConfig,
		};
		const mergedHeaders = mergeHeaders(defaultHeaders, configHeaders);
		const fullURL = buildURL(url, mergedConfig.baseURL ?? this.defaultConfig.baseURL);
		return { mergedConfig, mergedHeaders, fullURL };
	}

	/**
	 * Prepare final fetch configuration
	 */
	private prepareFetchConfig(
		requestConfig: HttpClientConfig & { url: string },
		timeoutController: TimeoutController | null
	): { finalURL: string; finalFetchConfig: RequestInit } {
		const finalURL = requestConfig.url;
		const { url: _url, baseURL: _baseURL, timeout: _timeout, body, ...fetchConfig } = requestConfig;

		if (timeoutController) {
			fetchConfig.signal = timeoutController.controller.signal;
		}

		const requestHeaders = mergeHeaders(requestConfig.headers);
		const { body: finalBody, headers: finalHeaders } = prepareRequestBody(body, requestHeaders);

		const finalFetchConfig: RequestInit = {
			...fetchConfig,
			body: finalBody ?? null,
			headers: finalHeaders,
		};

		return { finalURL, finalFetchConfig };
	}

	/**
	 * Process response and handle errors
	 */
	private async processResponse<T>(response: Response): Promise<HttpClientResponse<T>> {
		const data = await parseResponse<T>(response);
		const httpResponse: HttpClientResponse<T> = {
			data,
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			response,
		};

		if (response.ok) {
			return executeResponseInterceptors(this.responseInterceptors, httpResponse);
		}

		throw createHttpError(response, data);
	}

	/**
	 * Clear timeout controller safely
	 */
	private clearTimeoutSafely(timeoutController: TimeoutController | null): void {
		if (timeoutController) {
			clearTimeout(timeoutController.timeoutId);
		}
	}

	/**
	 * Prepare request configuration with interceptors
	 */
	private async prepareRequestConfig(
		url: string,
		config: HttpClientConfig
	): Promise<HttpClientConfig & { url: string }> {
		const { mergedConfig, mergedHeaders, fullURL } = this.mergeConfigAndHeaders(url, config);

		const requestConfig: HttpClientConfig & { url: string } = {
			...mergedConfig,
			headers: headersToRecord(mergedHeaders),
			url: fullURL,
		};

		return executeRequestInterceptors(this.requestInterceptors, requestConfig);
	}

	/**
	 * Core request method
	 */
	async request<T = unknown>(
		url: string,
		config: HttpClientConfig = {}
	): Promise<HttpClientResponse<T>> {
		let timeoutController: TimeoutController | null = null;
		try {
			const requestConfig = await this.prepareRequestConfig(url, config);
			timeoutController = createTimeoutController(
				requestConfig.timeout ?? this.defaultConfig.timeout
			);
			const { finalURL, finalFetchConfig } = this.prepareFetchConfig(
				requestConfig,
				timeoutController
			);

			const response = await fetch(finalURL, finalFetchConfig);
			this.clearTimeoutSafely(timeoutController);
			return await this.processResponse<T>(response);
		} catch (error) {
			this.clearTimeoutSafely(timeoutController);
			return this.handleError(error);
		}
	}

	/**
	 * GET request
	 */
	async get<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'POST', body });
	}

	/**
	 * PUT request
	 */
	async put<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'PUT', body });
	}

	/**
	 * PATCH request
	 */
	async patch<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'PATCH', body });
	}

	/**
	 * DELETE request
	 */
	async delete<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'DELETE' });
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

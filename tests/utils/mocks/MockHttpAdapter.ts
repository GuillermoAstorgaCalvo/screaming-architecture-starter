import type { HttpClientConfig, HttpClientResponse, HttpPort } from '@core/ports/HttpPort';

/**
 * Mock HttpPort implementation for testing
 * Records requests for assertions and allows configuring responses
 */
export class MockHttpAdapter implements HttpPort {
	private static readonly TYPE_STRING = 'string';
	private static readonly ERROR_URL_MUST_BE_STRING =
		'MockHttpAdapter: url must be a non-empty string';

	public readonly requests: Array<{
		method: string;
		url: string;
		config?: HttpClientConfig;
		body?: unknown;
	}> = [];

	private readonly responseHandlers: Array<{
		match: (url: string, method: string) => boolean;
		handler: (
			url: string,
			method: string,
			config?: HttpClientConfig,
			body?: unknown
		) => Promise<HttpClientResponse>;
	}> = [];

	/**
	 * Configure a response for a specific URL pattern and method
	 */
	mockResponse(
		urlPattern: string | RegExp | ((url: string) => boolean),
		method: string,
		response: HttpClientResponse | (() => Promise<HttpClientResponse>)
	): void {
		let matchFn: (url: string) => boolean;
		if (typeof urlPattern === 'string') {
			matchFn = (url: string) => url === urlPattern;
		} else if (typeof urlPattern === 'function') {
			matchFn = urlPattern;
		} else {
			matchFn = (url: string) => urlPattern.test(url);
		}

		this.responseHandlers.push({
			match: (url: string, method_: string) =>
				matchFn(url) && method_.toUpperCase() === method.toUpperCase(),
			handler: async (
				_url: string,
				_method_: string,
				_config?: HttpClientConfig,
				_body?: unknown
			) => {
				if (typeof response === 'function') {
					return response();
				}
				return response;
			},
		});
	}

	/**
	 * Configure default response for all requests
	 */
	mockDefaultResponse(response: HttpClientResponse | (() => Promise<HttpClientResponse>)): void {
		this.responseHandlers.push({
			match: () => true,
			handler: async () => {
				if (typeof response === 'function') {
					return response();
				}
				return response;
			},
		});
	}

	private async findHandler(
		url: string,
		method: string,
		config?: HttpClientConfig,
		body?: unknown
	): Promise<HttpClientResponse> {
		// Search in reverse order so more specific handlers (added later) take precedence
		// over default handlers (which match everything)
		for (let i = this.responseHandlers.length - 1; i >= 0; i--) {
			const handler = this.responseHandlers[i];
			if (handler?.match(url, method)) {
				return handler.handler(url, method, config, body);
			}
		}

		// Default 200 OK response if no handler matches
		return {
			data: {},
			status: 200,
			statusText: 'OK',
			headers: new Headers(),
			response: new Response(),
		};
	}

	async request<T = unknown>(
		url: string,
		config?: HttpClientConfig
	): Promise<HttpClientResponse<T>> {
		if (!url || typeof url !== MockHttpAdapter.TYPE_STRING) {
			throw new TypeError(MockHttpAdapter.ERROR_URL_MUST_BE_STRING);
		}
		const method = (config?.method ?? 'GET').toUpperCase();
		this.requests.push({
			method,
			url,
			...(config !== undefined && { config }),
			...(config?.body !== undefined && { body: config.body }),
		});

		return (await this.findHandler(url, method, config, config?.body)) as HttpClientResponse<T>;
	}

	async get<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'GET' });
	}

	async post<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'POST', body });
	}

	async put<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'PUT', body });
	}

	async patch<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'PATCH', body });
	}

	async delete<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>> {
		return this.request<T>(url, { ...config, method: 'DELETE' });
	}

	/**
	 * Test helper: Clear all requests and handlers (useful for test cleanup)
	 */
	reset(): void {
		this.requests.length = 0;
		this.responseHandlers.length = 0;
	}
}

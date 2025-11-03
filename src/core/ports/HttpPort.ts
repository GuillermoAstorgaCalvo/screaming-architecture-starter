/**
 * HttpPort - Interface for HTTP operations
 *
 * Hexagonal architecture port: defines the contract for HTTP operations.
 * Infrastructure adapters implement this interface, while domains depend only on the port.
 *
 * This abstraction enables:
 * - Consistent HTTP client interface across implementations
 * - Easy testing with mock implementations
 * - Swapping HTTP backends (fetch, axios, etc.) without changing domain code
 * - Type-safe API calls
 */

/**
 * Configuration options for HTTP requests
 * Extends RequestInit with additional conveniences for API clients
 */
export interface HttpClientConfig extends Omit<RequestInit, 'body'> {
	/**
	 * Request body (automatically serialized if object)
	 */
	body?: unknown;
	/**
	 * Base URL for all requests
	 */
	baseURL?: string;
	/**
	 * Request timeout in milliseconds
	 */
	timeout?: number;
	/**
	 * Custom headers (merged with default headers)
	 */
	headers?: Record<string, string>;
}

/**
 * HTTP response wrapper with typed data
 */
export interface HttpClientResponse<T = unknown> {
	/**
	 * Response data (parsed JSON or raw response)
	 */
	data: T;
	/**
	 * HTTP status code
	 */
	status: number;
	/**
	 * Response status text
	 */
	statusText: string;
	/**
	 * Response headers
	 */
	headers: Headers;
	/**
	 * Original fetch response
	 */
	response: Response;
}

/**
 * HTTP client error with enhanced error information
 */
export interface HttpClientError extends Error {
	/**
	 * HTTP status code (if available)
	 */
	status?: number;
	/**
	 * Response data (if available)
	 */
	data?: unknown;
	/**
	 * Original response (if available)
	 */
	response?: Response;
}

/**
 * HttpPort - Interface for HTTP operations
 *
 * Defines the contract for making HTTP requests. All methods return promises
 * that resolve to HttpClientResponse or reject with HttpClientError.
 */
export interface HttpPort {
	/**
	 * Make a generic HTTP request
	 * @param url - The request URL
	 * @param config - Request configuration
	 * @returns Promise resolving to the HTTP response
	 */
	request<T = unknown>(url: string, config?: HttpClientConfig): Promise<HttpClientResponse<T>>;

	/**
	 * Make a GET request
	 * @param url - The request URL
	 * @param config - Request configuration (body and method are omitted)
	 * @returns Promise resolving to the HTTP response
	 */
	get<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>>;

	/**
	 * Make a POST request
	 * @param url - The request URL
	 * @param body - Request body
	 * @param config - Request configuration (method is omitted)
	 * @returns Promise resolving to the HTTP response
	 */
	post<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>>;

	/**
	 * Make a PUT request
	 * @param url - The request URL
	 * @param body - Request body
	 * @param config - Request configuration (method is omitted)
	 * @returns Promise resolving to the HTTP response
	 */
	put<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>>;

	/**
	 * Make a PATCH request
	 * @param url - The request URL
	 * @param body - Request body
	 * @param config - Request configuration (method is omitted)
	 * @returns Promise resolving to the HTTP response
	 */
	patch<T = unknown>(
		url: string,
		body?: unknown,
		config?: Omit<HttpClientConfig, 'method'>
	): Promise<HttpClientResponse<T>>;

	/**
	 * Make a DELETE request
	 * @param url - The request URL
	 * @param config - Request configuration (body and method are omitted)
	 * @returns Promise resolving to the HTTP response
	 */
	delete<T = unknown>(
		url: string,
		config?: Omit<HttpClientConfig, 'body' | 'method'>
	): Promise<HttpClientResponse<T>>;
}

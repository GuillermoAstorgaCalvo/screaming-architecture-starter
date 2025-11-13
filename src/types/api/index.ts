/**
 * API-related types
 *
 * Common types for API requests, responses, and error handling.
 * Domain-specific API types should be defined in their respective domains.
 */

import type { HttpClientError, HttpClientResponse } from '@core/ports/HttpPort';
import type { Result } from '@src-types/result';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = unknown> {
	/** Response data */
	data: T;
	/** Optional success message */
	message?: string;
	/** Optional metadata */
	metadata?: Record<string, unknown>;
}

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
	/** Error message */
	message: string;
	/** Error code */
	code?: string;
	/** Field-level validation errors */
	errors?: Array<{
		field: string;
		message: string;
	}>;
	/** Additional error context */
	context?: Record<string, unknown>;
}

/**
 * API response wrapper that includes HTTP metadata
 */
export interface ApiResponseWithMeta<T = unknown> extends HttpClientResponse<T> {
	/** Response data */
	data: T;
	/** Optional API-specific metadata */
	apiMeta?: {
		/** API version */
		version?: string;
		/** Request ID for tracing */
		requestId?: string;
		/** Timestamp of the response */
		timestamp?: string;
	};
	/** Optional success message from API */
	message?: string;
	/** Optional metadata wrapper from API */
	metadata?: Record<string, unknown>;
}

/**
 * HTTP API error with full context
 *
 * Note: For application-level API errors, use the ApiError from @src-types/errors
 * which extends AppError. This type is for low-level HTTP client errors.
 */
export interface HttpApiError extends HttpClientError {
	/** API error response details */
	apiError?: ApiErrorResponse;
	/** Request context */
	requestContext?: {
		url: string;
		method: string;
		headers?: Record<string, string>;
	};
}

/**
 * API endpoint configuration
 */
export interface ApiEndpoint {
	/** Endpoint path */
	path: string;
	/** HTTP method */
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Whether authentication is required */
	requiresAuth?: boolean;
	/** Request timeout in milliseconds */
	timeout?: number;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
	/** Request timeout in milliseconds */
	timeout?: number;
	/** Additional headers */
	headers?: Record<string, string>;
	/** Whether to retry on failure */
	retry?: boolean;
	/** Number of retry attempts */
	retryAttempts?: number;
}

/**
 * Generic API service interface
 */
export type ApiServiceResult<TResponse, TError = unknown> = Result<
	ApiResponseWithMeta<TResponse>,
	TError
>;

/**
 * Generic API service interface
 */
export interface ApiService<TRequest = unknown, TResponse = unknown, TError = unknown> {
	/** Execute the API request */
	execute(
		request: TRequest,
		options?: ApiRequestOptions
	): Promise<ApiServiceResult<TResponse, TError>>;
}

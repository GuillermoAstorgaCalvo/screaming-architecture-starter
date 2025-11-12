/**
 * HTTP-related types
 *
 * Provides HTTP-related type definitions and utility functions
 * for use across the application.
 */

// Import HttpStatusCategoryType for use in this file
import type { HttpStatusCategoryType } from './enums';

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Common HTTP status codes
 */
export type HttpStatusCode =
	| 200 // OK
	| 201 // Created
	| 204 // No Content
	| 400 // Bad Request
	| 401 // Unauthorized
	| 403 // Forbidden
	| 404 // Not Found
	| 409 // Conflict
	| 422 // Unprocessable Entity
	| 429 // Too Many Requests
	| 500 // Internal Server Error
	| 502 // Bad Gateway
	| 503 // Service Unavailable
	| 504; // Gateway Timeout

/**
 * HTTP status code range constants
 */
const HTTP_STATUS_SUCCESS_MIN = 200;
const HTTP_STATUS_SUCCESS_MAX = 300;
const HTTP_STATUS_CLIENT_ERROR_MIN = 400;
const HTTP_STATUS_CLIENT_ERROR_MAX = 500;
const HTTP_STATUS_SERVER_ERROR_MIN = 500;
const HTTP_STATUS_SERVER_ERROR_MAX = 600;

/**
 * HTTP status code category
 */
/**
 * Determine the category of an HTTP status code
 */
export function getHttpStatusCategory(status: number): HttpStatusCategoryType {
	if (status >= HTTP_STATUS_SUCCESS_MIN && status < HTTP_STATUS_SUCCESS_MAX) {
		return 'success';
	}
	if (status >= HTTP_STATUS_CLIENT_ERROR_MIN && status < HTTP_STATUS_CLIENT_ERROR_MAX) {
		return 'clientError';
	}
	if (status >= HTTP_STATUS_SERVER_ERROR_MIN && status < HTTP_STATUS_SERVER_ERROR_MAX) {
		return 'serverError';
	}
	return 'unknown';
}

/**
 * Check if an HTTP status code indicates success
 */
export function isSuccessStatus(status: number): boolean {
	return status >= HTTP_STATUS_SUCCESS_MIN && status < HTTP_STATUS_SUCCESS_MAX;
}

/**
 * Check if an HTTP status code indicates a client error
 */
export function isClientError(status: number): boolean {
	return status >= HTTP_STATUS_CLIENT_ERROR_MIN && status < HTTP_STATUS_CLIENT_ERROR_MAX;
}

/**
 * Check if an HTTP status code indicates a server error
 */
export function isServerError(status: number): boolean {
	return status >= HTTP_STATUS_SERVER_ERROR_MIN && status < HTTP_STATUS_SERVER_ERROR_MAX;
}

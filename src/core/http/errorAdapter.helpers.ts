/**
 * Error Adapter Helpers
 *
 * Utility functions for error detection, extraction, and classification.
 */

import type { HttpClientError } from '@core/ports/HttpPort';
import type { ApiErrorResponse } from '@src-types/api';
import { isClientError, isServerError } from '@src-types/http';

import { STATUS_CODE_TO_ERROR_TYPE } from './errorAdapter.constants';
import { apiErrorResponseSchema, validationErrorsSchema } from './errorAdapter.schemas';
import type { DomainErrorType } from './errorAdapter.types';

/**
 * Determine error type from HTTP status code
 * Note: Status 0 should be handled as network error before calling this function
 */
export function getErrorTypeFromStatus(status: number): DomainErrorType {
	// Status 0 indicates network/CORS errors
	if (status === 0) {
		return 'network';
	}

	const mappedType = STATUS_CODE_TO_ERROR_TYPE[status];
	if (mappedType !== undefined) return mappedType;
	if (isClientError(status)) return 'clientError';
	if (isServerError(status)) return 'serverError';
	return 'unknown';
}

/**
 * Extract API error response from error data
 * Uses Zod schema for runtime validation
 */
export function extractApiError(data: unknown): ApiErrorResponse | undefined {
	if (!data || typeof data !== 'object') {
		return undefined;
	}

	// Validate using Zod schema
	const result = apiErrorResponseSchema.safeParse(data);
	if (result.success) {
		const response: ApiErrorResponse = {
			message: result.data.message,
		};
		if (result.data.code !== undefined) {
			response.code = result.data.code;
		}
		if (result.data.errors !== undefined) {
			response.errors = result.data.errors;
		}
		if (result.data.context !== undefined) {
			response.context = result.data.context;
		}
		return response;
	}

	return undefined;
}

/**
 * Extract validation errors from API error response
 * Uses Zod schema for runtime validation
 */
export function extractValidationErrors(
	apiError: ApiErrorResponse | undefined
): Array<{ field: string; message: string }> | undefined {
	if (!apiError?.errors || !Array.isArray(apiError.errors)) {
		return undefined;
	}

	// Validate using Zod schema
	const result = validationErrorsSchema.safeParse(apiError.errors);
	if (result.success) {
		return result.data;
	}

	return undefined;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): error is Error {
	return (
		error instanceof Error &&
		(error.name === 'TimeoutError' ||
			(error instanceof DOMException && error.name === 'AbortError'))
	);
}

/**
 * Check if error is a network error
 * Network errors include:
 * - Errors without status codes (fetch failures, connection issues)
 * - Errors with status 0 (CORS, network failures)
 * - Errors with network-related messages
 */
export function isNetworkError(error: unknown): error is Error {
	if (!(error instanceof Error)) {
		return false;
	}

	// Check for status 0 (CORS/network failures)
	// error is already confirmed to be Error, so it's an object
	if ('status' in error && (error as { status?: number }).status === 0) {
		return true;
	}

	// Check for errors without status that indicate network issues
	if (!('status' in error)) {
		const message = error.message.toLowerCase();
		const networkKeywords = [
			'fetch',
			'network',
			'failed to fetch',
			'networkerror',
			'connection',
			'cors',
		];
		return networkKeywords.some(keyword => message.includes(keyword));
	}

	return false;
}

/**
 * Check if error is an HttpClientError
 * Excludes status 0 (which indicates network/CORS errors, not HTTP errors)
 */
export function isHttpClientError(error: unknown): error is HttpClientError {
	if (error === null || typeof error !== 'object') {
		return false;
	}

	// Must have status property
	if (!('status' in error)) {
		return false;
	}

	// Status 0 indicates network/CORS errors, not HTTP errors
	const { status } = error as { status?: number };
	if (status === 0 || status === undefined) {
		return false;
	}

	return true;
}

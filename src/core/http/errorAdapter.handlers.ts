/**
 * Error Adapter Handlers
 *
 * Error handling methods for different error types.
 */

import type { HttpClientError } from '@core/ports/HttpPort';
import type { ApiErrorResponse } from '@src-types/api';

import { ERROR_MESSAGES } from './errorAdapter.constants';
import {
	extractApiError,
	extractValidationErrors,
	getErrorTypeFromStatus,
} from './errorAdapter.helpers';
import type { DomainError, DomainErrorType } from './errorAdapter.types';

/**
 * Get error message from various sources (priority: custom > API > error > status > default)
 */
export function getErrorMessage(
	error: HttpClientError,
	apiError: ApiErrorResponse | undefined,
	customMessage?: string
): string {
	if (customMessage) {
		return customMessage;
	}
	if (apiError?.message) {
		return apiError.message;
	}
	if (error.message) {
		return error.message;
	}
	if (error.status) {
		const statusText = error.response?.statusText ?? 'Request failed';
		return `HTTP ${error.status}: ${statusText}`;
	}
	return ERROR_MESSAGES.UNKNOWN;
}

/**
 * Create a base domain error with optional original error
 */
export function createDomainError(
	type: DomainErrorType,
	message: string,
	originalError?: HttpClientError
): DomainError {
	return originalError ? { type, message, originalError } : { type, message };
}

/**
 * Handle timeout errors
 */
export function handleTimeoutError(
	error: Error,
	customMessage?: string,
	includeOriginal = true
): DomainError {
	return createDomainError(
		'timeout',
		customMessage ?? ERROR_MESSAGES.TIMEOUT,
		includeOriginal ? (error as HttpClientError) : undefined
	);
}

/**
 * Handle network errors
 */
export function handleNetworkError(
	error: Error,
	customMessage?: string,
	includeOriginal = true
): DomainError {
	return createDomainError(
		'network',
		customMessage ?? ERROR_MESSAGES.NETWORK,
		includeOriginal ? (error as HttpClientError) : undefined
	);
}

/**
 * Build domain error result with optional fields
 */
function buildDomainErrorResult(options: {
	errorType: DomainErrorType;
	message: string;
	httpError: HttpClientError;
	apiError: ApiErrorResponse | undefined;
	validationErrors: Array<{ field: string; message: string }> | undefined;
	includeOriginal: boolean;
}): DomainError {
	const { errorType, message, httpError, apiError, validationErrors, includeOriginal } = options;
	const result: DomainError = {
		type: errorType,
		message,
	};
	if (httpError.status !== undefined) {
		result.status = httpError.status;
	}
	if (includeOriginal) {
		result.originalError = httpError;
	}
	if (apiError) {
		result.apiError = apiError;
	}
	if (validationErrors) {
		result.validationErrors = validationErrors;
	}
	if (apiError?.code) {
		result.code = apiError.code;
	}
	return result;
}

/**
 * Handle HTTP client errors
 * Note: Status 0 errors should be handled as network errors, not HTTP errors
 */
export function handleHttpError(
	httpError: HttpClientError,
	customMessage?: string,
	includeOriginal = true
): DomainError {
	// Status 0 indicates network/CORS errors, not HTTP errors
	// This should be caught by isNetworkError, but handle defensively
	if (httpError.status === 0) {
		return handleNetworkError(httpError, customMessage, includeOriginal);
	}

	const apiError = extractApiError(httpError.data);
	const validationErrors = extractValidationErrors(apiError);
	const errorType = httpError.status ? getErrorTypeFromStatus(httpError.status) : 'unknown';
	const message = getErrorMessage(httpError, apiError, customMessage);

	return buildDomainErrorResult({
		errorType,
		message,
		httpError,
		apiError,
		validationErrors,
		includeOriginal,
	});
}

/**
 * Handle generic/unknown errors
 */
export function handleGenericError(
	error: unknown,
	customMessage?: string,
	includeOriginal = true
): DomainError {
	const genericError: HttpClientError =
		error instanceof Error
			? (error as HttpClientError)
			: (new Error(String(error)) as HttpClientError);

	return createDomainError(
		'unknown',
		customMessage ?? (genericError.message || ERROR_MESSAGES.UNKNOWN),
		includeOriginal ? genericError : undefined
	);
}

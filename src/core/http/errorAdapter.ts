/**
 * HTTP Error Adapter - Normalizes HTTP errors to typed domain errors.
 * Usage: `const domainError = errorAdapter.adapt(error);`
 */

import { CLIENT_ERROR_TYPES, RETRYABLE_ERROR_TYPES } from './errorAdapter.constants';
import {
	handleGenericError,
	handleHttpError,
	handleNetworkError,
	handleTimeoutError,
} from './errorAdapter.handlers';
import { isHttpClientError, isNetworkError, isTimeoutError } from './errorAdapter.helpers';
import type { AdaptErrorOptions, DomainError, DomainErrorType } from './errorAdapter.types';

/** HTTP Error Adapter - Transforms HTTP errors into typed domain errors */
class HttpErrorAdapter {
	/** Adapt an HTTP error to a domain error */
	adapt(error: unknown, options: AdaptErrorOptions = {}): DomainError {
		const { customMessage, includeOriginal = true } = options;

		if (isTimeoutError(error)) {
			return handleTimeoutError(error, customMessage, includeOriginal);
		}

		if (isNetworkError(error)) {
			return handleNetworkError(error, customMessage, includeOriginal);
		}

		if (isHttpClientError(error)) {
			return handleHttpError(error, customMessage, includeOriginal);
		}

		return handleGenericError(error, customMessage, includeOriginal);
	}

	/** Check if an error is a specific domain error type */
	isType(error: DomainError, type: DomainErrorType): boolean {
		return error.type === type;
	}

	/** Check if an error is a client error (4xx) */
	isClientError(error: DomainError): boolean {
		return CLIENT_ERROR_TYPES.includes(error.type);
	}

	/** Check if an error is a server error (5xx) */
	isServerError(error: DomainError): boolean {
		return error.type === 'serverError';
	}

	/** Check if an error is retryable */
	isRetryable(error: DomainError): boolean {
		return RETRYABLE_ERROR_TYPES.includes(error.type);
	}
}

/** Default error adapter instance */
export const errorAdapter = new HttpErrorAdapter();

/** Convenience function to adapt an error */
export function adaptError(error: unknown, options?: AdaptErrorOptions): DomainError {
	return errorAdapter.adapt(error, options);
}

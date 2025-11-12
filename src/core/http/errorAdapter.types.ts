/**
 * Error Adapter Types
 *
 * Type definitions for HTTP error adaptation to domain errors.
 */

import type { HttpClientError } from '@core/ports/HttpPort';
import type { ApiErrorResponse } from '@src-types/api';

/**
 * Domain error types
 */
export type DomainErrorType =
	| 'network'
	| 'timeout'
	| 'clientError'
	| 'serverError'
	| 'validation'
	| 'authentication'
	| 'authorization'
	| 'notFound'
	| 'conflict'
	| 'rateLimit'
	| 'unknown';

/**
 * Adapted domain error
 */
export interface DomainError {
	/**
	 * Error type category
	 */
	type: DomainErrorType;
	/**
	 * HTTP status code (if available)
	 */
	status?: number;
	/**
	 * Error message
	 */
	message: string;
	/**
	 * Original HTTP error (for debugging)
	 */
	originalError?: HttpClientError;
	/**
	 * API error response details (if available)
	 */
	apiError?: ApiErrorResponse;
	/**
	 * Field-level validation errors (if available)
	 */
	validationErrors?: Array<{
		field: string;
		message: string;
	}>;
	/**
	 * Error code from API (if available)
	 */
	code?: string;
}

/**
 * Options for error adaptation
 */
export interface AdaptErrorOptions {
	/**
	 * Custom error message override
	 */
	customMessage?: string;
	/**
	 * Whether to include original error in result
	 */
	includeOriginal?: boolean;
}

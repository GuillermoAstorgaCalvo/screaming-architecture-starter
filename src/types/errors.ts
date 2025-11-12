/**
 * Error types
 *
 * Types for error handling, validation errors, API errors, and
 * application-specific error structures.
 */

import type { ApiErrorResponse } from './api';

/**
 * Base application error interface
 * All application errors should extend this
 */
export interface AppError extends Error {
	/** Error code for programmatic handling */
	code?: string;
	/** Error status code (HTTP status or custom) */
	statusCode?: number;
	/** Additional error context */
	context?: Record<string, unknown>;
	/** Timestamp when error occurred */
	timestamp?: Date | string;
}

/**
 * Validation error
 */
export interface ValidationError extends AppError {
	code: 'VALIDATION_ERROR';
	/** Field-level validation errors */
	errors?: Array<{
		/** Field name or path */
		field: string;
		/** Error message */
		message: string;
		/** Error code */
		code?: string;
	}>;
}

/**
 * API error (extends AppError with API-specific details)
 */
export interface ApiError extends AppError {
	code: 'API_ERROR';
	/** HTTP status code */
	statusCode: number;
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
 * Network error
 */
export interface NetworkError extends AppError {
	code: 'NETWORK_ERROR';
	/** Whether the error was due to timeout */
	isTimeout?: boolean;
	/** Whether the error was due to network unavailability */
	isOffline?: boolean;
}

/**
 * Authorization error
 */
export interface AuthorizationError extends AppError {
	code: 'AUTHORIZATION_ERROR';
	/** Required permissions or roles */
	required?: string[];
	/** Actual permissions or roles */
	actual?: string[];
}

/**
 * Not found error
 */
export interface NotFoundError extends AppError {
	code: 'NOT_FOUND';
	/** Resource type */
	resourceType?: string;
	/** Resource identifier */
	resourceId?: string | number;
}

/**
 * Rate limit error
 */
export interface RateLimitError extends AppError {
	code: 'RATE_LIMIT_EXCEEDED';
	/** Time until limit resets (in seconds or milliseconds) */
	retryAfter?: number;
	/** Maximum requests allowed */
	limit?: number;
}

/**
 * Error with retry information
 */
export interface RetryableError extends AppError {
	/** Whether the error is retryable */
	retryable: boolean;
	/** Maximum number of retry attempts */
	maxRetries?: number;
	/** Delay before retry (in milliseconds) */
	retryDelay?: number;
}

/**
 * Error boundary error
 */
export interface ErrorBoundaryError {
	/** The error that was caught */
	error: Error;
	/** Error information for error reporting */
	errorInfo?: {
		componentStack?: string;
	};
}

/**
 * Error handler function type
 */
export type ErrorHandler = (error: unknown, context?: Record<string, unknown>) => void;

/**
 * Error reporter interface
 */
export interface ErrorReporter {
	/** Report an error */
	report: (error: AppError | Error, context?: Record<string, unknown>) => void;
	/** Report a message */
	reportMessage: (
		message: string,
		level?: 'error' | 'warning' | 'info',
		context?: Record<string, unknown>
	) => void;
}

/**
 * Error type guard - checks if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'name' in error &&
		'message' in error &&
		error instanceof Error
	);
}

/**
 * Error type guard - checks if error is ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
	return isAppError(error) && error.code === 'VALIDATION_ERROR';
}

/**
 * Error type guard - checks if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
	return isAppError(error) && error.code === 'API_ERROR';
}

/**
 * Error type guard - checks if error is NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
	return isAppError(error) && error.code === 'NETWORK_ERROR';
}

/**
 * Error type guard - checks if error is AuthorizationError
 */
export function isAuthorizationError(error: unknown): error is AuthorizationError {
	return isAppError(error) && error.code === 'AUTHORIZATION_ERROR';
}

/**
 * Error type guard - checks if error is NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
	return isAppError(error) && error.code === 'NOT_FOUND';
}

/**
 * Error type guard - checks if error is RateLimitError
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
	return isAppError(error) && error.code === 'RATE_LIMIT_EXCEEDED';
}

/**
 * Error type guard - checks if error is RetryableError
 */
export function isRetryableError(error: unknown): error is RetryableError {
	return (
		isAppError(error) &&
		'retryable' in error &&
		typeof (error as RetryableError).retryable === 'boolean'
	);
}

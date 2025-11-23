import type { ApiErrorResponse } from '@src-types/api';
import {
	type ApiError,
	type AppError,
	type AuthorizationError,
	type ErrorHandler,
	type ErrorReporter,
	isApiError,
	isAppError,
	isAuthorizationError,
	isNetworkError,
	isNotFoundError,
	isRateLimitError,
	isRetryableError,
	isValidationError,
	type NetworkError,
	type NotFoundError,
	type RateLimitError,
	type RetryableError,
	type ValidationError,
} from '@src-types/errors';
import { describe, expect, it } from 'vitest';

// Constants for repeated literals
const ERROR_NAME_APP = 'AppError';
const ERROR_NAME_VALIDATION = 'ValidationError';
const ERROR_NAME_API = 'ApiError';
const ERROR_NAME_NETWORK = 'NetworkError';
const ERROR_NAME_AUTHORIZATION = 'AuthorizationError';
const ERROR_NAME_NOT_FOUND = 'NotFoundError';
const ERROR_NAME_RATE_LIMIT = 'RateLimitError';
const ERROR_NAME_RETRYABLE = 'RetryableError';

const ERROR_MESSAGE_TEST = 'Test error';
const ERROR_MESSAGE_VALIDATION_FAILED = 'Validation failed';
const ERROR_MESSAGE_API_REQUEST_FAILED = 'API request failed';
const ERROR_MESSAGE_NETWORK_TIMEOUT = 'Network timeout';
const ERROR_MESSAGE_NETWORK_UNAVAILABLE = 'Network unavailable';
const ERROR_MESSAGE_UNAUTHORIZED = 'Unauthorized';
const ERROR_MESSAGE_RESOURCE_NOT_FOUND = 'Resource not found';
const ERROR_MESSAGE_RATE_LIMIT_EXCEEDED = 'Rate limit exceeded';
const ERROR_MESSAGE_RETRYABLE = 'Retryable error';
const ERROR_MESSAGE_TEST_STRING = 'test';

const ERROR_CODE_TEST = 'TEST_ERROR';
const ERROR_CODE_VALIDATION = 'VALIDATION_ERROR';
const ERROR_CODE_API = 'API_ERROR';
const ERROR_CODE_NETWORK = 'NETWORK_ERROR';
const ERROR_CODE_AUTHORIZATION = 'AUTHORIZATION_ERROR';
const ERROR_CODE_NOT_FOUND = 'NOT_FOUND';
const ERROR_CODE_RATE_LIMIT = 'RATE_LIMIT_EXCEEDED';

describe('errors types', () => {
	describe('AppError', () => {
		it('should allow AppError with all and minimal properties', () => {
			const timestamp = new Date();
			const fullError: AppError = {
				name: ERROR_NAME_APP,
				message: ERROR_MESSAGE_TEST,
				code: ERROR_CODE_TEST,
				statusCode: 500,
				context: { key: 'value' },
				timestamp,
			};
			expect(fullError.name).toBe(ERROR_NAME_APP);
			expect(fullError.message).toBe(ERROR_MESSAGE_TEST);
			expect(fullError.code).toBe(ERROR_CODE_TEST);
			expect(fullError.statusCode).toBe(500);
			expect(fullError.context).toEqual({ key: 'value' });
			expect(fullError.timestamp).toBe(timestamp);

			const minimalError: AppError = {
				name: ERROR_NAME_APP,
				message: ERROR_MESSAGE_TEST,
			};
			expect(minimalError.name).toBe(ERROR_NAME_APP);
			expect(minimalError.message).toBe(ERROR_MESSAGE_TEST);
		});
	});

	describe('ValidationError', () => {
		it('should allow ValidationError with and without field errors', () => {
			const errorWithFields: ValidationError = {
				name: ERROR_NAME_VALIDATION,
				message: ERROR_MESSAGE_VALIDATION_FAILED,
				code: ERROR_CODE_VALIDATION,
				errors: [
					{ field: 'email', message: 'Invalid email', code: 'INVALID_EMAIL' },
					{ field: 'password', message: 'Password too short' },
				],
			};
			expect(errorWithFields.name).toBe(ERROR_NAME_VALIDATION);
			expect(errorWithFields.message).toBe(ERROR_MESSAGE_VALIDATION_FAILED);
			expect(errorWithFields.code).toBe(ERROR_CODE_VALIDATION);
			expect(errorWithFields.errors).toHaveLength(2);

			const errorWithoutFields: ValidationError = {
				name: ERROR_NAME_VALIDATION,
				message: ERROR_MESSAGE_VALIDATION_FAILED,
				code: ERROR_CODE_VALIDATION,
			};
			expect(errorWithoutFields.name).toBe(ERROR_NAME_VALIDATION);
			expect(errorWithoutFields.message).toBe(ERROR_MESSAGE_VALIDATION_FAILED);
			expect(errorWithoutFields.code).toBe(ERROR_CODE_VALIDATION);
		});
	});

	describe('specialized error types', () => {
		it('should allow ApiError with API details', () => {
			const apiErrorResponse: ApiErrorResponse = { message: 'API error', errors: [] };
			const requestContext = {
				url: 'https://api.example.com/test',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			};
			const error: ApiError = {
				name: ERROR_NAME_API,
				message: ERROR_MESSAGE_API_REQUEST_FAILED,
				code: ERROR_CODE_API,
				statusCode: 400,
				apiError: apiErrorResponse,
				requestContext,
			};
			expect(error.name).toBe(ERROR_NAME_API);
			expect(error.message).toBe(ERROR_MESSAGE_API_REQUEST_FAILED);
			expect(error.code).toBe(ERROR_CODE_API);
			expect(error.statusCode).toBe(400);
			expect(error.apiError).toBe(apiErrorResponse);
			expect(error.requestContext).toBe(requestContext);
		});

		it('should allow NetworkError with timeout and offline flags', () => {
			const timeoutError: NetworkError = {
				name: ERROR_NAME_NETWORK,
				message: ERROR_MESSAGE_NETWORK_TIMEOUT,
				code: ERROR_CODE_NETWORK,
				isTimeout: true,
			};
			expect(timeoutError.name).toBe(ERROR_NAME_NETWORK);
			expect(timeoutError.message).toBe(ERROR_MESSAGE_NETWORK_TIMEOUT);
			expect(timeoutError.code).toBe(ERROR_CODE_NETWORK);
			expect(timeoutError.isTimeout).toBe(true);

			const offlineError: NetworkError = {
				name: ERROR_NAME_NETWORK,
				message: ERROR_MESSAGE_NETWORK_UNAVAILABLE,
				code: ERROR_CODE_NETWORK,
				isOffline: true,
			};
			expect(offlineError.name).toBe(ERROR_NAME_NETWORK);
			expect(offlineError.message).toBe(ERROR_MESSAGE_NETWORK_UNAVAILABLE);
			expect(offlineError.code).toBe(ERROR_CODE_NETWORK);
			expect(offlineError.isOffline).toBe(true);
		});

		it('should allow AuthorizationError, NotFoundError, RateLimitError, and RetryableError', () => {
			const authError: AuthorizationError = {
				name: ERROR_NAME_AUTHORIZATION,
				message: ERROR_MESSAGE_UNAUTHORIZED,
				code: ERROR_CODE_AUTHORIZATION,
				required: ['admin', 'write'],
				actual: ['read'],
			};
			expect(authError.name).toBe(ERROR_NAME_AUTHORIZATION);
			expect(authError.message).toBe(ERROR_MESSAGE_UNAUTHORIZED);
			expect(authError.code).toBe(ERROR_CODE_AUTHORIZATION);
			expect(authError.required).toEqual(['admin', 'write']);
			expect(authError.actual).toEqual(['read']);

			const notFoundError: NotFoundError = {
				name: ERROR_NAME_NOT_FOUND,
				message: ERROR_MESSAGE_RESOURCE_NOT_FOUND,
				code: ERROR_CODE_NOT_FOUND,
				resourceType: 'User',
				resourceId: '123',
			};
			expect(notFoundError.name).toBe(ERROR_NAME_NOT_FOUND);
			expect(notFoundError.message).toBe(ERROR_MESSAGE_RESOURCE_NOT_FOUND);
			expect(notFoundError.code).toBe(ERROR_CODE_NOT_FOUND);
			expect(notFoundError.resourceType).toBe('User');
			expect(notFoundError.resourceId).toBe('123');

			const rateLimitError: RateLimitError = {
				name: ERROR_NAME_RATE_LIMIT,
				message: ERROR_MESSAGE_RATE_LIMIT_EXCEEDED,
				code: ERROR_CODE_RATE_LIMIT,
				retryAfter: 60,
				limit: 100,
			};
			expect(rateLimitError.name).toBe(ERROR_NAME_RATE_LIMIT);
			expect(rateLimitError.message).toBe(ERROR_MESSAGE_RATE_LIMIT_EXCEEDED);
			expect(rateLimitError.code).toBe(ERROR_CODE_RATE_LIMIT);
			expect(rateLimitError.retryAfter).toBe(60);
			expect(rateLimitError.limit).toBe(100);

			const retryableError: RetryableError = {
				name: ERROR_NAME_RETRYABLE,
				message: ERROR_MESSAGE_RETRYABLE,
				retryable: true,
				maxRetries: 3,
				retryDelay: 1000,
			};
			expect(retryableError.name).toBe(ERROR_NAME_RETRYABLE);
			expect(retryableError.message).toBe(ERROR_MESSAGE_RETRYABLE);
			expect(retryableError.retryable).toBe(true);
			expect(retryableError.maxRetries).toBe(3);
			expect(retryableError.retryDelay).toBe(1000);
		});
	});

	describe('ErrorHandler', () => {
		it('should accept error handler with and without context', () => {
			const handlerWithContext: ErrorHandler = (error, context) => {
				expect(error).toBeDefined();
				expect(context).toBeDefined();
			};
			const handlerWithoutContext: ErrorHandler = error => {
				expect(error).toBeDefined();
			};
			handlerWithContext(new Error(ERROR_MESSAGE_TEST_STRING), { key: 'value' });
			handlerWithoutContext(new Error(ERROR_MESSAGE_TEST_STRING));
		});
	});

	describe('ErrorReporter', () => {
		it('should accept error reporter interface', () => {
			const reporter: ErrorReporter = {
				report: (error, context) => {
					expect(error).toBeDefined();
					expect(context).toBeDefined();
				},
				reportMessage: (message, level, context) => {
					expect(message).toBeDefined();
					expect(level).toBeDefined();
					expect(context).toBeDefined();
				},
			};
			reporter.report(new Error(ERROR_MESSAGE_TEST_STRING), { key: 'value' });
			reporter.reportMessage('test message', 'error', { key: 'value' });
		});
	});

	describe('isAppError', () => {
		it('should return true for Error instance', () => {
			expect(isAppError(new Error(ERROR_MESSAGE_TEST_STRING))).toBe(true);
		});

		it('should return false for non-Error values', () => {
			expect(isAppError({ message: ERROR_MESSAGE_TEST_STRING })).toBe(false);
			expect(isAppError(null)).toBe(false);
			expect(isAppError('error')).toBe(false);
		});
	});

	describe('type guards', () => {
		it('should correctly identify all error types', () => {
			const testError = new Error(ERROR_MESSAGE_TEST_STRING);
			const validationError = Object.assign(new Error(ERROR_MESSAGE_VALIDATION_FAILED), {
				name: ERROR_NAME_VALIDATION,
				code: ERROR_CODE_VALIDATION,
			}) as ValidationError;
			expect(isValidationError(validationError)).toBe(true);
			expect(isValidationError(testError)).toBe(false);

			const apiError = Object.assign(new Error('API error'), {
				name: ERROR_NAME_API,
				code: ERROR_CODE_API,
				statusCode: 400,
			}) as ApiError;
			expect(isApiError(apiError)).toBe(true);
			expect(isApiError(testError)).toBe(false);

			const networkError = Object.assign(new Error('Network error'), {
				name: ERROR_NAME_NETWORK,
				code: ERROR_CODE_NETWORK,
			}) as NetworkError;
			expect(isNetworkError(networkError)).toBe(true);
			expect(isNetworkError(testError)).toBe(false);

			const authError = Object.assign(new Error(ERROR_MESSAGE_UNAUTHORIZED), {
				name: ERROR_NAME_AUTHORIZATION,
				code: ERROR_CODE_AUTHORIZATION,
			}) as AuthorizationError;
			expect(isAuthorizationError(authError)).toBe(true);
			expect(isAuthorizationError(testError)).toBe(false);

			const notFoundError = Object.assign(new Error('Not found'), {
				name: ERROR_NAME_NOT_FOUND,
				code: ERROR_CODE_NOT_FOUND,
			}) as NotFoundError;
			expect(isNotFoundError(notFoundError)).toBe(true);
			expect(isNotFoundError(testError)).toBe(false);

			const rateLimitError = Object.assign(new Error(ERROR_MESSAGE_RATE_LIMIT_EXCEEDED), {
				name: ERROR_NAME_RATE_LIMIT,
				code: ERROR_CODE_RATE_LIMIT,
			}) as RateLimitError;
			expect(isRateLimitError(rateLimitError)).toBe(true);
			expect(isRateLimitError(testError)).toBe(false);

			const retryableError = Object.assign(new Error(ERROR_MESSAGE_RETRYABLE), {
				name: ERROR_NAME_RETRYABLE,
				retryable: true,
			}) as RetryableError;
			expect(isRetryableError(retryableError)).toBe(true);
			expect(isRetryableError(testError)).toBe(false);

			const appError = Object.assign(new Error(ERROR_MESSAGE_TEST), {
				name: ERROR_NAME_APP,
			}) as AppError;
			expect(isRetryableError(appError)).toBe(false);
		});
	});
});

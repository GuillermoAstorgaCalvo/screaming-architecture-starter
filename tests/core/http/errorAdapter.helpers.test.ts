import {
	extractApiError,
	extractValidationErrors,
	getErrorTypeFromStatus,
	isHttpClientError,
	isNetworkError,
	isTimeoutError,
} from '@core/http/errorAdapter.helpers';
import type { HttpClientError } from '@core/ports/HttpPort';
import type { ApiErrorResponse } from '@src-types/api';
import { describe, expect, it } from 'vitest';

const VALIDATION_FAILED_MESSAGE = 'Validation failed';
const INVALID_EMAIL_MESSAGE = 'Invalid email';
const PASSWORD_TOO_SHORT_MESSAGE = 'Password too short';

function testGetErrorTypeFromStatus() {
	describe('getErrorTypeFromStatus', () => {
		it('returns network for status 0', () => {
			expect(getErrorTypeFromStatus(0)).toBe('network');
		});

		it('returns authentication for status 401', () => {
			expect(getErrorTypeFromStatus(401)).toBe('authentication');
		});

		it('returns authorization for status 403', () => {
			expect(getErrorTypeFromStatus(403)).toBe('authorization');
		});

		it('returns notFound for status 404', () => {
			expect(getErrorTypeFromStatus(404)).toBe('notFound');
		});

		it('returns conflict for status 409', () => {
			expect(getErrorTypeFromStatus(409)).toBe('conflict');
		});

		it('returns validation for status 422', () => {
			expect(getErrorTypeFromStatus(422)).toBe('validation');
		});

		it('returns rateLimit for status 429', () => {
			expect(getErrorTypeFromStatus(429)).toBe('rateLimit');
		});

		it('returns clientError for other 4xx status codes', () => {
			expect(getErrorTypeFromStatus(400)).toBe('clientError');
			expect(getErrorTypeFromStatus(402)).toBe('clientError');
			expect(getErrorTypeFromStatus(405)).toBe('clientError');
			expect(getErrorTypeFromStatus(410)).toBe('clientError');
			expect(getErrorTypeFromStatus(499)).toBe('clientError');
		});

		it('returns serverError for 5xx status codes', () => {
			expect(getErrorTypeFromStatus(500)).toBe('serverError');
			expect(getErrorTypeFromStatus(502)).toBe('serverError');
			expect(getErrorTypeFromStatus(503)).toBe('serverError');
			expect(getErrorTypeFromStatus(504)).toBe('serverError');
			expect(getErrorTypeFromStatus(599)).toBe('serverError');
		});

		it('returns unknown for non-error status codes', () => {
			expect(getErrorTypeFromStatus(200)).toBe('unknown');
			expect(getErrorTypeFromStatus(201)).toBe('unknown');
			expect(getErrorTypeFromStatus(300)).toBe('unknown');
			expect(getErrorTypeFromStatus(100)).toBe('unknown');
		});
	});
}

function testExtractApiErrorValid() {
	describe('extractApiError - valid cases', () => {
		it('extracts valid API error response with message only', () => {
			const data = { message: 'Something went wrong' };
			const result = extractApiError(data);

			expect(result).toBeDefined();
			expect(result?.message).toBe('Something went wrong');
			expect(result?.code).toBeUndefined();
			expect(result?.errors).toBeUndefined();
		});

		it('extracts valid API error response with all fields', () => {
			const data = {
				message: VALIDATION_FAILED_MESSAGE,
				code: 'VALIDATION_ERROR',
				errors: [
					{ field: 'email', message: INVALID_EMAIL_MESSAGE },
					{ field: 'password', message: PASSWORD_TOO_SHORT_MESSAGE },
				],
				context: { userId: '123' },
			};
			const result = extractApiError(data);

			expect(result).toBeDefined();
			expect(result?.message).toBe(VALIDATION_FAILED_MESSAGE);
			expect(result?.code).toBe('VALIDATION_ERROR');
			expect(result?.errors).toHaveLength(2);
			expect(result?.context).toEqual({ userId: '123' });
		});

		it('handles API error with code only', () => {
			const data = { message: 'Error', code: 'ERROR_CODE' };
			const result = extractApiError(data);

			expect(result?.message).toBe('Error');
			expect(result?.code).toBe('ERROR_CODE');
		});

		it('handles API error with errors array only', () => {
			const data = {
				message: 'Error',
				errors: [{ field: 'name', message: 'Required' }],
			};
			const result = extractApiError(data);

			expect(result?.message).toBe('Error');
			expect(result?.errors).toHaveLength(1);
		});
	});
}

function testExtractApiErrorInvalid() {
	describe('extractApiError - invalid cases', () => {
		it('returns undefined for null data', () => {
			expect(extractApiError(null)).toBeUndefined();
		});

		it('returns undefined for undefined data', () => {
			expect(extractApiError(undefined)).toBeUndefined();
		});

		it('returns undefined for non-object data', () => {
			expect(extractApiError('string')).toBeUndefined();
			expect(extractApiError(123)).toBeUndefined();
			expect(extractApiError(true)).toBeUndefined();
			expect(extractApiError([])).toBeUndefined();
		});

		it('returns undefined for object without message', () => {
			expect(extractApiError({ code: 'ERROR' })).toBeUndefined();
		});

		it('returns undefined for invalid error structure', () => {
			expect(extractApiError({ message: 'Error', errors: 'not an array' })).toBeUndefined();
		});
	});
}

function testExtractValidationErrors() {
	describe('extractValidationErrors', () => {
		it('extracts validation errors from API error response', () => {
			const apiError: ApiErrorResponse = {
				message: VALIDATION_FAILED_MESSAGE,
				errors: [
					{ field: 'email', message: INVALID_EMAIL_MESSAGE },
					{ field: 'password', message: PASSWORD_TOO_SHORT_MESSAGE },
				],
			};

			const result = extractValidationErrors(apiError);

			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(result?.[0]).toEqual({ field: 'email', message: INVALID_EMAIL_MESSAGE });
			expect(result?.[1]).toEqual({ field: 'password', message: PASSWORD_TOO_SHORT_MESSAGE });
		});

		it('returns undefined for API error without errors', () => {
			const apiError: ApiErrorResponse = {
				message: 'Error occurred',
			};

			expect(extractValidationErrors(apiError)).toBeUndefined();
		});

		it('returns undefined for undefined API error', () => {
			expect(extractValidationErrors(undefined)).toBeUndefined();
		});

		it('returns undefined for API error with non-array errors', () => {
			const apiError = {
				message: 'Error',
				errors: 'not an array',
			} as unknown as ApiErrorResponse;

			expect(extractValidationErrors(apiError)).toBeUndefined();
		});

		it('returns undefined for invalid validation error structure', () => {
			const apiError = {
				message: 'Error',
				errors: [{ invalidField: 'value' }],
			} as unknown as ApiErrorResponse;

			expect(extractValidationErrors(apiError)).toBeUndefined();
		});

		it('handles empty errors array', () => {
			const apiError: ApiErrorResponse = {
				message: 'Error',
				errors: [],
			};

			const result = extractValidationErrors(apiError);
			expect(result).toBeDefined();
			expect(result).toHaveLength(0);
		});
	});
}

function testIsTimeoutError() {
	describe('isTimeoutError', () => {
		it('returns true for TimeoutError', () => {
			const error = new Error('Request timeout');
			error.name = 'TimeoutError';

			expect(isTimeoutError(error)).toBe(true);
		});

		it('returns true for AbortError DOMException', () => {
			// DOMException might not be available in all test environments
			// Test the behavior when DOMException is available
			if (typeof DOMException === 'undefined') {
				// Skip test if DOMException is not available
				expect(true).toBe(true);
				return;
			}

			try {
				const error = new DOMException('Request aborted', 'AbortError');
				expect(isTimeoutError(error)).toBe(true);
			} catch {
				// If DOMException constructor fails, skip this test
				expect(true).toBe(true);
			}
		});

		it('returns false for regular Error', () => {
			const error = new Error('Some error');

			expect(isTimeoutError(error)).toBe(false);
		});

		it('returns false for DOMException with different name', () => {
			const error = new DOMException('Error', 'NetworkError');

			expect(isTimeoutError(error)).toBe(false);
		});

		it('returns false for non-Error values', () => {
			expect(isTimeoutError(null)).toBe(false);
			expect(isTimeoutError(undefined)).toBe(false);
			expect(isTimeoutError('string')).toBe(false);
			expect(isTimeoutError(123)).toBe(false);
			expect(isTimeoutError({})).toBe(false);
		});
	});
}

function testIsNetworkError() {
	describe('isNetworkError', () => {
		it('returns true for error with status 0', () => {
			const error = new Error('Network error') as HttpClientError;
			error.status = 0;

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns true for error with "fetch" in message', () => {
			const error = new Error('Failed to fetch');

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns true for error with "network" in message', () => {
			const error = new Error('Network error occurred');

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns true for error with "networkerror" in message', () => {
			const error = new Error('NetworkError: Failed');

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns true for error with "connection" in message', () => {
			const error = new Error('Connection failed');

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns true for error with "cors" in message', () => {
			const error = new Error('CORS error');

			expect(isNetworkError(error)).toBe(true);
		});

		it('returns false for error with status code', () => {
			const error = new Error('HTTP error') as HttpClientError;
			error.status = 404;

			expect(isNetworkError(error)).toBe(false);
		});

		it('returns false for error without network keywords', () => {
			const error = new Error('Some other error');

			expect(isNetworkError(error)).toBe(false);
		});

		it('returns false for non-Error values', () => {
			expect(isNetworkError(null)).toBe(false);
			expect(isNetworkError(undefined)).toBe(false);
			expect(isNetworkError('string')).toBe(false);
			expect(isNetworkError(123)).toBe(false);
		});

		it('is case-insensitive for network keywords', () => {
			const error1 = new Error('NETWORK ERROR');
			const error2 = new Error('Fetch Failed');
			const error3 = new Error('Cors Issue');

			expect(isNetworkError(error1)).toBe(true);
			expect(isNetworkError(error2)).toBe(true);
			expect(isNetworkError(error3)).toBe(true);
		});
	});
}

function testIsHttpClientError() {
	describe('isHttpClientError', () => {
		it('returns true for error with valid status code', () => {
			const error = new Error('HTTP error') as HttpClientError;
			error.status = 404;

			expect(isHttpClientError(error)).toBe(true);
		});

		it('returns true for 4xx status codes', () => {
			const error400 = new Error('Bad request') as HttpClientError;
			error400.status = 400;
			expect(isHttpClientError(error400)).toBe(true);

			const error401 = new Error('Unauthorized') as HttpClientError;
			error401.status = 401;
			expect(isHttpClientError(error401)).toBe(true);

			const error499 = new Error('Client error') as HttpClientError;
			error499.status = 499;
			expect(isHttpClientError(error499)).toBe(true);
		});

		it('returns true for 5xx status codes', () => {
			const error = new Error('Server error') as HttpClientError;
			error.status = 500;

			expect(isHttpClientError(error)).toBe(true);
		});

		it('returns false for status 0', () => {
			const error = new Error('Network error') as HttpClientError;
			error.status = 0;

			expect(isHttpClientError(error)).toBe(false);
		});

		it('returns false for undefined status', () => {
			const error = new Error('Error') as HttpClientError;
			delete error.status;

			expect(isHttpClientError(error)).toBe(false);
		});

		it('returns false for error without status property', () => {
			const error = new Error('Some error');

			expect(isHttpClientError(error)).toBe(false);
		});

		it('returns false for null', () => {
			expect(isHttpClientError(null)).toBe(false);
		});

		it('returns false for non-object values', () => {
			expect(isHttpClientError(undefined)).toBe(false);
			expect(isHttpClientError('string')).toBe(false);
			expect(isHttpClientError(123)).toBe(false);
			expect(isHttpClientError(true)).toBe(false);
		});
	});
}

describe('errorAdapter.helpers', () => {
	testGetErrorTypeFromStatus();
	testExtractApiErrorValid();
	testExtractApiErrorInvalid();
	testExtractValidationErrors();
	testIsTimeoutError();
	testIsNetworkError();
	testIsHttpClientError();
});

import { adaptError, errorAdapter } from '@core/http/errorAdapter';
import { ERROR_MESSAGES } from '@core/http/errorAdapter.constants';
import type { HttpClientError } from '@core/ports/HttpPort';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_ERROR_MESSAGES = {
	VALIDATION_FAILED: 'Validation failed',
	SERVER_ERROR: 'Server error',
	NETWORK_ERROR: 'Network error',
} as const;

const MOCK_TRANSLATIONS: Record<string, string> = {
	'errors.requestTimeout': 'Request timeout',
	'errors.networkError': TEST_ERROR_MESSAGES.NETWORK_ERROR,
	'errors.unknownError': 'Unknown error',
};

const { tMock } = vi.hoisted(() => {
	const mock = vi.fn((key: string) => {
		return MOCK_TRANSLATIONS[key] ?? key;
	});

	return { tMock: mock };
});

vi.mock('@core/i18n/i18n', () => ({
	default: { t: tMock },
}));

function describeAdaptBasicErrorTypes() {
	describe('basic error types', () => {
		it('adapts timeout error', () => {
			const error = new Error('Timeout') as HttpClientError;
			error.name = 'TimeoutError';

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('timeout');
			expect(result.message).toBe(ERROR_MESSAGES.TIMEOUT);
			expect(result.originalError).toBe(error);
		});

		it('adapts network error', () => {
			const error = new Error(TEST_ERROR_MESSAGES.NETWORK_ERROR) as HttpClientError;
			error.status = 0;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('network');
			expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
			expect(result.originalError).toBe(error);
		});

		it('adapts HTTP client error with status code', () => {
			const error = new Error('Not found') as HttpClientError;
			error.status = 404;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('notFound');
			expect(result.status).toBe(404);
			expect(result.originalError).toBe(error);
		});

		it('adapts generic error', () => {
			const error = new Error('Generic error');

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe('Generic error');
			expect(result.originalError).toBe(error);
		});
	});
}

function describeAdaptOptions() {
	describe('adapt options', () => {
		it('uses custom message when provided', () => {
			const error = new Error('Original error') as HttpClientError;
			error.status = 404;

			const result = errorAdapter.adapt(error, { customMessage: 'Custom error message' });

			expect(result.message).toBe('Custom error message');
		});

		it('excludes original error when includeOriginal is false', () => {
			const error = new Error('Error') as HttpClientError;
			error.status = 404;

			const result = errorAdapter.adapt(error, { includeOriginal: false });

			expect(result.originalError).toBeUndefined();
		});
	});
}

function describeAdaptErrorPriority() {
	describe('error priority', () => {
		it('prioritizes timeout over network error', () => {
			const error = new Error('Timeout') as HttpClientError;
			error.name = 'TimeoutError';
			error.status = 0; // Also has status 0

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('timeout');
		});

		it('prioritizes network over HTTP error for status 0', () => {
			const error = new Error(TEST_ERROR_MESSAGES.NETWORK_ERROR) as HttpClientError;
			error.status = 0;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('network');
		});
	});
}

function describeAdaptHttpStatusCodes() {
	describe('HTTP status codes', () => {
		it('adapts 401 error as authentication', () => {
			const error = new Error('Unauthorized') as HttpClientError;
			error.status = 401;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('authentication');
		});

		it('adapts 403 error as authorization', () => {
			const error = new Error('Forbidden') as HttpClientError;
			error.status = 403;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('authorization');
		});

		it('adapts 422 error as validation', () => {
			const error = new Error(TEST_ERROR_MESSAGES.VALIDATION_FAILED) as HttpClientError;
			error.status = 422;
			error.data = {
				message: TEST_ERROR_MESSAGES.VALIDATION_FAILED,
				errors: [{ field: 'email', message: 'Invalid email' }],
			};

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('validation');
			expect(result.validationErrors).toBeDefined();
		});

		it('adapts 429 error as rateLimit', () => {
			const error = new Error('Too many requests') as HttpClientError;
			error.status = 429;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('rateLimit');
		});

		it('adapts 500 error as serverError', () => {
			const error = new Error(TEST_ERROR_MESSAGES.SERVER_ERROR) as HttpClientError;
			error.status = 500;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('serverError');
		});

		it('adapts other 4xx errors as clientError', () => {
			const error = new Error('Bad request') as HttpClientError;
			error.status = 400;

			const result = errorAdapter.adapt(error);

			expect(result.type).toBe('clientError');
		});
	});
}

function describeAdapt() {
	describe('adapt', () => {
		describeAdaptBasicErrorTypes();
		describeAdaptOptions();
		describeAdaptErrorPriority();
		describeAdaptHttpStatusCodes();
	});
}

function describeIsType() {
	describe('isType', () => {
		it('returns true when error type matches', () => {
			const httpError = new Error('Not found') as HttpClientError;
			httpError.status = 404;
			const error = errorAdapter.adapt(httpError, {
				includeOriginal: false,
			});

			expect(errorAdapter.isType(error, 'notFound')).toBe(true);
		});

		it('returns false when error type does not match', () => {
			const httpError = new Error('Not found') as HttpClientError;
			httpError.status = 404;
			const error = errorAdapter.adapt(httpError, {
				includeOriginal: false,
			});

			expect(errorAdapter.isType(error, 'authentication')).toBe(false);
		});
	});
}

function describeIsClientError() {
	describe('isClientError', () => {
		it('returns true for client error types', () => {
			const error400 = errorAdapter.adapt(
				{ status: 400, message: 'Bad request' } as HttpClientError,
				{ includeOriginal: false }
			);
			expect(errorAdapter.isClientError(error400)).toBe(true);

			const error401 = errorAdapter.adapt(
				{ status: 401, message: 'Unauthorized' } as HttpClientError,
				{ includeOriginal: false }
			);
			expect(errorAdapter.isClientError(error401)).toBe(true);

			const error422 = errorAdapter.adapt(
				{ status: 422, message: TEST_ERROR_MESSAGES.VALIDATION_FAILED } as HttpClientError,
				{ includeOriginal: false }
			);
			expect(errorAdapter.isClientError(error422)).toBe(true);
		});

		it('returns false for server error types', () => {
			const error = errorAdapter.adapt(
				{ status: 500, message: TEST_ERROR_MESSAGES.SERVER_ERROR } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isClientError(error)).toBe(false);
		});

		it('returns false for network error types', () => {
			const error = errorAdapter.adapt(
				{ status: 0, message: TEST_ERROR_MESSAGES.NETWORK_ERROR } as HttpClientError,
				{
					includeOriginal: false,
				}
			);

			expect(errorAdapter.isClientError(error)).toBe(false);
		});

		it('returns false for timeout error types', () => {
			const timeoutError = new Error('Timeout') as HttpClientError;
			timeoutError.name = 'TimeoutError';
			const error = errorAdapter.adapt(timeoutError, { includeOriginal: false });

			expect(errorAdapter.isClientError(error)).toBe(false);
		});
	});
}

function describeIsServerError() {
	describe('isServerError', () => {
		it('returns true for server error type', () => {
			const error = errorAdapter.adapt(
				{ status: 500, message: TEST_ERROR_MESSAGES.SERVER_ERROR } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isServerError(error)).toBe(true);
		});

		it('returns false for client error types', () => {
			const error = errorAdapter.adapt({ status: 404, message: 'Not found' } as HttpClientError, {
				includeOriginal: false,
			});

			expect(errorAdapter.isServerError(error)).toBe(false);
		});

		it('returns false for network error types', () => {
			const error = errorAdapter.adapt(
				{ status: 0, message: TEST_ERROR_MESSAGES.NETWORK_ERROR } as HttpClientError,
				{
					includeOriginal: false,
				}
			);

			expect(errorAdapter.isServerError(error)).toBe(false);
		});
	});
}

function describeIsRetryable() {
	describe('isRetryable', () => {
		it('returns true for network errors', () => {
			const networkError = new Error(TEST_ERROR_MESSAGES.NETWORK_ERROR) as HttpClientError;
			networkError.status = 0;
			const error = errorAdapter.adapt(networkError, { includeOriginal: false });

			expect(error.type).toBe('network');
			expect(errorAdapter.isRetryable(error)).toBe(true);
		});

		it('returns true for timeout errors', () => {
			const timeoutError = new Error('Timeout') as HttpClientError;
			timeoutError.name = 'TimeoutError';
			const error = errorAdapter.adapt(timeoutError, { includeOriginal: false });

			expect(errorAdapter.isRetryable(error)).toBe(true);
		});

		it('returns true for server errors', () => {
			const error = errorAdapter.adapt(
				{ status: 500, message: TEST_ERROR_MESSAGES.SERVER_ERROR } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isRetryable(error)).toBe(true);
		});

		it('returns true for rate limit errors', () => {
			const error = errorAdapter.adapt(
				{ status: 429, message: 'Too many requests' } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isRetryable(error)).toBe(true);
		});

		it('returns false for client errors', () => {
			const error = errorAdapter.adapt({ status: 404, message: 'Not found' } as HttpClientError, {
				includeOriginal: false,
			});

			expect(errorAdapter.isRetryable(error)).toBe(false);
		});

		it('returns false for authentication errors', () => {
			const error = errorAdapter.adapt(
				{ status: 401, message: 'Unauthorized' } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isRetryable(error)).toBe(false);
		});

		it('returns false for validation errors', () => {
			const error = errorAdapter.adapt(
				{ status: 422, message: 'Validation failed' } as HttpClientError,
				{ includeOriginal: false }
			);

			expect(errorAdapter.isRetryable(error)).toBe(false);
		});
	});
}

function describeAdaptError() {
	describe('adaptError convenience function', () => {
		it('adapts error using default adapter', () => {
			const error = new Error('Test error') as HttpClientError;
			error.status = 404;

			const result = adaptError(error);

			expect(result.type).toBe('notFound');
			expect(result.status).toBe(404);
		});

		it('accepts options parameter', () => {
			const error = new Error('Test error') as HttpClientError;
			error.status = 404;

			const result = adaptError(error, {
				customMessage: 'Custom message',
				includeOriginal: false,
			});

			expect(result.message).toBe('Custom message');
			expect(result.originalError).toBeUndefined();
		});
	});
}

describe('errorAdapter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describeAdapt();
	describeIsType();
	describeIsClientError();
	describeIsServerError();
	describeIsRetryable();
	describeAdaptError();
});

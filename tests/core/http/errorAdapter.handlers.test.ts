import { ERROR_MESSAGES } from '@core/http/errorAdapter.constants';
import {
	createDomainError,
	getErrorMessage,
	handleGenericError,
	handleHttpError,
	handleNetworkError,
	handleTimeoutError,
} from '@core/http/errorAdapter.handlers';
import i18n from '@core/i18n/i18n';
import type { HttpClientError } from '@core/ports/HttpPort';
import type { ApiErrorResponse } from '@src-types/api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ERROR_KEYS = {
	REQUEST_TIMEOUT: 'errors.requestTimeout',
	NETWORK_ERROR: 'errors.networkError',
	UNKNOWN_ERROR: 'errors.unknownError',
	REQUEST_FAILED: 'errors.requestFailed',
} as const;

const TRANSLATIONS = {
	REQUEST_TIMEOUT: 'Request timeout',
	NETWORK_ERROR: 'Network error',
	UNKNOWN_ERROR: 'Unknown error',
	REQUEST_FAILED: 'Request failed',
} as const;

const TEST_MESSAGES = {
	HTTP_ERROR: 'HTTP error',
	CUSTOM_ERROR_MESSAGE: 'Custom error message',
	CUSTOM_MESSAGE: 'Custom message',
	ORIGINAL_ERROR: 'Original error',
	ORIGINAL_ERROR_MESSAGE: 'Original error message',
	API_ERROR_MESSAGE: 'API error message',
	VALIDATION_FAILED: 'Validation failed',
	TIMEOUT: 'Timeout',
	CUSTOM_TIMEOUT_MESSAGE: 'Custom timeout message',
	CUSTOM_NETWORK_MESSAGE: 'Custom network message',
	NOT_FOUND: 'Not found',
	NOT_FOUND_STATUS_TEXT: 'Not Found',
	ERROR_OCCURRED: 'Error occurred',
	GENERIC_ERROR: 'Generic error',
	STRING_ERROR: 'String error',
	CLIENT_ERROR: 'Client error',
	TIMEOUT_ERROR_NAME: 'TimeoutError',
} as const;

const TEST_DESCRIPTIONS = {
	EXCLUDES_ORIGINAL_ERROR: 'excludes original error when includeOriginal is false',
} as const;

const { tMock } = vi.hoisted(() => {
	const mock = vi.fn((key: string) => {
		const translations: Record<string, string> = {
			[ERROR_KEYS.REQUEST_TIMEOUT]: TRANSLATIONS.REQUEST_TIMEOUT,
			[ERROR_KEYS.NETWORK_ERROR]: TRANSLATIONS.NETWORK_ERROR,
			[ERROR_KEYS.UNKNOWN_ERROR]: TRANSLATIONS.UNKNOWN_ERROR,
			[ERROR_KEYS.REQUEST_FAILED]: TRANSLATIONS.REQUEST_FAILED,
		};
		return translations[key] ?? key;
	});

	return { tMock: mock };
});

vi.mock('@core/i18n/i18n', () => ({
	default: { t: tMock },
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe('errorAdapter.handlers - getErrorMessage', () => {
	describe('message priority', () => {
		it('returns custom message when provided', () => {
			const error = new Error(TEST_MESSAGES.ORIGINAL_ERROR) as HttpClientError;
			error.status = 404;

			const message = getErrorMessage(error, undefined, TEST_MESSAGES.CUSTOM_ERROR_MESSAGE);

			expect(message).toBe(TEST_MESSAGES.CUSTOM_ERROR_MESSAGE);
		});

		it('returns API error message when available', () => {
			const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
			error.status = 400;
			const apiError: ApiErrorResponse = { message: TEST_MESSAGES.API_ERROR_MESSAGE };

			const message = getErrorMessage(error, apiError);

			expect(message).toBe(TEST_MESSAGES.API_ERROR_MESSAGE);
		});

		it('prioritizes custom message over API error message', () => {
			const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
			error.status = 400;
			const apiError: ApiErrorResponse = { message: TEST_MESSAGES.API_ERROR_MESSAGE };

			const message = getErrorMessage(error, apiError, TEST_MESSAGES.CUSTOM_MESSAGE);

			expect(message).toBe(TEST_MESSAGES.CUSTOM_MESSAGE);
		});
	});

	describe('fallback messages', () => {
		it('returns error message when no API error', () => {
			const error = new Error(TEST_MESSAGES.ORIGINAL_ERROR_MESSAGE) as HttpClientError;
			error.status = 404;

			const message = getErrorMessage(error, undefined);

			expect(message).toBe(TEST_MESSAGES.ORIGINAL_ERROR_MESSAGE);
		});

		it('returns formatted status message when error has status but no message', () => {
			const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
			error.status = 404;
			error.response = new Response(TEST_MESSAGES.NOT_FOUND_STATUS_TEXT, {
				status: 404,
				statusText: TEST_MESSAGES.NOT_FOUND_STATUS_TEXT,
			});

			const message = getErrorMessage(error, undefined);

			expect(message).toBe(TEST_MESSAGES.HTTP_ERROR);
		});

		it('returns translated default message when status text not available', () => {
			const error = { status: 500 } as HttpClientError;
			Object.setPrototypeOf(error, Error.prototype);

			const message = getErrorMessage(error, undefined);

			expect(message).toBe(`HTTP 500: ${TRANSLATIONS.REQUEST_FAILED}`);
			expect(i18n.t).toHaveBeenCalledWith(ERROR_KEYS.REQUEST_FAILED, { ns: 'common' });
		});

		it('returns unknown error message when no information available', () => {
			const error = new Error(TRANSLATIONS.UNKNOWN_ERROR) as HttpClientError;

			const message = getErrorMessage(error, undefined);

			expect(message).toBe(TRANSLATIONS.UNKNOWN_ERROR);
		});
	});
});

describe('errorAdapter.handlers - createDomainError', () => {
	it('creates domain error without original error', () => {
		const result = createDomainError('validation', TEST_MESSAGES.VALIDATION_FAILED);

		expect(result).toEqual({
			type: 'validation',
			message: TEST_MESSAGES.VALIDATION_FAILED,
		});
		expect(result.originalError).toBeUndefined();
	});

	it('creates domain error with original error', () => {
		const originalError = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
		originalError.status = 400;

		const result = createDomainError('clientError', TEST_MESSAGES.CLIENT_ERROR, originalError);

		expect(result).toEqual({
			type: 'clientError',
			message: TEST_MESSAGES.CLIENT_ERROR,
			originalError,
		});
	});
});

describe('errorAdapter.handlers - handleTimeoutError', () => {
	it('handles timeout error with default message', () => {
		const error = new Error(TEST_MESSAGES.TIMEOUT) as HttpClientError;
		error.name = TEST_MESSAGES.TIMEOUT_ERROR_NAME;

		const result = handleTimeoutError(error);

		expect(result.type).toBe('timeout');
		expect(result.message).toBe(ERROR_MESSAGES.TIMEOUT);
		expect(result.originalError).toBe(error);
	});

	it('handles timeout error with custom message', () => {
		const error = new Error(TEST_MESSAGES.TIMEOUT) as HttpClientError;
		error.name = TEST_MESSAGES.TIMEOUT_ERROR_NAME;

		const result = handleTimeoutError(error, TEST_MESSAGES.CUSTOM_TIMEOUT_MESSAGE);

		expect(result.type).toBe('timeout');
		expect(result.message).toBe(TEST_MESSAGES.CUSTOM_TIMEOUT_MESSAGE);
		expect(result.originalError).toBe(error);
	});

	it(TEST_DESCRIPTIONS.EXCLUDES_ORIGINAL_ERROR, () => {
		const error = new Error(TEST_MESSAGES.TIMEOUT) as HttpClientError;
		error.name = TEST_MESSAGES.TIMEOUT_ERROR_NAME;

		const result = handleTimeoutError(error, undefined, false);

		expect(result.type).toBe('timeout');
		expect(result.originalError).toBeUndefined();
	});
});

describe('errorAdapter.handlers - handleNetworkError', () => {
	it('handles network error with default message', () => {
		const error = new Error(TRANSLATIONS.NETWORK_ERROR) as HttpClientError;
		error.status = 0;

		const result = handleNetworkError(error);

		expect(result.type).toBe('network');
		expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
		expect(result.originalError).toBe(error);
	});

	it('handles network error with custom message', () => {
		const error = new Error(TRANSLATIONS.NETWORK_ERROR) as HttpClientError;
		error.status = 0;

		const result = handleNetworkError(error, TEST_MESSAGES.CUSTOM_NETWORK_MESSAGE);

		expect(result.type).toBe('network');
		expect(result.message).toBe(TEST_MESSAGES.CUSTOM_NETWORK_MESSAGE);
		expect(result.originalError).toBe(error);
	});

	it(TEST_DESCRIPTIONS.EXCLUDES_ORIGINAL_ERROR, () => {
		const error = new Error(TRANSLATIONS.NETWORK_ERROR) as HttpClientError;
		error.status = 0;

		const result = handleNetworkError(error, undefined, false);

		expect(result.type).toBe('network');
		expect(result.originalError).toBeUndefined();
	});
});

describe('errorAdapter.handlers - handleHttpError - basic error handling', () => {
	it('handles HTTP error with status code mapping', () => {
		const error = new Error(TEST_MESSAGES.NOT_FOUND) as HttpClientError;
		error.status = 404;
		error.response = new Response(TEST_MESSAGES.NOT_FOUND_STATUS_TEXT, { status: 404 });

		const result = handleHttpError(error);

		expect(result.type).toBe('notFound');
		expect(result.status).toBe(404);
		expect(result.message).toBe(TEST_MESSAGES.NOT_FOUND);
		expect(result.originalError).toBe(error);
	});

	it('handles HTTP error with API error response', () => {
		const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
		error.status = 422;
		error.data = {
			message: TEST_MESSAGES.VALIDATION_FAILED,
			errors: [
				{ field: 'email', message: 'Invalid email' },
				{ field: 'password', message: 'Password too short' },
			],
		};

		const result = handleHttpError(error);

		expect(result.type).toBe('validation');
		expect(result.status).toBe(422);
		expect(result.apiError).toBeDefined();
		expect(result.apiError?.message).toBe(TEST_MESSAGES.VALIDATION_FAILED);
		expect(result.validationErrors).toHaveLength(2);
	});

	it('handles HTTP error with custom message', () => {
		const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
		error.status = 400;

		const result = handleHttpError(error, TEST_MESSAGES.CUSTOM_ERROR_MESSAGE);

		expect(result.type).toBe('clientError');
		expect(result.message).toBe(TEST_MESSAGES.CUSTOM_ERROR_MESSAGE);
	});

	it('handles status 0 as network error', () => {
		const error = new Error(TRANSLATIONS.NETWORK_ERROR) as HttpClientError;
		error.status = 0;

		const result = handleHttpError(error);

		expect(result.type).toBe('network');
		expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
	});

	it(TEST_DESCRIPTIONS.EXCLUDES_ORIGINAL_ERROR, () => {
		const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
		error.status = 404;

		const result = handleHttpError(error, undefined, false);

		expect(result.type).toBe('notFound');
		expect(result.originalError).toBeUndefined();
	});
});

describe('errorAdapter.handlers - handleHttpError - status code mapping', () => {
	it('handles 401 as authentication error', () => {
		const error = new Error('Unauthorized') as HttpClientError;
		error.status = 401;

		const result = handleHttpError(error);

		expect(result.type).toBe('authentication');
		expect(result.status).toBe(401);
	});

	it('handles 403 as authorization error', () => {
		const error = new Error('Forbidden') as HttpClientError;
		error.status = 403;

		const result = handleHttpError(error);

		expect(result.type).toBe('authorization');
		expect(result.status).toBe(403);
	});

	it('handles 409 as conflict error', () => {
		const error = new Error('Conflict') as HttpClientError;
		error.status = 409;

		const result = handleHttpError(error);

		expect(result.type).toBe('conflict');
		expect(result.status).toBe(409);
	});

	it('handles 429 as rate limit error', () => {
		const error = new Error('Too many requests') as HttpClientError;
		error.status = 429;

		const result = handleHttpError(error);

		expect(result.type).toBe('rateLimit');
		expect(result.status).toBe(429);
	});

	it('handles 500 as server error', () => {
		const error = new Error('Server error') as HttpClientError;
		error.status = 500;

		const result = handleHttpError(error);

		expect(result.type).toBe('serverError');
		expect(result.status).toBe(500);
	});
});

describe('errorAdapter.handlers - handleHttpError - edge cases', () => {
	it('handles error with API error code', () => {
		const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;
		error.status = 400;
		error.data = {
			message: TEST_MESSAGES.ERROR_OCCURRED,
			code: 'ERROR_CODE_123',
		};

		const result = handleHttpError(error);

		expect(result.code).toBe('ERROR_CODE_123');
		expect(result.apiError?.code).toBe('ERROR_CODE_123');
	});

	it('handles error without status as unknown', () => {
		const error = new Error(TEST_MESSAGES.HTTP_ERROR) as HttpClientError;

		const result = handleHttpError(error);

		expect(result.type).toBe('unknown');
	});
});

describe('errorAdapter.handlers - handleGenericError', () => {
	describe('Error instances', () => {
		it('handles Error instance', () => {
			const error = new Error(TEST_MESSAGES.GENERIC_ERROR);

			const result = handleGenericError(error);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe(TEST_MESSAGES.GENERIC_ERROR);
			expect(result.originalError).toBe(error);
		});

		it('handles Error instance with custom message', () => {
			const error = new Error(TEST_MESSAGES.GENERIC_ERROR);

			const result = handleGenericError(error, TEST_MESSAGES.CUSTOM_MESSAGE);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe(TEST_MESSAGES.CUSTOM_MESSAGE);
		});

		it('uses default message when error has no message', () => {
			const error = new Error(TEST_MESSAGES.GENERIC_ERROR);

			const result = handleGenericError(error);

			expect(result.message).toBe(TEST_MESSAGES.GENERIC_ERROR);
		});

		it(TEST_DESCRIPTIONS.EXCLUDES_ORIGINAL_ERROR, () => {
			const error = new Error(TEST_MESSAGES.GENERIC_ERROR);

			const result = handleGenericError(error, undefined, false);

			expect(result.type).toBe('unknown');
			expect(result.originalError).toBeUndefined();
		});
	});

	describe('non-Error values', () => {
		it('handles non-Error values by converting to Error', () => {
			const result = handleGenericError(TEST_MESSAGES.STRING_ERROR);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe(TEST_MESSAGES.STRING_ERROR);
			expect(result.originalError).toBeDefined();
		});

		it('handles null by converting to Error', () => {
			const result = handleGenericError(null);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe('null');
			expect(result.originalError).toBeDefined();
		});

		it('handles undefined by converting to Error', () => {
			const result = handleGenericError(undefined);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe('undefined');
			expect(result.originalError).toBeDefined();
		});

		it('handles number by converting to Error', () => {
			const result = handleGenericError(123);

			expect(result.type).toBe('unknown');
			expect(result.message).toBe('123');
			expect(result.originalError).toBeDefined();
		});
	});
});

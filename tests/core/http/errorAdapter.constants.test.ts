import {
	CLIENT_ERROR_TYPES,
	ERROR_MESSAGES,
	HTTP_STATUS_CONFLICT,
	HTTP_STATUS_FORBIDDEN,
	HTTP_STATUS_NOT_FOUND,
	HTTP_STATUS_TOO_MANY_REQUESTS,
	HTTP_STATUS_UNAUTHORIZED,
	HTTP_STATUS_UNPROCESSABLE_ENTITY,
	RETRYABLE_ERROR_TYPES,
	STATUS_CODE_TO_ERROR_TYPE,
} from '@core/http/errorAdapter.constants';
import i18n from '@core/i18n/i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { tMock } = vi.hoisted(() => {
	const mock = vi.fn((key: string) => {
		const translations: Record<string, string> = {
			'errors.requestTimeout': 'Request timeout',
			'errors.networkError': 'Network error',
			'errors.unknownError': 'Unknown error',
		};
		return translations[key] ?? key;
	});

	return { tMock: mock };
});

vi.mock('@core/i18n/i18n', () => ({
	default: { t: tMock },
}));

describe('errorAdapter.constants - HTTP status code constants', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('defines HTTP_STATUS_UNAUTHORIZED as 401', () => {
		expect(HTTP_STATUS_UNAUTHORIZED).toBe(401);
	});

	it('defines HTTP_STATUS_FORBIDDEN as 403', () => {
		expect(HTTP_STATUS_FORBIDDEN).toBe(403);
	});

	it('defines HTTP_STATUS_NOT_FOUND as 404', () => {
		expect(HTTP_STATUS_NOT_FOUND).toBe(404);
	});

	it('defines HTTP_STATUS_CONFLICT as 409', () => {
		expect(HTTP_STATUS_CONFLICT).toBe(409);
	});

	it('defines HTTP_STATUS_TOO_MANY_REQUESTS as 429', () => {
		expect(HTTP_STATUS_TOO_MANY_REQUESTS).toBe(429);
	});

	it('defines HTTP_STATUS_UNPROCESSABLE_ENTITY as 422', () => {
		expect(HTTP_STATUS_UNPROCESSABLE_ENTITY).toBe(422);
	});
});

describe('errorAdapter.constants - STATUS_CODE_TO_ERROR_TYPE', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('maps 401 to authentication error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[401]).toBe('authentication');
	});

	it('maps 403 to authorization error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[403]).toBe('authorization');
	});

	it('maps 404 to notFound error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[404]).toBe('notFound');
	});

	it('maps 409 to conflict error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[409]).toBe('conflict');
	});

	it('maps 429 to rateLimit error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[429]).toBe('rateLimit');
	});

	it('maps 422 to validation error type', () => {
		expect(STATUS_CODE_TO_ERROR_TYPE[422]).toBe('validation');
	});

	it('contains all expected status code mappings', () => {
		const expectedMappings = {
			401: 'authentication',
			403: 'authorization',
			404: 'notFound',
			409: 'conflict',
			422: 'validation',
			429: 'rateLimit',
		};

		for (const [status, errorType] of Object.entries(expectedMappings)) {
			expect(STATUS_CODE_TO_ERROR_TYPE[Number(status)]).toBe(errorType);
		}
	});
});

describe('errorAdapter.constants - ERROR_MESSAGES', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('TIMEOUT returns translated timeout message', () => {
		const message = ERROR_MESSAGES.TIMEOUT;
		expect(message).toBe('Request timeout');
		expect(i18n.t).toHaveBeenCalledWith('errors.requestTimeout', { ns: 'common' });
	});

	it('NETWORK returns translated network error message', () => {
		const message = ERROR_MESSAGES.NETWORK;
		expect(message).toBe('Network error');
		expect(i18n.t).toHaveBeenCalledWith('errors.networkError', { ns: 'common' });
	});

	it('UNKNOWN returns translated unknown error message', () => {
		const message = ERROR_MESSAGES.UNKNOWN;
		expect(message).toBe('Unknown error');
		expect(i18n.t).toHaveBeenCalledWith('errors.unknownError', { ns: 'common' });
	});
});

describe('errorAdapter.constants - CLIENT_ERROR_TYPES', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('contains all expected client error types', () => {
		const expectedTypes = [
			'clientError',
			'validation',
			'authentication',
			'authorization',
			'notFound',
			'conflict',
			'rateLimit',
		];

		for (const type of expectedTypes) {
			expect(CLIENT_ERROR_TYPES).toContain(type);
		}
	});

	it('is a readonly array', () => {
		expect(CLIENT_ERROR_TYPES).toBeInstanceOf(Array);
		expect(CLIENT_ERROR_TYPES.length).toBeGreaterThan(0);
	});

	it('does not include server error types', () => {
		expect(CLIENT_ERROR_TYPES).not.toContain('serverError');
		expect(CLIENT_ERROR_TYPES).not.toContain('network');
		expect(CLIENT_ERROR_TYPES).not.toContain('timeout');
	});
});

describe('errorAdapter.constants - RETRYABLE_ERROR_TYPES', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('contains all expected retryable error types', () => {
		const expectedTypes = ['network', 'timeout', 'serverError', 'rateLimit'];

		for (const type of expectedTypes) {
			expect(RETRYABLE_ERROR_TYPES).toContain(type);
		}
	});

	it('is a readonly array', () => {
		expect(RETRYABLE_ERROR_TYPES).toBeInstanceOf(Array);
		expect(RETRYABLE_ERROR_TYPES.length).toBeGreaterThan(0);
	});

	it('includes network errors as retryable', () => {
		expect(RETRYABLE_ERROR_TYPES).toContain('network');
	});

	it('includes timeout errors as retryable', () => {
		expect(RETRYABLE_ERROR_TYPES).toContain('timeout');
	});

	it('includes server errors as retryable', () => {
		expect(RETRYABLE_ERROR_TYPES).toContain('serverError');
	});

	it('includes rate limit errors as retryable', () => {
		expect(RETRYABLE_ERROR_TYPES).toContain('rateLimit');
	});

	it('does not include client errors that are not retryable', () => {
		expect(RETRYABLE_ERROR_TYPES).not.toContain('authentication');
		expect(RETRYABLE_ERROR_TYPES).not.toContain('authorization');
		expect(RETRYABLE_ERROR_TYPES).not.toContain('notFound');
		expect(RETRYABLE_ERROR_TYPES).not.toContain('validation');
	});
});

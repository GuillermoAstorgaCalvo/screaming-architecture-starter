import {
	ApiResponseValidationError,
	createErrorContext,
	createMapperContext,
	createValidationDomainError,
	defaultResponseMapper,
	determineEnvelope,
	extractApiMeta,
	handleServiceError,
} from '@core/api/createApiService.helpers';
import type {
	ApiServiceConfig,
	ApiServiceErrorContext,
	ApiServiceExecuteOptions,
} from '@core/api/createApiService.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const TEST_ENDPOINT = '/api/test';
const MESSAGE_INVALID_VALUE = 'Invalid value';
const TIMESTAMP_TEST = '2024-01-01T00:00:00Z';

// Helper function for creating mock HTTP responses
function createMockHttpResponseForHelpers<T>(data: T): HttpClientResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

// Mock i18n to track calls and return translated values
const mockI18nT = vi.fn((key: string, _options?: { ns?: string }) => `translated:${key}`);

vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string, options?: { ns?: string }) => mockI18nT(key, options),
	},
}));

// Helper functions
function createTestConfig(defaultErrorMessage?: string): ApiServiceConfig<unknown> {
	return {
		endpoint: TEST_ENDPOINT,
		...(defaultErrorMessage ? { defaultErrorMessage } : {}),
	};
}

function createTestContext(errorMessage?: string): ApiServiceErrorContext<unknown> {
	return {
		request: {},
		...(errorMessage ? { options: { errorMessage } } : {}),
	};
}

function testTranslationScenario(
	translationKey: string,
	config: ApiServiceConfig<unknown>,
	context: ApiServiceErrorContext<unknown>
) {
	const error = new Error('Test error');
	const result = handleServiceError(error, config, context);

	expect(mockI18nT).toHaveBeenCalledWith(translationKey, { ns: 'common' });
	expect(result.message).toBe(`translated:${translationKey}`);
}

function testNonTranslationScenario(
	expectedMessage: string,
	config: ApiServiceConfig<unknown>,
	context: ApiServiceErrorContext<unknown>
) {
	const error = new Error('Test error');
	const result = handleServiceError(error, config, context);

	expect(mockI18nT).not.toHaveBeenCalled();
	expect(result.message).toBe(expectedMessage);
}

function createValidationError() {
	const schema = z.object({
		id: z.string(),
		name: z.string(),
	});

	const invalidData = { id: 123 };
	const parseResult = schema.safeParse(invalidData);

	if (!parseResult.success) {
		return ApiResponseValidationError.fromZodIssues(parseResult.error.issues);
	}
	throw new Error('Expected validation to fail');
}

// Test lines 191-197: Translation key detection and translation
describe('createApiService.helpers - extractCustomMessage translation key namespaces', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should translate error messages with "errors" namespace', () => {
		const config = createTestConfig('errors.something.went.wrong');
		const context = createTestContext();
		testTranslationScenario('errors.something.went.wrong', config, context);
	});

	it('should translate error messages with "a11y" namespace', () => {
		const config = createTestConfig('a11y.something');
		const context = createTestContext();
		testTranslationScenario('a11y.something', config, context);
	});

	it('should translate error messages with "common" namespace', () => {
		const config = createTestConfig('common.error');
		const context = createTestContext();
		testTranslationScenario('common.error', config, context);
	});

	it('should translate error messages with "app" namespace', () => {
		const config = createTestConfig('app.error.message');
		const context = createTestContext();
		testTranslationScenario('app.error.message', config, context);
	});

	it('should translate error messages with "nav" namespace', () => {
		const config = createTestConfig('nav.error');
		const context = createTestContext();
		testTranslationScenario('nav.error', config, context);
	});
});

describe('createApiService.helpers - extractCustomMessage translation key sources', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should translate error messages from options.errorMessage', () => {
		const config = createTestConfig();
		const context = createTestContext('errors.custom.error');
		testTranslationScenario('errors.custom.error', config, context);
	});

	it('should translate error messages for validation errors', () => {
		const config = createTestConfig('errors.validation.failed');
		const context = createTestContext();
		const validationError = createValidationError();
		const result = handleServiceError(validationError, config, context);

		expect(mockI18nT).toHaveBeenCalledWith('errors.validation.failed', {
			ns: 'common',
		});
		expect(result.message).toBe('translated:errors.validation.failed');
	});
});

describe('createApiService.helpers - extractCustomMessage non-translation scenarios', () => {
	beforeEach(() => {
		mockI18nT.mockClear();
	});

	it('should not translate single-part messages', () => {
		const config = createTestConfig('simple-error-message');
		const context = createTestContext();
		testNonTranslationScenario('simple-error-message', config, context);
	});

	it('should not translate unknown namespace messages', () => {
		const config = createTestConfig('unknown.namespace.error');
		const context = createTestContext();
		testNonTranslationScenario('unknown.namespace.error', config, context);
	});

	it('should not translate messages without dots', () => {
		const config = createTestConfig('Plain error message');
		const context = createTestContext();
		testNonTranslationScenario('Plain error message', config, context);
	});
});

describe('createApiService.helpers - normalizeIssuePath fallback case', () => {
	// Test line 208: Fallback case when segment is not string or number
	it('should convert Symbol paths to strings', () => {
		const symbolKey = Symbol('test-key');
		const zodIssue = {
			path: [symbolKey, 'field'],
			message: MESSAGE_INVALID_VALUE,
		};

		const error = ApiResponseValidationError.fromZodIssues([zodIssue]);

		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]?.path).toEqual([symbolKey.toString(), 'field']);
		expect(error.issues[0]?.message).toBe(MESSAGE_INVALID_VALUE);
	});

	it('should handle mixed path types including Symbols', () => {
		const symbolKey = Symbol('symbol-key');
		const zodIssue = {
			path: ['root', 0, symbolKey, 'nested'],
			message: 'Validation failed',
		};

		const error = ApiResponseValidationError.fromZodIssues([zodIssue]);

		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]?.path).toEqual(['root', 0, symbolKey.toString(), 'nested']);
	});

	it('should handle paths with only Symbol keys', () => {
		const symbolKey1 = Symbol('key1');
		const symbolKey2 = Symbol('key2');
		const zodIssue = {
			path: [symbolKey1, symbolKey2],
			message: 'Symbol path error',
		};

		const error = ApiResponseValidationError.fromZodIssues([zodIssue]);

		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]?.path).toEqual([symbolKey1.toString(), symbolKey2.toString()]);
	});

	it('should preserve string and number paths as-is', () => {
		const zodIssue = {
			path: ['root', 0, 'field', 1],
			message: 'Standard path',
		};

		const error = ApiResponseValidationError.fromZodIssues([zodIssue]);

		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]?.path).toEqual(['root', 0, 'field', 1]);
	});
});

describe('createApiService.helpers - createMapperContext', () => {
	it('should create context with request only when options are not provided', () => {
		const request = { id: '123' };
		const context = createMapperContext(request);

		expect(context).toEqual({ request });
		expect(context.options).toBeUndefined();
	});

	it('should create context with request and options when options are provided', () => {
		const request = { id: '123' };
		const options: ApiServiceExecuteOptions = {
			signal: new AbortController().signal,
		};
		const context = createMapperContext(request, options);

		expect(context).toEqual({ request, options });
	});
});

describe('createApiService.helpers - createErrorContext', () => {
	it('should create error context with request only when options are not provided', () => {
		const request = { id: '123' };
		const context = createErrorContext(request);

		expect(context).toEqual({ request });
		expect(context.options).toBeUndefined();
	});

	it('should create error context with request and options when options are provided', () => {
		const request = { id: '123' };
		const options: ApiServiceExecuteOptions = {
			errorMessage: 'Custom error',
		};
		const context = createErrorContext(request, options);

		expect(context).toEqual({ request, options });
	});
});

describe('createApiService.helpers - defaultResponseMapper', () => {
	it('should extract data from envelope when envelope exists', () => {
		const envelopeData = { id: '1', name: 'Test' };
		const context = {
			raw: { data: envelopeData },
			response: createMockHttpResponseForHelpers({ data: envelopeData }),
			envelope: { data: envelopeData },
		};

		const result = defaultResponseMapper(context);

		expect(result).toEqual(envelopeData);
	});

	it('should return raw data when envelope does not exist', () => {
		const rawData = { id: '1', name: 'Test' };
		const context = {
			raw: rawData,
			response: createMockHttpResponseForHelpers(rawData),
		};

		const result = defaultResponseMapper(context);

		expect(result).toEqual(rawData);
	});
});

describe('createApiService.helpers - determineEnvelope', () => {
	it('should return envelope when object has data property', () => {
		const value = { data: { id: '1' } };
		const result = determineEnvelope(value);

		expect(result).toEqual(value);
	});

	it('should return undefined when object does not have data property', () => {
		const value = { id: '1', name: 'Test' };
		const result = determineEnvelope(value);

		expect(result).toBeUndefined();
	});

	it('should return undefined when value is not a record', () => {
		expect(determineEnvelope('string')).toBeUndefined();
		expect(determineEnvelope(123)).toBeUndefined();
		expect(determineEnvelope(true)).toBeUndefined();
		expect(determineEnvelope(null)).toBeUndefined();
		expect(determineEnvelope(undefined)).toBeUndefined();
	});

	it('should return undefined when value is an array', () => {
		expect(determineEnvelope([1, 2, 3])).toBeUndefined();
	});
});

describe('createApiService.helpers - extractApiMeta', () => {
	it('should extract apiMeta with all fields', () => {
		const value = {
			apiMeta: {
				version: '1.0.0',
				requestId: 'req-123',
				timestamp: TIMESTAMP_TEST,
			},
		};

		const result = extractApiMeta(value);

		expect(result).toEqual({
			version: '1.0.0',
			requestId: 'req-123',
			timestamp: TIMESTAMP_TEST,
		});
	});

	it('should extract apiMeta with partial fields', () => {
		const value = {
			apiMeta: {
				version: '1.0.0',
			},
		};

		const result = extractApiMeta(value);

		expect(result).toEqual({
			version: '1.0.0',
		});
	});

	it('should return undefined when apiMeta is not a record', () => {
		expect(extractApiMeta({ apiMeta: 'string' })).toBeUndefined();
		expect(extractApiMeta({ apiMeta: 123 })).toBeUndefined();
		expect(extractApiMeta({ apiMeta: null })).toBeUndefined();
	});

	it('should return undefined when apiMeta does not exist', () => {
		expect(extractApiMeta({})).toBeUndefined();
		expect(extractApiMeta({ other: 'value' })).toBeUndefined();
	});

	it('should return undefined when value is not a record', () => {
		expect(extractApiMeta('string')).toBeUndefined();
		expect(extractApiMeta(123)).toBeUndefined();
		expect(extractApiMeta(null)).toBeUndefined();
	});

	it('should return undefined when apiMeta is empty object', () => {
		expect(extractApiMeta({ apiMeta: {} })).toBeUndefined();
	});

	it('should filter out non-string values from apiMeta', () => {
		const value = {
			apiMeta: {
				version: '1.0.0',
				requestId: 123, // should be filtered out
				timestamp: TIMESTAMP_TEST,
				invalid: true, // should be filtered out
			},
		};

		const result = extractApiMeta(value);

		expect(result).toEqual({
			version: '1.0.0',
			timestamp: TIMESTAMP_TEST,
		});
	});
});

describe('createApiService.helpers - createValidationDomainError', () => {
	it('should create validation domain error with default message', () => {
		const issues = [
			{ path: ['field1'], message: MESSAGE_INVALID_VALUE },
			{ path: ['field2', 'nested'], message: 'Required' },
		];

		const result = createValidationDomainError(issues);

		expect(result).toEqual({
			type: 'validation',
			message: 'The server returned data in an unexpected format.',
			validationErrors: [
				{ field: 'field1', message: MESSAGE_INVALID_VALUE },
				{ field: 'field2.nested', message: 'Required' },
			],
			code: 'INVALID_RESPONSE',
		});
	});

	it('should create validation domain error with custom message', () => {
		const issues = [{ path: ['field'], message: 'Invalid' }];

		const result = createValidationDomainError(issues, 'Custom error message');

		expect(result).toEqual({
			type: 'validation',
			message: 'Custom error message',
			validationErrors: [{ field: 'field', message: 'Invalid' }],
			code: 'INVALID_RESPONSE',
		});
	});

	it('should handle empty path as root', () => {
		const issues = [{ path: [], message: 'Root error' }];

		const result = createValidationDomainError(issues);

		expect(result.validationErrors).toEqual([{ field: 'root', message: 'Root error' }]);
	});

	it('should handle numeric paths', () => {
		const issues = [{ path: ['items', 0, 'name'], message: 'Invalid' }];

		const result = createValidationDomainError(issues);

		expect(result.validationErrors).toEqual([{ field: 'items.0.name', message: 'Invalid' }]);
	});
});

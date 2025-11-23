import {
	cleanupAbortController,
	handleFetchError,
	handleFetchSuccess,
	memoizeHttpConfig,
	performFetch,
	setupAbortController,
} from '@core/hooks/fetch/useFetch.helpers';
import type {
	ErrorContext,
	FetchContext,
	PerformFetchContext,
} from '@core/hooks/fetch/useFetch.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import type { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_URL = '/api/test';
const LOG_MESSAGE_SUCCESS = 'useFetch: Successfully fetched data';
const LOG_MESSAGE_ERROR = 'useFetch: Error fetching data';
const ERROR_NETWORK = 'Network error';
const ERROR_STRING = 'String error';
const ERROR_UNKNOWN = 'An unknown error occurred';

function createMockLogger(): MockLoggerAdapter {
	return {
		debug: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
	} as unknown as MockLoggerAdapter;
}

function createFetchContext<T>(
	setData: (data: T | null) => void,
	logger: MockLoggerAdapter
): FetchContext<T> {
	const controller = new AbortController();
	return {
		abortController: controller,
		setData,
		logger,
		url: TEST_URL,
	};
}

function createErrorContext(
	setError: (error: string | null) => void,
	logger: MockLoggerAdapter
): ErrorContext {
	const controller = new AbortController();
	return {
		abortController: controller,
		setError,
		logger,
		url: TEST_URL,
	};
}

function createPerformFetchContext(
	setLoading: (loading: boolean) => void,
	setError: (error: string | null) => void,
	setData: (data: string | null) => void,
	logger: MockLoggerAdapter,
	http: MockHttpAdapter
): PerformFetchContext<string> {
	const controller = new AbortController();
	return {
		url: TEST_URL,
		httpConfig: {},
		abortController: controller,
		setLoading,
		setError,
		setData,
		logger,
		http,
	};
}

function createSuccessResponse<T>(data: T): HttpClientResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

describe('setupAbortController', () => {
	it('should create a new AbortController when ref is null', () => {
		const ref = { current: null };
		const controller = setupAbortController(ref);

		expect(controller).toBeInstanceOf(AbortController);
		expect(ref.current).toBe(controller);
		expect(controller.signal.aborted).toBe(false);
	});

	it('should abort previous controller and create a new one', () => {
		const ref = { current: new AbortController() };
		const previousController = ref.current;

		const newController = setupAbortController(ref);

		expect(previousController.signal.aborted).toBe(true);
		expect(newController).toBeInstanceOf(AbortController);
		expect(ref.current).toBe(newController);
		expect(newController.signal.aborted).toBe(false);
	});

	it('should handle multiple sequential calls', () => {
		const ref = { current: null };
		const controller1 = setupAbortController(ref);
		const controller2 = setupAbortController(ref);
		const controller3 = setupAbortController(ref);

		expect(controller1.signal.aborted).toBe(true);
		expect(controller2.signal.aborted).toBe(true);
		expect(controller3.signal.aborted).toBe(false);
		expect(ref.current).toBe(controller3);
	});
});

describe('cleanupAbortController', () => {
	it('should abort and clear the controller', () => {
		const controller = new AbortController();
		const ref = { current: controller };

		cleanupAbortController(ref);

		expect(controller.signal.aborted).toBe(true);
		expect(ref.current).toBeNull();
	});

	it('should handle null ref gracefully', () => {
		const ref = { current: null };

		expect(() => cleanupAbortController(ref)).not.toThrow();
		expect(ref.current).toBeNull();
	});

	it('should handle already aborted controller', () => {
		const controller = new AbortController();
		controller.abort();
		const ref = { current: controller };

		cleanupAbortController(ref);

		expect(ref.current).toBeNull();
	});
});

describe('memoizeHttpConfig', () => {
	it('should serialize config to a key', () => {
		const config = { headers: { 'X-Custom': 'value' } };
		const [key, memoizedConfig] = memoizeHttpConfig(config);

		expect(typeof key).toBe('string');
		expect(key.length).toBeGreaterThan(0);
		expect(memoizedConfig).toBe(config);
	});

	it('should return same key for same config', () => {
		const config = { headers: { 'X-Custom': 'value' } };
		const [key1] = memoizeHttpConfig(config);
		const [key2] = memoizeHttpConfig(config);

		expect(key1).toBe(key2);
	});

	it('should return different keys for different configs', () => {
		const config1 = { headers: { 'X-Custom': 'value1' } };
		const config2 = { headers: { 'X-Custom': 'value2' } };
		const [key1] = memoizeHttpConfig(config1);
		const [key2] = memoizeHttpConfig(config2);

		expect(key1).not.toBe(key2);
	});

	it('should handle empty config', () => {
		const config = {};
		const [key, memoizedConfig] = memoizeHttpConfig(config);

		expect(typeof key).toBe('string');
		expect(memoizedConfig).toBe(config);
	});

	it('should handle config with circular references gracefully', () => {
		const config: Record<string, unknown> = { headers: { 'X-Custom': 'value' } };
		config.self = config;

		const [key, memoizedConfig] = memoizeHttpConfig(config);

		expect(key).toBe('');
		expect(memoizedConfig).toBe(config);
	});

	it('should handle config with functions gracefully', () => {
		const config = {
			headers: { 'X-Custom': 'value' },
			fn: () => {
				// Function cannot be serialized
			},
		};

		const [key, memoizedConfig] = memoizeHttpConfig(config);

		// JSON.stringify will omit functions, so the key will be based on serializable parts
		// or it might throw an error and return empty string
		expect(typeof key).toBe('string');
		expect(memoizedConfig).toBe(config);
	});
});

describe('handleFetchSuccess', () => {
	let context: FetchContext<string>;
	let setData: ReturnType<typeof vi.fn<(data: string | null) => void>>;
	let logger: MockLoggerAdapter;

	beforeEach(() => {
		setData = vi.fn<(data: string | null) => void>();
		logger = createMockLogger();
		context = createFetchContext(setData, logger);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('successful data handling', () => {
		it('should set data when not aborted', () => {
			const response = createSuccessResponse('test-data');
			handleFetchSuccess(context, response);

			expect(setData).toHaveBeenCalledWith('test-data');
			expect(setData).toHaveBeenCalledTimes(1);
			expect(logger.info).toHaveBeenCalledWith(LOG_MESSAGE_SUCCESS, {
				url: TEST_URL,
				data: 'test-data',
			});
		});

		it('should handle complex data structures', () => {
			const complexData = { users: [{ id: 1, name: 'John' }], total: 1 };
			const setDataComplex = vi.fn<(data: typeof complexData | null) => void>();
			const complexContext = createFetchContext<typeof complexData>(setDataComplex, logger);
			const response = createSuccessResponse(complexData);
			handleFetchSuccess(complexContext, response);

			expect(setDataComplex).toHaveBeenCalledWith(complexData);
			expect(logger.info).toHaveBeenCalledWith(LOG_MESSAGE_SUCCESS, {
				url: TEST_URL,
				data: complexData,
			});
		});
	});

	describe('edge cases', () => {
		it('should not set data when aborted', () => {
			context.abortController.abort();
			const response = createSuccessResponse('test-data');
			handleFetchSuccess(context, response);

			expect(setData).not.toHaveBeenCalled();
			expect(logger.info).not.toHaveBeenCalled();
		});

		it('should handle null data', () => {
			const setDataSpy = vi.fn<(data: string | null) => void>();
			const nullContext = createFetchContext<string | null>(setDataSpy, logger);
			const response = createSuccessResponse<string | null>(null);
			handleFetchSuccess(nullContext, response);

			expect(setDataSpy).toHaveBeenCalledWith(null);
		});
	});
});

describe('handleFetchError', () => {
	let context: ErrorContext;
	let setError: ReturnType<typeof vi.fn<(error: string | null) => void>>;
	let logger: MockLoggerAdapter;

	beforeEach(() => {
		setError = vi.fn<(error: string | null) => void>();
		logger = createMockLogger();
		context = createErrorContext(setError, logger);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('error type handling', () => {
		it('should handle Error instances', () => {
			const error = new Error(ERROR_NETWORK);
			handleFetchError(context, error);

			expect(setError).toHaveBeenCalledWith(ERROR_NETWORK);
			expect(setError).toHaveBeenCalledTimes(1);
			expect(logger.error).toHaveBeenCalledWith(LOG_MESSAGE_ERROR, error, {
				url: TEST_URL,
			});
		});

		it('should handle string errors', () => {
			const error = ERROR_STRING;
			handleFetchError(context, error);

			expect(setError).toHaveBeenCalledWith(ERROR_STRING);
			expect(logger.error).toHaveBeenCalledWith(LOG_MESSAGE_ERROR, error, {
				url: TEST_URL,
			});
		});

		it('should handle unknown error types', () => {
			const error = { some: 'object' };
			handleFetchError(context, error);

			expect(setError).toHaveBeenCalledWith(ERROR_UNKNOWN);
			expect(logger.error).toHaveBeenCalledWith(LOG_MESSAGE_ERROR, error, {
				url: TEST_URL,
			});
		});
	});

	describe('edge cases', () => {
		it('should not set error when aborted', () => {
			context.abortController.abort();
			handleFetchError(context, new Error(ERROR_NETWORK));
			expect(setError).not.toHaveBeenCalled();
			expect(logger.error).not.toHaveBeenCalled();
		});

		it('should handle null/undefined/number errors', () => {
			handleFetchError(context, null);
			expect(setError).toHaveBeenCalledWith(ERROR_UNKNOWN);
			vi.clearAllMocks();
			handleFetchError(context, undefined);
			expect(setError).toHaveBeenCalledWith(ERROR_UNKNOWN);
			vi.clearAllMocks();
			handleFetchError(context, 404);
			expect(setError).toHaveBeenCalledWith(ERROR_UNKNOWN);
		});
	});
});

function createPerformFetchTestContext() {
	const setLoading = vi.fn<(loading: boolean) => void>();
	const setError = vi.fn<(error: string | null) => void>();
	const setData = vi.fn<(data: string | null) => void>();
	const logger = createMockLogger();
	const http = new MockHttpAdapter();
	const context = createPerformFetchContext(setLoading, setError, setData, logger, http);
	return { context, setLoading, setError, setData, logger, http };
}

describe('performFetch - successful fetch', () => {
	it('should perform successful fetch', async () => {
		const { context, setLoading, setError, setData, logger, http } =
			createPerformFetchTestContext();
		const response = createSuccessResponse('success');
		http.mockResponse(TEST_URL, 'GET', response);

		await performFetch(context);

		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setError).toHaveBeenCalledWith(null);
		expect(setData).toHaveBeenCalledWith('success');
		expect(setLoading).toHaveBeenCalledWith(false);
		expect(logger.info).toHaveBeenCalled();
	});
});

describe('performFetch - error handling', () => {
	it('should handle fetch errors', async () => {
		const { context, setLoading, setError, setData, logger, http } =
			createPerformFetchTestContext();
		const error = new Error(ERROR_NETWORK);
		http.mockResponse(TEST_URL, 'GET', () => {
			throw error;
		});

		await performFetch(context);

		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setError).toHaveBeenCalledWith(null);
		expect(setError).toHaveBeenCalledWith(ERROR_NETWORK);
		expect(setData).not.toHaveBeenCalled();
		expect(setLoading).toHaveBeenCalledWith(false);
		expect(logger.error).toHaveBeenCalled();
	});

	it('should handle errors during fetch and set loading to false', async () => {
		const { context, setLoading, http } = createPerformFetchTestContext();
		const error = new Error('Fetch failed');
		http.mockResponse(TEST_URL, 'GET', () => {
			throw error;
		});

		await performFetch(context);

		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setLoading).toHaveBeenCalledWith(false);
	});
});

describe('performFetch - request configuration', () => {
	it('should pass abort signal to http.get', async () => {
		const { context, http } = createPerformFetchTestContext();
		const response = createSuccessResponse('success');
		http.mockResponse(TEST_URL, 'GET', response);

		await performFetch(context);

		const [request] = http.requests;
		expect(request?.config?.signal).toBe(context.abortController.signal);
	});

	it('should merge httpConfig with request', async () => {
		const { context, http } = createPerformFetchTestContext();
		const response = createSuccessResponse('success');
		context.httpConfig = { headers: { 'X-Custom': 'value' } };
		http.mockResponse(TEST_URL, 'GET', response);

		await performFetch(context);

		const [request] = http.requests;
		expect(request?.config?.headers?.['X-Custom']).toBe('value');
	});
});

describe('performFetch - abort handling', () => {
	it('should not set loading to false if aborted', async () => {
		const { context, setLoading, http } = createPerformFetchTestContext();
		const response = createSuccessResponse('success');
		http.mockResponse('/api/test', 'GET', async () => {
			context.abortController.abort();
			return response;
		});

		await performFetch(context);

		expect(setLoading).toHaveBeenCalledWith(true);
		expect(setLoading).not.toHaveBeenCalledWith(false);
	});
});

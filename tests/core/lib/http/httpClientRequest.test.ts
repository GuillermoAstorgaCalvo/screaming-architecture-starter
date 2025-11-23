import { prepareRequestBody } from '@core/lib/http/httpClientBody';
import { mergeConfigAndHeaders } from '@core/lib/http/httpClientConfig';
import { headersToRecord, mergeHeaders } from '@core/lib/http/httpClientHeaders';
import { executeRequestInterceptors } from '@core/lib/http/httpClientInterceptors';
import {
	clearTimeoutSafely,
	createRequestTimeout,
	prepareFetchConfig,
	prepareRequestConfig,
	type PrepareRequestConfigOptions,
} from '@core/lib/http/httpClientRequest';
import { createTimeoutController } from '@core/lib/http/httpClientTimeout';
import type { HttpClientConfig } from '@core/ports/HttpPort';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('@core/lib/http/httpClientBody');
vi.mock('@core/lib/http/httpClientConfig');
vi.mock('@core/lib/http/httpClientHeaders');
vi.mock('@core/lib/http/httpClientInterceptors');
vi.mock('@core/lib/http/httpClientTimeout');

// Shared test setup
beforeEach(() => {
	vi.clearAllMocks();
});

// Test constants
const TEST_URL = 'https://api.example.com/test';
const BEARER_TOKEN = 'Bearer token';

// Test helper functions
const createMockTimeoutController = () => ({
	controller: new AbortController(),
	timeoutId: setTimeout(() => {}, 1000),
});

const createBasicRequestConfig = (): HttpClientConfig & { url: string } => ({
	url: TEST_URL,
	method: 'GET',
	headers: {},
});

const createMockHeaders = () => new Headers();

const mockBasicPrepareRequestBody = () => {
	vi.mocked(mergeHeaders).mockReturnValue(createMockHeaders());
	vi.mocked(prepareRequestBody).mockReturnValue({
		headers: createMockHeaders(),
	});
};

describe('clearTimeoutSafely', () => {
	it('clears timeout when controller exists', () => {
		const timeoutId = setTimeout(() => {}, 1000);
		const controller = { controller: new AbortController(), timeoutId };
		const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
		clearTimeoutSafely(controller);
		expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
		clearTimeoutSpy.mockRestore();
	});

	it('handles null controller', () => {
		expect(() => clearTimeoutSafely(null)).not.toThrow();
	});
});

describe('prepareRequestConfig', () => {
	it('merges config and headers, then executes interceptors', async () => {
		const defaultConfig: HttpClientConfig = {
			headers: { 'Content-Type': 'application/json' },
		};
		const config: HttpClientConfig = {
			headers: { Authorization: BEARER_TOKEN },
		};
		const mergedConfig = { method: 'GET' };
		const mergedHeaders = new Headers({
			'Content-Type': 'application/json',
			Authorization: BEARER_TOKEN,
		});
		const fullURL = TEST_URL;
		const headersRecord = { 'Content-Type': 'application/json', Authorization: BEARER_TOKEN };
		const finalConfig = {
			...mergedConfig,
			headers: headersRecord,
			url: fullURL,
		};

		vi.mocked(mergeConfigAndHeaders).mockReturnValue({
			mergedConfig,
			mergedHeaders,
			fullURL,
		});
		vi.mocked(headersToRecord).mockReturnValue(headersRecord);
		vi.mocked(executeRequestInterceptors).mockResolvedValue(finalConfig);

		const options: PrepareRequestConfigOptions = {
			url: '/test',
			config,
			defaultConfig,
			requestInterceptors: [],
		};

		const result = await prepareRequestConfig(options);

		expect(mergeConfigAndHeaders).toHaveBeenCalledWith('/test', config, defaultConfig);
		expect(headersToRecord).toHaveBeenCalledWith(mergedHeaders);
		expect(executeRequestInterceptors).toHaveBeenCalledWith([], {
			...mergedConfig,
			headers: headersRecord,
			url: fullURL,
		});
		expect(result).toBe(finalConfig);
	});
});

describe('prepareFetchConfig', () => {
	describe('body and headers handling', () => {
		it('prepares fetch config with body and headers', () => {
			const requestConfig: HttpClientConfig & { url: string } = {
				url: TEST_URL,
				method: 'POST',
				body: { key: 'value' },
				headers: { 'Content-Type': 'application/json' },
			};
			const requestHeaders = new Headers({ 'Content-Type': 'application/json' });
			const finalBody = JSON.stringify({ key: 'value' });
			const finalHeaders = new Headers({ 'Content-Type': 'application/json' });

			vi.mocked(mergeHeaders).mockReturnValue(requestHeaders);
			vi.mocked(prepareRequestBody).mockReturnValue({
				body: finalBody,
				headers: finalHeaders,
			});

			const result = prepareFetchConfig(requestConfig, null);

			expect(mergeHeaders).toHaveBeenCalledWith(requestConfig.headers);
			expect(prepareRequestBody).toHaveBeenCalledWith(requestConfig.body, requestHeaders);
			expect(result.finalURL).toBe(TEST_URL);
			expect(result.finalFetchConfig.body).toBe(finalBody);
			expect(result.finalFetchConfig.headers).toBe(finalHeaders);
			expect(result.finalFetchConfig.method).toBe('POST');
		});

		it('sets body to null when prepareRequestBody returns undefined body', () => {
			const requestConfig = createBasicRequestConfig();

			mockBasicPrepareRequestBody();

			const result = prepareFetchConfig(requestConfig, null);

			expect(result.finalFetchConfig.body).toBeNull();
		});
	});

	describe('timeout controller handling', () => {
		it('adds abort signal when timeout controller exists', () => {
			const requestConfig = createBasicRequestConfig();
			const controller = new AbortController();
			const timeoutController = { controller, timeoutId: setTimeout(() => {}, 1000) };

			mockBasicPrepareRequestBody();

			const result = prepareFetchConfig(requestConfig, timeoutController);

			expect(result.finalFetchConfig.signal).toBe(controller.signal);
		});
	});

	describe('config property exclusion', () => {
		it('excludes url, baseURL, timeout, and body from fetch config', () => {
			const requestConfig: HttpClientConfig & { url: string } = {
				url: TEST_URL,
				baseURL: 'https://api.example.com',
				timeout: 5000,
				method: 'GET',
				headers: {},
			};

			mockBasicPrepareRequestBody();

			const result = prepareFetchConfig(requestConfig, null);

			expect(result.finalFetchConfig).not.toHaveProperty('url');
			expect(result.finalFetchConfig).not.toHaveProperty('baseURL');
			expect(result.finalFetchConfig).not.toHaveProperty('timeout');
		});
	});
});

describe('createRequestTimeout', () => {
	it('creates timeout controller when timeout is provided', () => {
		const timeoutController = createMockTimeoutController();
		vi.mocked(createTimeoutController).mockReturnValue(timeoutController);

		const result = createRequestTimeout(5000, undefined);

		expect(createTimeoutController).toHaveBeenCalledWith(5000);
		expect(result).toBe(timeoutController);
	});

	it('uses default timeout when timeout is undefined', () => {
		const timeoutController = createMockTimeoutController();
		vi.mocked(createTimeoutController).mockReturnValue(timeoutController);

		const result = createRequestTimeout(undefined, 3000);

		expect(createTimeoutController).toHaveBeenCalledWith(3000);
		expect(result).toBe(timeoutController);
	});

	it('returns null when both timeout and defaultTimeout are undefined', () => {
		vi.mocked(createTimeoutController).mockReturnValue(null);

		const result = createRequestTimeout(undefined, undefined);

		expect(createTimeoutController).toHaveBeenCalledWith(undefined);
		expect(result).toBeNull();
	});

	it('prefers timeout over defaultTimeout', () => {
		const timeoutController = createMockTimeoutController();
		vi.mocked(createTimeoutController).mockReturnValue(timeoutController);

		const result = createRequestTimeout(5000, 3000);

		expect(createTimeoutController).toHaveBeenCalledWith(5000);
		expect(result).toBe(timeoutController);
	});

	it('handles timeout value of 0', () => {
		vi.mocked(createTimeoutController).mockReturnValue(null);

		const result = createRequestTimeout(0, undefined);

		expect(createTimeoutController).toHaveBeenCalledWith(0);
		expect(result).toBeNull();
	});
});

describe('prepareFetchConfig - additional edge cases', () => {
	it('handles request config with all fetch options', () => {
		const requestConfig: HttpClientConfig & { url: string } = {
			url: TEST_URL,
			method: 'POST',
			body: { key: 'value' },
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			cache: 'no-cache',
			mode: 'cors',
			redirect: 'follow',
			referrer: 'https://example.com',
			referrerPolicy: 'strict-origin-when-cross-origin',
		};

		mockBasicPrepareRequestBody();

		const result = prepareFetchConfig(requestConfig, null);

		expect(result.finalFetchConfig.credentials).toBe('include');
		expect(result.finalFetchConfig.cache).toBe('no-cache');
		expect(result.finalFetchConfig.mode).toBe('cors');
		expect(result.finalFetchConfig.redirect).toBe('follow');
		expect(result.finalFetchConfig.referrer).toBe('https://example.com');
		expect(result.finalFetchConfig.referrerPolicy).toBe('strict-origin-when-cross-origin');
	});

	it('handles request config with signal from timeout controller', () => {
		const requestConfig = createBasicRequestConfig();
		const controller = new AbortController();
		const timeoutController = { controller, timeoutId: setTimeout(() => {}, 1000) };

		mockBasicPrepareRequestBody();

		const result = prepareFetchConfig(requestConfig, timeoutController);

		expect(result.finalFetchConfig.signal).toBe(controller.signal);
	});

	it('handles request config without body', () => {
		const requestConfig: HttpClientConfig & { url: string } = {
			url: TEST_URL,
			method: 'GET',
			headers: {},
		};

		vi.mocked(mergeHeaders).mockReturnValue(new Headers());
		vi.mocked(prepareRequestBody).mockReturnValue({
			headers: new Headers(),
		});

		const result = prepareFetchConfig(requestConfig, null);

		expect(result.finalFetchConfig.body).toBeNull();
	});
});

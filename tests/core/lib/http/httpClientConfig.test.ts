import { createDefaultConfig, mergeConfigAndHeaders } from '@core/lib/http/httpClientConfig';
import type { HttpClientConfig } from '@core/ports/HttpPort';
import { describe, expect, it } from 'vitest';

const TEST_ENDPOINT = '/api/test';
const CONTENT_TYPE_JSON = 'application/json';
const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_AUTHORIZATION = 'Authorization';

const createDefaultConfigWithHeaders = (): HttpClientConfig => ({
	headers: { [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON },
});

describe('createDefaultConfig', () => {
	it('returns config with default Content-Type header', () => {
		const config = createDefaultConfig();
		expect(config).toEqual({
			headers: {
				[HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
			},
		});
	});

	it('returns a new object each time', () => {
		const config1 = createDefaultConfig();
		const config2 = createDefaultConfig();
		expect(config1).not.toBe(config2);
		expect(config1.headers).not.toBe(config2.headers);
	});
});

describe('mergeConfigAndHeaders - header merging', () => {
	it('merges default and config headers', () => {
		const defaultConfig: HttpClientConfig = {
			headers: {
				[HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
				[HEADER_AUTHORIZATION]: 'Bearer default',
			},
		};
		const config: HttpClientConfig = {
			headers: { [HEADER_AUTHORIZATION]: 'Bearer custom' },
		};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.mergedHeaders.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
		expect(result.mergedHeaders.get(HEADER_AUTHORIZATION)).toBe('Bearer custom');
	});

	it('handles empty config', () => {
		const defaultConfig = createDefaultConfigWithHeaders();
		const config: HttpClientConfig = {};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.mergedConfig).toEqual({});
		expect(result.mergedHeaders.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles config without headers', () => {
		const defaultConfig = createDefaultConfigWithHeaders();
		const config: HttpClientConfig = {
			method: 'POST',
		};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.mergedConfig.method).toBe('POST');
		expect(result.mergedHeaders.get(HEADER_CONTENT_TYPE)).toBe(CONTENT_TYPE_JSON);
	});

	it('handles default config without headers', () => {
		const defaultConfig: HttpClientConfig = {};
		const config: HttpClientConfig = {
			headers: { [HEADER_AUTHORIZATION]: 'Bearer token' },
		};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.mergedHeaders.get(HEADER_AUTHORIZATION)).toBe('Bearer token');
	});
});

describe('mergeConfigAndHeaders - config property merging', () => {
	it('merges non-header config properties', () => {
		const defaultConfig: HttpClientConfig = {
			...createDefaultConfigWithHeaders(),
			method: 'GET',
		};
		const config: HttpClientConfig = {
			method: 'POST',
			timeout: 5000,
		};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.mergedConfig.method).toBe('POST');
		expect(result.mergedConfig.timeout).toBe(5000);
	});
});

describe('mergeConfigAndHeaders - baseURL handling', () => {
	it('uses config baseURL over default baseURL', () => {
		const defaultConfig: HttpClientConfig = {
			...createDefaultConfigWithHeaders(),
			baseURL: 'https://default.example.com',
		};
		const config: HttpClientConfig = {
			baseURL: 'https://custom.example.com',
		};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.fullURL).toBe('https://custom.example.com/api/test');
	});

	it('uses default baseURL when config baseURL is not provided', () => {
		const defaultConfig: HttpClientConfig = {
			...createDefaultConfigWithHeaders(),
			baseURL: 'https://default.example.com',
		};
		const config: HttpClientConfig = {};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.fullURL).toBe('https://default.example.com/api/test');
	});
});

describe('mergeConfigAndHeaders - URL handling', () => {
	it('handles absolute URLs without baseURL', () => {
		const defaultConfig = createDefaultConfigWithHeaders();
		const config: HttpClientConfig = {};
		const result = mergeConfigAndHeaders('https://example.com/api/test', config, defaultConfig);
		expect(result.fullURL).toBe('https://example.com/api/test');
	});

	it('handles relative URLs without baseURL', () => {
		const defaultConfig = createDefaultConfigWithHeaders();
		const config: HttpClientConfig = {};
		const result = mergeConfigAndHeaders(TEST_ENDPOINT, config, defaultConfig);
		expect(result.fullURL).toBe(TEST_ENDPOINT);
	});
});

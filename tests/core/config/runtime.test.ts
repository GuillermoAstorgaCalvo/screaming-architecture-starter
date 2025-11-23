import type { Env } from '@core/config/env.client';
import {
	__resetRuntimeConfigCache,
	getAppConfig,
	getCachedRuntimeConfig,
	getRuntimeConfig,
	type RuntimeConfig,
} from '@core/config/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { baseEnv, mockEnv } = vi.hoisted(() => {
	const runtimeBaseEnv: Env = {
		DEV: false,
		PROD: true,
		MODE: 'production',
		ANALYTICS_ENABLED: false,
		SPEED_INSIGHTS_ENABLED: false,
		GTM_DATALAYER_NAME: 'dataLayer',
		GTM_CONTAINER_ID: undefined,
		GTM_DEBUG: undefined,
		GOOGLE_MAPS_API_KEY: undefined,
	};

	return {
		baseEnv: runtimeBaseEnv,
		mockEnv: { ...runtimeBaseEnv },
	};
});

vi.mock('@core/config/env.client', () => ({
	env: mockEnv,
}));

const originalFetch = globalThis.fetch;

const TEST_API_BASE_URL = 'https://api.example.com';
const VALIDATION_FAILED_MESSAGE = 'Runtime config validation failed, using defaults:';

const validRuntimeConfig: RuntimeConfig = {
	API_BASE_URL: TEST_API_BASE_URL,
	ANALYTICS_WRITE_KEY: 'analytics-key',
	GOOGLE_MAPS_API_KEY: 'runtime-maps-key',
	FEATURE_FLAGS: {
		EXAMPLE_FEATURE: {
			key: 'EXAMPLE_FEATURE',
			enabled: true,
		},
	},
};

function mockFetchResponse(payload: RuntimeConfig = validRuntimeConfig, status = 200) {
	const response = new Response(JSON.stringify(payload), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
	const fetchMock = vi.fn().mockResolvedValue(response);
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
	return fetchMock;
}

function mockRejectedFetch(error = new Error('network error')) {
	const fetchMock = vi.fn().mockRejectedValue(error);
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
	return fetchMock;
}

function registerRuntimeConfigTestHooks() {
	beforeEach(() => {
		__resetRuntimeConfigCache();
		Object.assign(mockEnv, baseEnv);
		globalThis.fetch = originalFetch;
	});

	afterEach(() => {
		__resetRuntimeConfigCache();
		globalThis.fetch = originalFetch;
		vi.restoreAllMocks();
		Object.assign(mockEnv, baseEnv);
	});
}

describe('runtime config loading', () => {
	registerRuntimeConfigTestHooks();

	it('loads and validates runtime config from runtime-config.json', async () => {
		const fetchMock = mockFetchResponse(validRuntimeConfig);

		const config = await getRuntimeConfig();

		expect(fetchMock).toHaveBeenCalledWith('/runtime-config.json');
		expect(config).toEqual(validRuntimeConfig);
	});
});

describe('runtime config caching', () => {
	registerRuntimeConfigTestHooks();

	it('caches runtime config after the first successful load', async () => {
		const fetchMock = mockFetchResponse(validRuntimeConfig);

		const first = await getRuntimeConfig();
		const second = await getRuntimeConfig();

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(second).toBe(first);
		expect(getCachedRuntimeConfig()).toBe(first);
	});

	it('returns null from getCachedRuntimeConfig until data is loaded and resets after clearing', async () => {
		expect(getCachedRuntimeConfig()).toBeNull();

		mockFetchResponse(validRuntimeConfig);
		const loaded = await getRuntimeConfig();

		expect(getCachedRuntimeConfig()).toBe(loaded);

		__resetRuntimeConfigCache();
		expect(getCachedRuntimeConfig()).toBeNull();
	});
});

describe('runtime config error handling', () => {
	registerRuntimeConfigTestHooks();

	it('falls back to defaults and logs when validation fails', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const invalidRuntimeConfig = {
			API_BASE_URL: 'not-a-url',
		} as RuntimeConfig;

		mockFetchResponse(invalidRuntimeConfig);

		const config = await getRuntimeConfig();

		expect(config).toEqual({});
		expect(warnSpy).toHaveBeenCalledWith(VALIDATION_FAILED_MESSAGE, expect.anything());
	});

	it('returns defaults without warning when the runtime config file is missing', async () => {
		const fetchMock = mockFetchResponse(validRuntimeConfig, 404);

		const config = await getRuntimeConfig();

		expect(config).toEqual({});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('handles fetch failures by logging and returning defaults', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		mockRejectedFetch(new Error('boom'));

		const config = await getRuntimeConfig();

		expect(config).toEqual({});
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to load runtime config, using defaults:',
			expect.any(Error)
		);
	});
});

describe('runtime config merging', () => {
	registerRuntimeConfigTestHooks();

	it('merges env and runtime config in getAppConfig', async () => {
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = 'GTM-ABC123';
		mockEnv.GOOGLE_MAPS_API_KEY = 'env-maps-key';

		mockFetchResponse(validRuntimeConfig);

		const appConfig = await getAppConfig();

		expect(appConfig.runtime).toEqual(validRuntimeConfig);
		expect(appConfig).toMatchObject({
			ANALYTICS_ENABLED: true,
			GTM_CONTAINER_ID: 'GTM-ABC123',
			GOOGLE_MAPS_API_KEY: 'env-maps-key',
		});
	});
});

describe('FEATURE_FLAGS preprocessing', () => {
	registerRuntimeConfigTestHooks();

	it('transforms null FEATURE_FLAGS to undefined', async () => {
		const configWithNullFlags = {
			API_BASE_URL: TEST_API_BASE_URL,
			FEATURE_FLAGS: null,
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithNullFlags);

		const config = await getRuntimeConfig();

		expect(config.FEATURE_FLAGS).toBeUndefined();
		expect(config.API_BASE_URL).toBe(TEST_API_BASE_URL);
	});

	it('transforms empty object FEATURE_FLAGS to undefined', async () => {
		const configWithEmptyFlags = {
			API_BASE_URL: TEST_API_BASE_URL,
			FEATURE_FLAGS: {},
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithEmptyFlags);

		const config = await getRuntimeConfig();

		expect(config.FEATURE_FLAGS).toBeUndefined();
		expect(config.API_BASE_URL).toBe(TEST_API_BASE_URL);
	});

	it('preserves valid FEATURE_FLAGS object', async () => {
		const configWithValidFlags = {
			API_BASE_URL: TEST_API_BASE_URL,
			FEATURE_FLAGS: {
				EXAMPLE_FEATURE: {
					key: 'EXAMPLE_FEATURE',
					enabled: true,
				},
			},
		};

		mockFetchResponse(configWithValidFlags);

		const config = await getRuntimeConfig();

		expect(config.FEATURE_FLAGS).toEqual(configWithValidFlags.FEATURE_FLAGS);
		expect(config.API_BASE_URL).toBe(TEST_API_BASE_URL);
	});

	it('rejects invalid FEATURE_FLAGS and falls back to defaults', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const configWithInvalidFlags = {
			API_BASE_URL: TEST_API_BASE_URL,
			FEATURE_FLAGS: {
				INVALID_FLAG: {
					key: '', // Invalid: empty key
					enabled: true,
				},
			},
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithInvalidFlags);

		const config = await getRuntimeConfig();

		expect(config).toEqual({});
		expect(warnSpy).toHaveBeenCalledWith(VALIDATION_FAILED_MESSAGE, expect.anything());
	});
});

describe('API_BASE_URL preprocessing and validation', () => {
	registerRuntimeConfigTestHooks();

	it('transforms null API_BASE_URL to undefined', async () => {
		const configWithNullUrl = {
			API_BASE_URL: null,
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithNullUrl);

		const config = await getRuntimeConfig();

		expect(config.API_BASE_URL).toBeUndefined();
	});

	it('transforms empty string API_BASE_URL to undefined', async () => {
		const configWithEmptyUrl = {
			API_BASE_URL: '',
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithEmptyUrl);

		const config = await getRuntimeConfig();

		expect(config.API_BASE_URL).toBeUndefined();
	});

	it('validates API_BASE_URL must be a valid URL', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const configWithInvalidUrl = {
			API_BASE_URL: 'not-a-valid-url',
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithInvalidUrl);

		const config = await getRuntimeConfig();

		expect(config.API_BASE_URL).toBeUndefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Runtime config validation failed, using defaults:',
			expect.anything()
		);
	});

	it('accepts valid URL for API_BASE_URL', async () => {
		const configWithValidUrl = {
			API_BASE_URL: 'https://api.example.com/v1',
		};

		mockFetchResponse(configWithValidUrl);

		const config = await getRuntimeConfig();

		expect(config.API_BASE_URL).toBe('https://api.example.com/v1');
	});
});

describe('ANALYTICS_WRITE_KEY preprocessing', () => {
	registerRuntimeConfigTestHooks();

	it('transforms null ANALYTICS_WRITE_KEY to undefined', async () => {
		const configWithNullKey = {
			ANALYTICS_WRITE_KEY: null,
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithNullKey);

		const config = await getRuntimeConfig();

		expect(config.ANALYTICS_WRITE_KEY).toBeUndefined();
	});

	it('transforms empty string ANALYTICS_WRITE_KEY to undefined', async () => {
		const configWithEmptyKey = {
			ANALYTICS_WRITE_KEY: '',
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithEmptyKey);

		const config = await getRuntimeConfig();

		expect(config.ANALYTICS_WRITE_KEY).toBeUndefined();
	});

	it('preserves valid ANALYTICS_WRITE_KEY', async () => {
		const configWithValidKey = {
			ANALYTICS_WRITE_KEY: 'analytics-key-123',
		};

		mockFetchResponse(configWithValidKey);

		const config = await getRuntimeConfig();

		expect(config.ANALYTICS_WRITE_KEY).toBe('analytics-key-123');
	});
});

describe('GOOGLE_MAPS_API_KEY preprocessing', () => {
	registerRuntimeConfigTestHooks();

	it('transforms null GOOGLE_MAPS_API_KEY to undefined', async () => {
		const configWithNullKey = {
			GOOGLE_MAPS_API_KEY: null,
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithNullKey);

		const config = await getRuntimeConfig();

		expect(config.GOOGLE_MAPS_API_KEY).toBeUndefined();
	});

	it('transforms empty string GOOGLE_MAPS_API_KEY to undefined', async () => {
		const configWithEmptyKey = {
			GOOGLE_MAPS_API_KEY: '',
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithEmptyKey);

		const config = await getRuntimeConfig();

		expect(config.GOOGLE_MAPS_API_KEY).toBeUndefined();
	});

	it('preserves valid GOOGLE_MAPS_API_KEY', async () => {
		const configWithValidKey = {
			GOOGLE_MAPS_API_KEY: 'maps-key-123',
		};

		mockFetchResponse(configWithValidKey);

		const config = await getRuntimeConfig();

		expect(config.GOOGLE_MAPS_API_KEY).toBe('maps-key-123');
	});
});

describe('additional runtime config keys (catchall)', () => {
	registerRuntimeConfigTestHooks();

	it('allows additional unknown keys in runtime config', async () => {
		const configWithExtraKeys = {
			API_BASE_URL: TEST_API_BASE_URL,
			CUSTOM_KEY: 'custom-value',
			ANOTHER_KEY: 123,
		} as unknown as RuntimeConfig;

		mockFetchResponse(configWithExtraKeys);

		const config = await getRuntimeConfig();

		expect(config.API_BASE_URL).toBe(TEST_API_BASE_URL);
		expect((config as Record<string, unknown>).CUSTOM_KEY).toBe('custom-value');
		expect((config as Record<string, unknown>).ANOTHER_KEY).toBe(123);
	});
});

describe('JSON parsing errors', () => {
	registerRuntimeConfigTestHooks();

	it('handles invalid JSON response by logging and returning defaults', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const response = new Response('invalid json', {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
		const fetchMock = vi.fn().mockResolvedValue(response);
		globalThis.fetch = fetchMock as typeof globalThis.fetch;

		// Mock json() to throw an error
		vi.spyOn(response, 'json').mockRejectedValue(new Error('Invalid JSON'));

		const config = await getRuntimeConfig();

		expect(config).toEqual({});
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to load runtime config, using defaults:',
			expect.any(Error)
		);
	});
});

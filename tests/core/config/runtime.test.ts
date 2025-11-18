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

const validRuntimeConfig: RuntimeConfig = {
	API_BASE_URL: 'https://api.example.com',
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
		expect(warnSpy).toHaveBeenCalledWith(
			'Runtime config validation failed, using defaults:',
			expect.anything()
		);
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

import { parseClientEnv } from '@core/config/env.client';
import { describe, expect, it, vi } from 'vitest';

type Maybe<T> = T | undefined;
type TestEnv = Record<string, unknown> & {
	DEV?: Maybe<boolean | string>;
	PROD?: Maybe<boolean | string>;
	MODE?: Maybe<string>;
	VITE_ANALYTICS_ENABLED?: Maybe<string | boolean>;
	VITE_SPEED_INSIGHTS_ENABLED?: Maybe<string | boolean>;
	VITE_GTM_CONTAINER_ID?: Maybe<string>;
	VITE_GTM_DEBUG?: Maybe<string | boolean>;
	VITE_GTM_DATALAYER_NAME?: Maybe<string>;
	VITE_GOOGLE_MAPS_API_KEY?: Maybe<string>;
};

const baseEnv: TestEnv = {
	DEV: false,
	PROD: true,
	MODE: 'production',
};

function buildEnv(overrides: TestEnv = {}): Record<string, unknown> {
	return { ...baseEnv, ...overrides };
}

function parseWithEnv(overrides: TestEnv = {}) {
	return parseClientEnv(() => buildEnv(overrides));
}

function registerDefaultValueTest() {
	it('provides safe defaults when optional values are missing', () => {
		const result = parseWithEnv({
			DEV: undefined,
			PROD: undefined,
			MODE: undefined,
			VITE_ANALYTICS_ENABLED: undefined,
			VITE_SPEED_INSIGHTS_ENABLED: undefined,
			VITE_GTM_CONTAINER_ID: undefined,
			VITE_GTM_DEBUG: undefined,
			VITE_GTM_DATALAYER_NAME: undefined,
			VITE_GOOGLE_MAPS_API_KEY: undefined,
		});

		expect(result).toMatchObject({
			DEV: false,
			PROD: true,
			MODE: 'production',
			ANALYTICS_ENABLED: false,
			SPEED_INSIGHTS_ENABLED: false,
			GTM_CONTAINER_ID: undefined,
			GTM_DEBUG: undefined,
			GTM_DATALAYER_NAME: 'dataLayer',
			GOOGLE_MAPS_API_KEY: undefined,
		});
	});
}

function registerBooleanCoercionTest() {
	it('coerces boolean-like values', () => {
		const result = parseWithEnv({
			DEV: 'true',
			PROD: 'false',
			MODE: 'DEVELOPMENT',
			VITE_ANALYTICS_ENABLED: 'TrUe',
			VITE_SPEED_INSIGHTS_ENABLED: 'TRUE',
			VITE_GTM_DEBUG: 'true',
		});

		expect(result).toMatchObject({
			DEV: true,
			PROD: false,
			MODE: 'development',
			ANALYTICS_ENABLED: true,
			SPEED_INSIGHTS_ENABLED: true,
			GTM_DEBUG: true,
		});
	});
}

function registerModeNormalizationTest() {
	it('normalizes unknown modes to production', () => {
		expect(parseWithEnv({ MODE: '  staging ' }).MODE).toBe('production');
	});
}

function registerStringTrimTest() {
	it('trims string inputs and treats empty values as undefined', () => {
		const result = parseWithEnv({
			VITE_GTM_CONTAINER_ID: ' GTM-123 ',
			VITE_GTM_DATALAYER_NAME: ' customLayer ',
			VITE_GOOGLE_MAPS_API_KEY: '  key  ',
		});

		expect(result).toMatchObject({
			GTM_CONTAINER_ID: 'GTM-123',
			GTM_DATALAYER_NAME: 'customLayer',
			GOOGLE_MAPS_API_KEY: 'key',
		});

		const defaults = parseWithEnv({
			VITE_GTM_CONTAINER_ID: '   ',
			VITE_GTM_DATALAYER_NAME: '   ',
			VITE_GOOGLE_MAPS_API_KEY: '   ',
		});

		expect(defaults.GTM_CONTAINER_ID).toBeUndefined();
		expect(defaults.GTM_DATALAYER_NAME).toBe('dataLayer');
		expect(defaults.GOOGLE_MAPS_API_KEY).toBeUndefined();
	});
}

function registerErrorFallbackTest() {
	it('logs a warning and falls back to safe defaults when parsing fails', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const result = parseClientEnv(() => {
			throw new Error('boom');
		});

		expect(result).toMatchObject({
			DEV: false,
			PROD: true,
			MODE: 'production',
			ANALYTICS_ENABLED: false,
			SPEED_INSIGHTS_ENABLED: false,
		});
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to parse environment variables, using defaults:',
			expect.any(Error)
		);
	});
}

describe('env.client', () => {
	registerDefaultValueTest();
	registerBooleanCoercionTest();
	registerModeNormalizationTest();
	registerStringTrimTest();
	registerErrorFallbackTest();
});

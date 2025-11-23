import { parseClientEnv } from '@core/config/env.client';
import { describe, expect, it, vi } from 'vitest';

type TestEnv = Record<string, unknown> & {
	DEV?: unknown;
	PROD?: unknown;
	MODE?: unknown;
	VITE_ANALYTICS_ENABLED?: unknown;
	VITE_SPEED_INSIGHTS_ENABLED?: unknown;
	VITE_GTM_CONTAINER_ID?: unknown;
	VITE_GTM_DEBUG?: unknown;
	VITE_GTM_DATALAYER_NAME?: unknown;
	VITE_GOOGLE_MAPS_API_KEY?: unknown;
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

function registerEdgeCaseTests() {
	it('handles DEV with non-boolean/non-string values', () => {
		expect(parseWithEnv({ DEV: 123 }).DEV).toBe(false);
		expect(parseWithEnv({ DEV: null }).DEV).toBe(false);
		expect(parseWithEnv({ DEV: {} }).DEV).toBe(false);
		expect(parseWithEnv({ DEV: [] }).DEV).toBe(false);
		expect(parseWithEnv({ DEV: 0 }).DEV).toBe(false);
		expect(parseWithEnv({ DEV: 1 }).DEV).toBe(false);
	});

	it('handles PROD with non-boolean/non-string values', () => {
		expect(parseWithEnv({ PROD: 123 }).PROD).toBe(true);
		expect(parseWithEnv({ PROD: null }).PROD).toBe(true);
		expect(parseWithEnv({ PROD: {} }).PROD).toBe(true);
		expect(parseWithEnv({ PROD: [] }).PROD).toBe(true);
		expect(parseWithEnv({ PROD: 0 }).PROD).toBe(true);
		expect(parseWithEnv({ PROD: 1 }).PROD).toBe(true);
	});

	it('handles MODE with non-string values (number, object, null)', () => {
		expect(parseWithEnv({ MODE: 123 }).MODE).toBe('production');
		expect(parseWithEnv({ MODE: null }).MODE).toBe('production');
		expect(parseWithEnv({ MODE: {} }).MODE).toBe('production');
		expect(parseWithEnv({ MODE: [] }).MODE).toBe('production');
	});

	it('handles ANALYTICS_ENABLED with non-boolean/non-string values', () => {
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: 123 }).ANALYTICS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: null }).ANALYTICS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: {} }).ANALYTICS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: [] }).ANALYTICS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: 0 }).ANALYTICS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_ANALYTICS_ENABLED: 1 }).ANALYTICS_ENABLED).toBe(false);
	});

	it('handles SPEED_INSIGHTS_ENABLED with non-boolean/non-string values', () => {
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: 123 }).SPEED_INSIGHTS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: null }).SPEED_INSIGHTS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: {} }).SPEED_INSIGHTS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: [] }).SPEED_INSIGHTS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: 0 }).SPEED_INSIGHTS_ENABLED).toBe(false);
		expect(parseWithEnv({ VITE_SPEED_INSIGHTS_ENABLED: 1 }).SPEED_INSIGHTS_ENABLED).toBe(false);
	});

	it('handles GTM_CONTAINER_ID with non-string values', () => {
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: 123 }).GTM_CONTAINER_ID).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: null }).GTM_CONTAINER_ID).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: {} }).GTM_CONTAINER_ID).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: [] }).GTM_CONTAINER_ID).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: true }).GTM_CONTAINER_ID).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_CONTAINER_ID: false }).GTM_CONTAINER_ID).toBeUndefined();
	});

	it('handles GTM_DEBUG with non-boolean/non-string values', () => {
		expect(parseWithEnv({ VITE_GTM_DEBUG: 123 }).GTM_DEBUG).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_DEBUG: null }).GTM_DEBUG).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_DEBUG: {} }).GTM_DEBUG).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_DEBUG: [] }).GTM_DEBUG).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_DEBUG: 0 }).GTM_DEBUG).toBeUndefined();
		expect(parseWithEnv({ VITE_GTM_DEBUG: 1 }).GTM_DEBUG).toBeUndefined();
	});
}

describe('env.client', () => {
	registerDefaultValueTest();
	registerBooleanCoercionTest();
	registerModeNormalizationTest();
	registerStringTrimTest();
	registerErrorFallbackTest();
	registerEdgeCaseTests();
});

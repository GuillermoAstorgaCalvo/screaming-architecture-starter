import { describe, expect, it, vi } from 'vitest';

interface EnvShape {
	DEV: boolean;
	PROD: boolean;
	MODE: 'development' | 'production' | 'test';
	ANALYTICS_ENABLED: boolean;
	SPEED_INSIGHTS_ENABLED: boolean;
	GTM_CONTAINER_ID: string | undefined;
	GTM_DEBUG: boolean | undefined;
	GTM_DATALAYER_NAME: string;
	GOOGLE_MAPS_API_KEY: string | undefined;
}

const loadEnvModule = async (overrides: Partial<EnvShape> = {}) => {
	vi.resetModules();
	const defaults: EnvShape = {
		DEV: false,
		PROD: true,
		MODE: 'production',
		ANALYTICS_ENABLED: false,
		SPEED_INSIGHTS_ENABLED: false,
		GTM_CONTAINER_ID: undefined,
		GTM_DEBUG: undefined,
		GTM_DATALAYER_NAME: 'dataLayer',
		GOOGLE_MAPS_API_KEY: undefined,
	};

	vi.doMock('@core/config/env.client', () => ({
		env: { ...defaults, ...overrides },
	}));

	return import('@core/constants/env');
};

describe('env constants', () => {
	it('exposes the current environment snapshot', async () => {
		const module = await loadEnvModule({
			DEV: true,
			PROD: false,
			MODE: 'development',
			ANALYTICS_ENABLED: true,
			SPEED_INSIGHTS_ENABLED: true,
			GTM_CONTAINER_ID: 'GTM-ABC123',
			GTM_DEBUG: true,
			GTM_DATALAYER_NAME: 'customLayer',
		});

		expect(module.IS_DEV).toBe(true);
		expect(module.IS_PROD).toBe(false);
		expect(module.ENV_MODE).toBe('development');
		expect(module.ANALYTICS_ENABLED).toBe(true);
		expect(module.SPEED_INSIGHTS_ENABLED).toBe(true);
		expect(module.GTM_CONTAINER_ID).toBe('GTM-ABC123');
		expect(module.GTM_DEBUG).toBe(true);
		expect(module.GTM_DATALAYER_NAME).toBe('customLayer');
	});

	it('provides helper functions that reflect the current env', async () => {
		const module = await loadEnvModule({
			DEV: false,
			PROD: true,
			MODE: 'production',
			ANALYTICS_ENABLED: false,
			SPEED_INSIGHTS_ENABLED: false,
		});

		expect(module.isDevelopment()).toBe(false);
		expect(module.isProduction()).toBe(true);
		expect(module.getMode()).toBe('production');
		expect(module.isAnalyticsEnabled()).toBe(false);
		expect(module.isSpeedInsightsEnabled()).toBe(false);
	});
});

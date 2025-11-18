import { FEATURE_FLAGS } from '@core/config/featureFlags';
import {
	__resetFeatureFlagsCache,
	getAllFeatureFlags,
	getAllFeatureFlagsAsync,
	isFeatureEnabled,
	isFeatureEnabledAsync,
} from '@core/config/features';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalFetch = globalThis.fetch;

function mockRuntimeConfigResponse(runtimeConfig: Record<string, unknown>) {
	globalThis.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue(runtimeConfig),
	} as unknown as Response);
}

describe('core/config/features', () => {
	beforeEach(() => {
		__resetFeatureFlagsCache();
		__resetRuntimeConfigCache();
		vi.restoreAllMocks();
		globalThis.fetch = originalFetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it('falls back to static definitions when runtime flags are not loaded', () => {
		const result = isFeatureEnabled('EXAMPLE_FEATURE');

		expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
	});

	it('warns and defaults to false when an unknown flag is requested', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = isFeatureEnabled('UNKNOWN_FLAG');

		expect(result).toBe(false);
		expect(warnSpy).toHaveBeenCalledWith('Unknown feature flag: UNKNOWN_FLAG, defaulting to false');
	});

	it('prefers boolean runtime overrides when available', async () => {
		mockRuntimeConfigResponse({
			FEATURE_FLAGS: { EXAMPLE_FEATURE: true },
		});

		await expect(isFeatureEnabledAsync('EXAMPLE_FEATURE')).resolves.toBe(true);
	});

	it('reads runtime overrides provided as FeatureFlag objects', async () => {
		mockRuntimeConfigResponse({
			FEATURE_FLAGS: {
				EXAMPLE_FEATURE: {
					key: 'EXAMPLE_FEATURE',
					description: 'override via runtime object',
					enabled: true,
				},
			},
		});

		await expect(isFeatureEnabledAsync('EXAMPLE_FEATURE')).resolves.toBe(true);
	});

	it('reuses cached runtime flags for synchronous lookups', async () => {
		mockRuntimeConfigResponse({
			FEATURE_FLAGS: { EXAMPLE_FEATURE: true },
		});

		// Populate the runtime cache through the async path
		await isFeatureEnabledAsync('EXAMPLE_FEATURE');

		const flags = getAllFeatureFlags();

		expect(flags.EXAMPLE_FEATURE).toBe(true);
	});

	it('returns current state for every definition even when runtime overrides exist', async () => {
		mockRuntimeConfigResponse({
			FEATURE_FLAGS: { EXAMPLE_FEATURE: true },
		});

		const flags = await getAllFeatureFlagsAsync();

		expect(flags).toMatchObject({
			EXAMPLE_FEATURE: true,
		});
		expect(Object.keys(flags)).toEqual(Object.keys(FEATURE_FLAGS));
	});
});

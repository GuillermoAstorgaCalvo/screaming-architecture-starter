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

// Create a mockable getRuntimeConfig function using hoisted mock
const { mockGetRuntimeConfigRef, useMockFlag } = vi.hoisted(() => {
	const mockFn = vi.fn();
	return {
		mockGetRuntimeConfigRef: { current: mockFn },
		useMockFlag: { current: false },
	};
});

vi.mock('@core/config/runtime', async () => {
	const actual = await vi.importActual('@core/config/runtime');
	return {
		...actual,
		getRuntimeConfig: vi.fn(() => {
			if (useMockFlag.current && mockGetRuntimeConfigRef.current) {
				return mockGetRuntimeConfigRef.current();
			}
			return (actual as { getRuntimeConfig: () => Promise<unknown> }).getRuntimeConfig();
		}),
	};
});

function mockRuntimeConfigResponse(runtimeConfig: Record<string, unknown>) {
	globalThis.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue(runtimeConfig),
	} as unknown as Response);
}

function setupTestEnvironment() {
	__resetFeatureFlagsCache();
	__resetRuntimeConfigCache();
	vi.restoreAllMocks();
	globalThis.fetch = originalFetch;
	mockGetRuntimeConfigRef.current = vi.fn();
	useMockFlag.current = false;
}

function cleanupTestEnvironment() {
	globalThis.fetch = originalFetch;
}

function describeBasicFunctionality() {
	describe('basic functionality', () => {
		it('falls back to static definitions when runtime flags are not loaded', () => {
			const result = isFeatureEnabled('EXAMPLE_FEATURE');

			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
		});

		it('warns and defaults to false when an unknown flag is requested', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const result = isFeatureEnabled('UNKNOWN_FLAG');

			expect(result).toBe(false);
			expect(warnSpy).toHaveBeenCalledWith(
				'Unknown feature flag: UNKNOWN_FLAG, defaulting to false'
			);
		});
	});
}

function describeRuntimeOverrides() {
	describe('runtime overrides', () => {
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
}

function describeRuntimeConfigErrors() {
	describe('runtime config errors and caching', () => {
		it('handles errors when getRuntimeConfig rejects and falls back to defaults', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const runtimeError = new Error('Runtime config load error');

			// Mock getRuntimeConfig to reject to test the error path in loadRuntimeFeatureFlags (lines 38-39)
			mockGetRuntimeConfigRef.current = vi.fn().mockRejectedValue(runtimeError);
			useMockFlag.current = true;

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
			expect(warnSpy).toHaveBeenCalledWith(
				'Failed to load runtime feature flags, using defaults:',
				runtimeError
			);

			warnSpy.mockRestore();
		});

		it('returns cached runtime feature flags immediately when already loaded', async () => {
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: { EXAMPLE_FEATURE: true },
			});

			// First call loads and caches
			const firstResult = await isFeatureEnabledAsync('EXAMPLE_FEATURE');
			expect(firstResult).toBe(true);

			// Create a new mock to track if getRuntimeConfig is called again (line 51 should prevent this)
			const getRuntimeConfigSpy = vi.fn().mockResolvedValue({
				FEATURE_FLAGS: { EXAMPLE_FEATURE: false },
			});
			mockGetRuntimeConfigRef.current = getRuntimeConfigSpy;
			useMockFlag.current = true;

			// Second call should use cache (line 51 path) - getRuntimeConfig should not be called
			const secondResult = await isFeatureEnabledAsync('EXAMPLE_FEATURE');
			expect(secondResult).toBe(true); // Still true from cache, not false from new mock

			// Verify getRuntimeConfig was not called again (cache was used)
			expect(getRuntimeConfigSpy).not.toHaveBeenCalled();
		});
	});
}

function describeInvalidRuntimeFlagObjects() {
	describe('invalid runtime flag objects', () => {
		it('handles runtime feature flag object without valid enabled property by falling back to definition', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: {
					EXAMPLE_FEATURE: {
						key: 'EXAMPLE_FEATURE',
						// Missing enabled property - should fall through to definition
					},
				},
			});

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
			warnSpy.mockRestore();
		});

		it('handles runtime feature flag object with enabled as non-boolean by falling back to definition', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: {
					EXAMPLE_FEATURE: {
						key: 'EXAMPLE_FEATURE',
						enabled: 'true', // String instead of boolean
					},
				},
			});

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
			warnSpy.mockRestore();
		});

		it('handles runtime feature flag object with null enabled by falling back to definition', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: {
					EXAMPLE_FEATURE: {
						key: 'EXAMPLE_FEATURE',
						enabled: null,
					},
				},
			});

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
			warnSpy.mockRestore();
		});

		it('handles runtime feature flag when key exists in runtimeFlags but value is invalid object', async () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: {
					EXAMPLE_FEATURE: {
						// Object without enabled property
						key: 'EXAMPLE_FEATURE',
						description: 'Some description',
					},
				},
			});

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
			warnSpy.mockRestore();
		});
	});
}

function describeMissingRuntimeFlags() {
	describe('missing runtime flags', () => {
		it('handles runtime feature flag when key is not in runtimeFlags', async () => {
			mockRuntimeConfigResponse({
				FEATURE_FLAGS: {
					OTHER_FEATURE: true,
				},
			});

			const result = await isFeatureEnabledAsync('EXAMPLE_FEATURE');

			// Should fall back to definition default since EXAMPLE_FEATURE is not in runtime flags
			expect(result).toBe(FEATURE_FLAGS.EXAMPLE_FEATURE.enabled);
		});
	});
}

function describeErrorHandling() {
	describe('error handling and edge cases', () => {
		describeRuntimeConfigErrors();
		describeInvalidRuntimeFlagObjects();
		describeMissingRuntimeFlags();
	});
}

describe('core/config/features', () => {
	beforeEach(setupTestEnvironment);
	afterEach(cleanupTestEnvironment);

	describeBasicFunctionality();
	describeRuntimeOverrides();
	describeErrorHandling();
});

import {
	FEATURE_FLAGS,
	getAllFeatureFlagDefinitions,
	getFeatureFlagDefinition,
	validateFeatureFlags,
} from '@core/config/featureFlags';
import { describe, expect, it } from 'vitest';

describe('getFeatureFlagDefinition', () => {
	it('returns the registered definition for a known key', () => {
		const definition = getFeatureFlagDefinition('EXAMPLE_FEATURE');

		expect(definition).toEqual(FEATURE_FLAGS.EXAMPLE_FEATURE);
	});

	it('returns undefined for unknown feature flags', () => {
		expect(getFeatureFlagDefinition('UNKNOWN_FLAG')).toBeUndefined();
	});
});

describe('getAllFeatureFlagDefinitions', () => {
	it('returns all registered feature flags', () => {
		expect(getAllFeatureFlagDefinitions()).toEqual(FEATURE_FLAGS);
	});
});

describe('validateFeatureFlags - valid inputs', () => {
	it('accepts simple boolean-based feature toggles', () => {
		const toggles = {
			DARK_MODE: true,
			BETA_DASHBOARD: false,
		};

		const result = validateFeatureFlags(toggles);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(toggles);
	});

	it('accepts metadata-rich definitions with runtime overrides', () => {
		const runtimeFlags = {
			EXAMPLE_FEATURE: {
				...FEATURE_FLAGS.EXAMPLE_FEATURE,
				enabled: true,
			},
			NEW_ONBOARDING: {
				key: 'NEW_ONBOARDING',
				description: 'Controls the onboarding flow',
				defaultValue: false,
				enabled: true,
			},
		};

		const result = validateFeatureFlags(runtimeFlags);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(runtimeFlags);
	});

	it('accepts definitions that rely on default values', () => {
		const flags = {
			PERSISTED_DEFAULT: {
				key: 'PERSISTED_DEFAULT',
				defaultValue: true,
				enabled: false,
			},
		};

		const result = validateFeatureFlags(flags);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(flags);
	});
});

describe('validateFeatureFlags - invalid inputs', () => {
	it('rejects definitions missing the enabled flag', () => {
		const invalidFlags = {
			INVALID_FLAG: {
				key: 'INVALID_FLAG',
				defaultValue: true,
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['INVALID_FLAG']);
	});

	it('rejects definitions with empty keys', () => {
		const invalidFlags = {
			EMPTY_KEY_FLAG: {
				key: '',
				enabled: true,
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['EMPTY_KEY_FLAG', 'key']);
	});
});

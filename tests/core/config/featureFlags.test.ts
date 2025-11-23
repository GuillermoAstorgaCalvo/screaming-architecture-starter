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

describe('validateFeatureFlags - basic valid inputs', () => {
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

describe('validateFeatureFlags - complex valid inputs', () => {
	it('accepts mixed boolean and FeatureFlag object values', () => {
		const mixedFlags = {
			SIMPLE_BOOLEAN: true,
			COMPLEX_FLAG: {
				key: 'COMPLEX_FLAG',
				description: 'A complex flag',
				enabled: false,
			},
		};

		const result = validateFeatureFlags(mixedFlags);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mixedFlags);
	});

	it('accepts FeatureFlag object with only required fields', () => {
		const minimalFlag = {
			MINIMAL_FLAG: {
				key: 'MINIMAL_FLAG',
				enabled: true,
			},
		};

		const result = validateFeatureFlags(minimalFlag);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(minimalFlag);
	});

	it('accepts FeatureFlag object with description', () => {
		const flagWithDescription = {
			DESCRIBED_FLAG: {
				key: 'DESCRIBED_FLAG',
				description: 'This flag has a description',
				enabled: true,
			},
		};

		const result = validateFeatureFlags(flagWithDescription);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(flagWithDescription);
	});
});

describe('validateFeatureFlags - missing required fields', () => {
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

	it('rejects FeatureFlag object with missing key', () => {
		const invalidFlags = {
			MISSING_KEY: {
				enabled: true,
				// Missing key property
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		// Zod union validation reports error at the flag level, not nested property
		expect(result.error?.issues[0]?.path).toEqual(['MISSING_KEY']);
	});
});

describe('validateFeatureFlags - invalid types', () => {
	it('rejects definitions with non-boolean enabled value', () => {
		const invalidFlags = {
			INVALID_ENABLED: {
				key: 'INVALID_ENABLED',
				enabled: 'true', // String instead of boolean
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		// Zod union validation reports error at the flag level, not nested property
		expect(result.error?.issues[0]?.path).toEqual(['INVALID_ENABLED']);
	});

	it('rejects definitions with non-string key', () => {
		const invalidFlags = {
			INVALID_KEY: {
				key: 123, // Number instead of string
				enabled: true,
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		// Zod union validation reports error at the flag level, not nested property
		expect(result.error?.issues[0]?.path).toEqual(['INVALID_KEY']);
	});

	it('rejects non-boolean and non-object values', () => {
		const invalidFlags = {
			INVALID_TYPE: 'not-a-boolean-or-object',
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['INVALID_TYPE']);
	});

	it('rejects null values', () => {
		const invalidFlags = {
			NULL_FLAG: null,
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['NULL_FLAG']);
	});

	it('rejects undefined values', () => {
		const invalidFlags = {
			UNDEFINED_FLAG: undefined,
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['UNDEFINED_FLAG']);
	});
});

describe('validateFeatureFlags - invalid optional fields', () => {
	it('rejects FeatureFlag object with non-string description', () => {
		const invalidFlags = {
			INVALID_DESCRIPTION: {
				key: 'INVALID_DESCRIPTION',
				description: 123, // Number instead of string
				enabled: true,
			},
		};

		const result = validateFeatureFlags(invalidFlags);

		expect(result.success).toBe(false);
		// Zod union validation reports error at the flag level, not nested property
		expect(result.error?.issues[0]?.path).toEqual(['INVALID_DESCRIPTION']);
	});
});

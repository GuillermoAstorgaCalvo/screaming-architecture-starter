/**
 * Feature flag definitions
 * Central registry of all feature flags with their metadata and default values
 *
 * Feature flags enable gradual rollout, A/B testing, and safe feature toggling.
 * Use feature flags to control feature visibility without code deployments.
 *
 * See: .cursor/rules/config/feature-flags.mdc
 */

import type { FeatureFlag } from '@src-types/config';
import { z } from 'zod';

/**
 * Feature flag definition schema
 * Validates feature flag structure
 */
const featureFlagSchema = z.object({
	/** Feature flag key/identifier */
	key: z.string().min(1),
	/** Feature flag description */
	description: z.string().optional(),
	/** Default value if not set (deprecated - use enabled instead, kept for backwards compatibility) */
	defaultValue: z.boolean().optional(),
	/** Whether the feature flag is enabled - this is the source of truth */
	enabled: z.boolean(),
});

/**
 * Feature flags registry schema
 * Supports both simple boolean values and full FeatureFlag objects
 */
const featureFlagsSchema = z.record(z.string(), z.union([z.boolean(), featureFlagSchema]));

/**
 * Feature flag definitions
 * Add new feature flags here with their metadata and default values
 *
 * Default values should be safe (typically false) to prevent accidental exposure
 */
export const FEATURE_FLAGS = {
	/**
	 * Example feature flag - demonstrates the structure
	 * Remove or replace with actual feature flags
	 */
	EXAMPLE_FEATURE: {
		key: 'EXAMPLE_FEATURE',
		description: 'Example feature flag for demonstration purposes',
		enabled: false,
	},
} as const satisfies Record<string, FeatureFlag>;

/**
 * Type for feature flag keys
 * Derived from the FEATURE_FLAGS registry
 */
export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Get a feature flag definition by key
 *
 * @param key - Feature flag key
 * @returns Feature flag definition or undefined if not found
 */
export function getFeatureFlagDefinition(key: string): FeatureFlag | undefined {
	return FEATURE_FLAGS[key as FeatureFlagKey];
}

/**
 * Get all feature flag definitions
 *
 * @returns Object containing all feature flag definitions
 */
export function getAllFeatureFlagDefinitions(): Record<string, FeatureFlag> {
	return FEATURE_FLAGS as Record<string, FeatureFlag>;
}

/**
 * Validate feature flags configuration
 * Ensures feature flags match the expected schema
 *
 * @param flags - Feature flags to validate
 * @returns Validation result with success status and data/error
 */
export function validateFeatureFlags(flags: unknown) {
	return featureFlagsSchema.safeParse(flags);
}

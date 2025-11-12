/**
 * Feature flags runtime toggles
 * Provides runtime access to feature flag states with support for runtime config overrides
 *
 * Feature flags can be:
 * - Defined in featureFlags.ts with default values
 * - Overridden via runtime-config.json at runtime
 * - Checked throughout the application using the isFeatureEnabled() function
 *
 * See: .cursor/rules/config/feature-flags.mdc
 */

import type { FeatureFlags } from '@src-types/config';

import { getAllFeatureFlagDefinitions } from './featureFlags';
import { getRuntimeConfig } from './runtime';

/**
 * Runtime feature flags cache
 * Stores feature flags loaded from runtime config
 */
let runtimeFeatureFlags: FeatureFlags | null = null;
let runtimeFeatureFlagsPromise: Promise<FeatureFlags> | null = null;

/**
 * Load feature flags from runtime config
 * Extracts FEATURE_FLAGS from runtime-config.json if present
 *
 * @returns Promise resolving to runtime feature flags or empty object
 */
async function loadRuntimeFeatureFlags(): Promise<FeatureFlags> {
	try {
		const runtimeConfig = await getRuntimeConfig();
		// Runtime config may contain FEATURE_FLAGS key (now properly typed in schema)
		const flags = runtimeConfig.FEATURE_FLAGS;
		return flags ?? {};
	} catch (error) {
		console.warn('Failed to load runtime feature flags, using defaults:', error);
		return {};
	}
}

/**
 * Get runtime feature flags
 * Loads from runtime config on first call, caches result
 *
 * @returns Promise resolving to runtime feature flags
 */
async function getRuntimeFeatureFlags(): Promise<FeatureFlags> {
	if (runtimeFeatureFlags !== null) {
		return runtimeFeatureFlags;
	}

	runtimeFeatureFlagsPromise ??= loadRuntimeFeatureFlags().then(flags => {
		runtimeFeatureFlags = flags;
		return flags;
	});

	return runtimeFeatureFlagsPromise;
}

/**
 * Get cached runtime feature flags synchronously
 * Returns null if not yet loaded
 *
 * @returns Cached runtime feature flags or null
 */
function getCachedRuntimeFeatureFlags(): FeatureFlags | null {
	return runtimeFeatureFlags;
}

/**
 * Resolve feature flag value
 * Checks runtime config first, then falls back to definition defaults
 *
 * @param key - Feature flag key
 * @param runtimeFlags - Runtime feature flags (optional, will load if not provided)
 * @returns Whether the feature flag is enabled
 */
function resolveFeatureFlagValue(key: string, runtimeFlags?: FeatureFlags): boolean {
	// Check runtime flags first (highest priority)
	if (runtimeFlags && key in runtimeFlags) {
		const runtimeValue = runtimeFlags[key];
		// Support both boolean and FeatureFlag object
		if (typeof runtimeValue === 'boolean') {
			return runtimeValue;
		}
		if (
			runtimeValue &&
			typeof runtimeValue === 'object' &&
			'enabled' in runtimeValue &&
			typeof runtimeValue.enabled === 'boolean'
		) {
			return runtimeValue.enabled;
		}
		// If runtime value is an object but doesn't have valid enabled property, fall through to definition
	}

	// Fall back to definition default
	const definition = getAllFeatureFlagDefinitions()[key];
	if (definition) {
		// Use enabled as the source of truth for feature flag state
		// defaultValue exists in the type for backwards compatibility but is not used in resolution
		return definition.enabled;
	}

	// Unknown flag - default to false (safe default)
	console.warn(`Unknown feature flag: ${key}, defaulting to false`);
	return false;
}

/**
 * Check if a feature is enabled
 * Synchronous version that uses cached runtime config if available
 *
 * @param key - Feature flag key
 * @returns Whether the feature flag is enabled
 *
 * @example
 * ```ts
 * import { isFeatureEnabled } from '@core/config/features';
 *
 * if (isFeatureEnabled('EXAMPLE_FEATURE')) {
 *   // Feature is enabled
 * }
 * ```
 */
export function isFeatureEnabled(key: string): boolean {
	const cachedRuntimeFlags = getCachedRuntimeFeatureFlags();
	return resolveFeatureFlagValue(key, cachedRuntimeFlags ?? undefined);
}

/**
 * Check if a feature is enabled (async)
 * Loads runtime config if not yet cached
 *
 * @param key - Feature flag key
 * @returns Promise resolving to whether the feature flag is enabled
 *
 * @example
 * ```ts
 * import { isFeatureEnabledAsync } from '@core/config/features';
 *
 * const enabled = await isFeatureEnabledAsync('EXAMPLE_FEATURE');
 * if (enabled) {
 *   // Feature is enabled
 * }
 * ```
 */
export async function isFeatureEnabledAsync(key: string): Promise<boolean> {
	const runtimeFlags = await getRuntimeFeatureFlags();
	return resolveFeatureFlagValue(key, runtimeFlags);
}

/**
 * Get all feature flags with their current states
 * Synchronous version that uses cached runtime config if available
 *
 * @returns Object mapping feature flag keys to their enabled states
 */
export function getAllFeatureFlags(): Record<string, boolean> {
	const cachedRuntimeFlags = getCachedRuntimeFeatureFlags();
	const definitions = getAllFeatureFlagDefinitions();
	const result: Record<string, boolean> = {};

	for (const key in definitions) {
		result[key] = resolveFeatureFlagValue(key, cachedRuntimeFlags ?? undefined);
	}

	return result;
}

/**
 * Get all feature flags with their current states (async)
 * Loads runtime config if not yet cached
 *
 * @returns Promise resolving to object mapping feature flag keys to their enabled states
 */
export async function getAllFeatureFlagsAsync(): Promise<Record<string, boolean>> {
	const runtimeFlags = await getRuntimeFeatureFlags();
	const definitions = getAllFeatureFlagDefinitions();
	const result: Record<string, boolean> = {};

	for (const key in definitions) {
		result[key] = resolveFeatureFlagValue(key, runtimeFlags);
	}

	return result;
}

/**
 * Reset feature flags cache
 * Only exported for testing purposes
 * @internal
 */
export function __resetFeatureFlagsCache(): void {
	runtimeFeatureFlags = null;
	runtimeFeatureFlagsPromise = null;
}

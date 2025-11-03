/**
 * Runtime configuration loader
 * Loads configuration from public/runtime-config.json and merges with build-time env
 *
 * This allows changing configuration values without rebuilding the application.
 * Runtime config is loaded on app startup and takes precedence over build-time env.
 *
 * See: .cursor/rules/config/config.mdc
 */

import { z } from 'zod';

import { type Env, env } from './env.client';

/**
 * Runtime configuration schema (Zod)
 * Validates runtime config structure and types
 */
const runtimeConfigSchema = z
	.object({
		/**
		 * API base URL for all HTTP requests
		 * If not provided, requests must use full URLs or baseURL must be set per-request
		 */
		API_BASE_URL: z.preprocess(
			val => {
				// Transform null or empty string to undefined
				if (val === null || val === '') return undefined;
				return val;
			},
			z
				.string()
				.refine(
					val => {
						try {
							new URL(val);
							return true;
						} catch {
							return false;
						}
					},
					{ message: 'API_BASE_URL must be a valid URL' }
				)
				.optional()
		),

		/**
		 * Analytics write key
		 * Optional analytics tracking identifier
		 */
		ANALYTICS_WRITE_KEY: z.preprocess(val => {
			// Transform null or empty string to undefined
			if (val === null || val === '') return undefined;
			return val;
		}, z.string().optional()),

		/**
		 * Additional runtime configuration keys
		 * Allows for flexible extension while maintaining type safety for known keys
		 */
	})
	.catchall(z.unknown());

/**
 * Runtime configuration type
 * Derived from Zod schema for type safety
 */
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;

/**
 * Merged configuration combining build-time env and runtime config
 */
export type AppConfig = Env & {
	runtime: RuntimeConfig;
};

/**
 * Default runtime configuration (empty)
 */
const defaultRuntimeConfig: RuntimeConfig = {};

/**
 * Load runtime configuration from public/runtime-config.json
 * Returns empty config if file doesn't exist or fails to load
 * Validates config structure using Zod schema
 */
async function loadRuntimeConfig(): Promise<RuntimeConfig> {
	try {
		const response = await fetch('/runtime-config.json');
		if (!response.ok) {
			// File doesn't exist or server error - use defaults
			return defaultRuntimeConfig;
		}

		const rawConfig = (await response.json()) as unknown;

		// Validate config structure with Zod schema
		const parseResult = runtimeConfigSchema.safeParse(rawConfig);
		if (parseResult.success) {
			return parseResult.data;
		}

		console.warn('Runtime config validation failed, using defaults:', parseResult.error);
		return defaultRuntimeConfig;
	} catch (error) {
		// Network error or invalid JSON - use defaults
		console.warn('Failed to load runtime config, using defaults:', error);
		return defaultRuntimeConfig;
	}
}

/**
 * Global runtime config state
 * Loaded once on first access
 */
let runtimeConfigPromise: Promise<RuntimeConfig> | null = null;
let cachedRuntimeConfig: RuntimeConfig | null = null;

/**
 * Get runtime configuration
 * Loads from public/runtime-config.json on first call, caches result
 *
 * @returns Promise resolving to runtime configuration
 */
export async function getRuntimeConfig(): Promise<RuntimeConfig> {
	if (cachedRuntimeConfig !== null) {
		return cachedRuntimeConfig;
	}

	runtimeConfigPromise ??= loadRuntimeConfig().then(config => {
		cachedRuntimeConfig = config;
		return config;
	});

	return runtimeConfigPromise;
}

/**
 * Get merged application configuration
 * Combines build-time env with runtime config
 *
 * @returns Promise resolving to merged configuration
 */
export async function getAppConfig(): Promise<AppConfig> {
	const runtime = await getRuntimeConfig();
	return {
		...env,
		runtime,
	};
}

/**
 * Synchronously get cached runtime config
 * Returns null if not yet loaded, otherwise returns cached config
 * Use getRuntimeConfig() for async loading
 *
 * @returns Cached runtime config or null
 */
export function getCachedRuntimeConfig(): RuntimeConfig | null {
	return cachedRuntimeConfig;
}

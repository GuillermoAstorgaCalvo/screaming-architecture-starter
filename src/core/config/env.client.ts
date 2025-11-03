import { z } from 'zod';

/**
 * Client-safe environment configuration
 * Validates and exposes environment variables with sensible defaults
 * Forbid direct import.meta.env access elsewhere; use this module instead
 * See: .cursor/rules/config/config.mdc
 */

const envSchema = z.object({
	/**
	 * Development mode flag (Vite)
	 * true in dev server, false in production builds
	 */
	DEV: z
		.preprocess(val => {
			if (typeof val === 'boolean') return val;
			if (typeof val === 'string') return val === 'true';
			return false;
		}, z.boolean())
		.default(false),

	/**
	 * Production mode flag (Vite)
	 * true in production builds, false in dev server
	 */
	PROD: z
		.preprocess(val => {
			if (typeof val === 'boolean') return val;
			if (typeof val === 'string') return val === 'true';
			return true;
		}, z.boolean())
		.default(true),

	/**
	 * Mode: 'development' | 'production'
	 */
	MODE: z
		.preprocess(
			val => {
				if (typeof val === 'string') {
					const normalized = val.toLowerCase().trim();
					if (normalized === 'development' || normalized === 'production') {
						return normalized;
					}
				}
				return 'production'; // Return default instead of undefined
			},
			z.enum(['development', 'production'])
		)
		.default('production'),
});

/**
 * Parse and validate environment variables
 * Uses safe defaults if values are missing
 */
function parseEnv() {
	try {
		return envSchema.parse({
			DEV: import.meta.env.DEV,
			PROD: import.meta.env.PROD,
			MODE: import.meta.env.MODE,
		});
	} catch (error) {
		console.warn('Failed to parse environment variables, using defaults:', error);
		return envSchema.parse({});
	}
}

/**
 * Client-safe environment configuration
 * All environment variable access should go through this export
 */
export const env = parseEnv();

/**
 * Type for the validated environment configuration
 */
export type Env = typeof env;

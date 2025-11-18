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
	 * Mode: 'development' | 'production' | 'test'
	 */
	MODE: z
		.preprocess(
			val => {
				if (typeof val === 'string') {
					const normalized = val.toLowerCase().trim();
					if (
						normalized === 'development' ||
						normalized === 'production' ||
						normalized === 'test'
					) {
						return normalized;
					}
				}
				return 'production'; // Return default instead of undefined
			},
			z.enum(['development', 'production', 'test'])
		)
		.default('production'),

	/**
	 * Analytics enable flag
	 * Controls whether analytics instrumentation should run
	 */
	ANALYTICS_ENABLED: z
		.preprocess(val => {
			if (typeof val === 'boolean') return val;
			if (typeof val === 'string') return val.toLowerCase().trim() === 'true';
			return false;
		}, z.boolean())
		.default(false),

	/**
	 * Vercel Speed Insights enable flag
	 * Allows opting into the client-side script per environment
	 */
	SPEED_INSIGHTS_ENABLED: z
		.preprocess(val => {
			if (typeof val === 'boolean') return val;
			if (typeof val === 'string') return val.toLowerCase().trim() === 'true';
			return false;
		}, z.boolean())
		.default(false),

	/**
	 * Google Tag Manager container ID fallback
	 * Used when runtime configuration does not provide one
	 */
	GTM_CONTAINER_ID: z
		.preprocess(val => {
			if (typeof val === 'string') {
				const trimmed = val.trim();
				return trimmed.length > 0 ? trimmed : undefined;
			}
			return undefined;
		}, z.string().optional())
		.optional(),

	/**
	 * Google Tag Manager debug flag override
	 * Defaults to false; set to true to enable GTM debug mode regardless of DEV
	 */
	GTM_DEBUG: z
		.preprocess(val => {
			if (typeof val === 'boolean') return val;
			if (typeof val === 'string') return val.toLowerCase().trim() === 'true';
			return undefined;
		}, z.boolean().optional())
		.optional(),

	/**
	 * Google Tag Manager data layer name override
	 * Defaults to 'dataLayer'
	 */
	GTM_DATALAYER_NAME: z.preprocess(val => {
		if (typeof val === 'string') {
			const trimmed = val.trim();
			return trimmed.length > 0 ? trimmed : undefined;
		}
		return undefined;
	}, z.string().default('dataLayer')),

	/**
	 * Google Maps API key
	 * Required for Google Maps functionality
	 */
	GOOGLE_MAPS_API_KEY: z.preprocess(val => {
		if (typeof val === 'string') {
			const trimmed = val.trim();
			return trimmed.length > 0 ? trimmed : undefined;
		}
		return undefined;
	}, z.string().optional()),
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
			ANALYTICS_ENABLED: import.meta.env['VITE_ANALYTICS_ENABLED'],
			SPEED_INSIGHTS_ENABLED: import.meta.env['VITE_SPEED_INSIGHTS_ENABLED'],
			GTM_CONTAINER_ID: import.meta.env['VITE_GTM_CONTAINER_ID'],
			GTM_DEBUG: import.meta.env['VITE_GTM_DEBUG'],
			GTM_DATALAYER_NAME: import.meta.env['VITE_GTM_DATALAYER_NAME'],
			GOOGLE_MAPS_API_KEY: import.meta.env['VITE_GOOGLE_MAPS_API_KEY'],
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

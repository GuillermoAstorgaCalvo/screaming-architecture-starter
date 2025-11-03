/**
 * Environment-derived constants
 * Thin wrapper around env surface that applies defaults and provides convenience accessors
 *
 * This module avoids re-parsing env elsewhere by providing pre-computed constants
 * that read from the validated env surface.
 *
 * See: .cursor/rules/config/config.mdc
 */

import { env } from '@core/config/env.client';

/**
 * Check if running in development mode
 */
export const IS_DEV = env.DEV;

/**
 * Check if running in production mode
 */
export const IS_PROD = env.PROD;

/**
 * Current environment mode
 */
export const ENV_MODE = env.MODE;

/**
 * Check if running in development server (DEV mode)
 * Convenience alias for env.DEV
 */
export const isDevelopment = (): boolean => env.DEV;

/**
 * Check if running in production build (PROD mode)
 * Convenience alias for env.PROD
 */
export const isProduction = (): boolean => env.PROD;

/**
 * Get current mode string
 * Convenience alias for env.MODE
 */
export const getMode = (): 'development' | 'production' => env.MODE;

/**
 * Type for validated environment configuration
 * Re-exported from env.client.ts for convenience
 */
export type { Env } from '@core/config/env.client';

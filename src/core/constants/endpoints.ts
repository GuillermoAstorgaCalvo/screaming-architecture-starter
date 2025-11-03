/**
 * API endpoint constants
 * Central source of truth for API endpoint paths
 * Avoid hardcoding endpoint paths elsewhere
 *
 * Note: These are endpoint paths, not full URLs.
 * Combine with API_BASE_URL from runtime config or set baseURL in httpClient.
 *
 * See: .cursor/rules/config/config.mdc
 */

import { getCachedRuntimeConfig } from '@core/config/runtime';

/**
 * API endpoint paths organized by domain/resource
 * All endpoints are relative paths that should be combined with baseURL
 *
 * Currently empty - add endpoints as needed for your API.
 * Example structure:
 * ```ts
 * export const API_ENDPOINTS = {
 *   health: '/health',
 *   users: {
 *     list: '/users',
 *     detail: (id: string) => `/users/${id}`,
 *     create: '/users',
 *     update: (id: string) => `/users/${id}`,
 *     delete: (id: string) => `/users/${id}`,
 *   },
 * } as const;
 * ```
 */
export const API_ENDPOINTS = {} as const;

/**
 * Type for API endpoints
 * Note: When API_ENDPOINTS is empty, this will be Record<string, never>
 * Update the type as endpoints are added
 */
export type ApiEndpoints = typeof API_ENDPOINTS;

/**
 * Helper function to build full API URL from endpoint path
 * Automatically uses cached runtime config API_BASE_URL if available,
 * otherwise returns path as-is
 *
 * @param endpoint - Endpoint path or function that returns a path
 * @param runtimeConfig - Optional runtime config override (defaults to cached config)
 * @returns Full URL or relative path
 *
 * @example
 * ```ts
 * // Automatically uses cached runtime config
 * const url = buildApiUrl(API_ENDPOINTS.users.list);
 * // Returns: 'https://api.example.com/users' if API_BASE_URL is set in runtime config
 * // Returns: '/users' if API_BASE_URL is not set
 *
 * // Or provide explicit config
 * const url = buildApiUrl(API_ENDPOINTS.users.list, { API_BASE_URL: 'https://custom.api.com' });
 * ```
 */
export function buildApiUrl(
	endpoint: string | ((...args: unknown[]) => string),
	runtimeConfig?: { API_BASE_URL?: string },
	...args: unknown[]
): string {
	const path = typeof endpoint === 'function' ? endpoint(...args) : endpoint;

	// Use provided config or fall back to cached runtime config
	const config = runtimeConfig ?? getCachedRuntimeConfig();
	const baseURL = config?.API_BASE_URL;

	if (!baseURL) {
		return path;
	}

	const baseTrimmed = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
	const pathTrimmed = path.startsWith('/') ? path : `/${path}`;
	return `${baseTrimmed}${pathTrimmed}`;
}

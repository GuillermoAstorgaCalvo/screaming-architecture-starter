/**
 * Global route path constants
 * Central source of truth for route paths
 * Avoid hardcoding route strings elsewhere
 */

export const ROUTES = {
	HOME: '/',
} as const;

/**
 * Type for route paths
 */
export type Routes = typeof ROUTES;

/**
 * Type for individual route keys
 */
export type RouteKey = keyof typeof ROUTES;

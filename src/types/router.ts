import type { ReactNode } from 'react';
/**
 * Router and navigation types
 *
 * Types for routing, navigation, route parameters, and navigation state
 * used across the application.
 */

/**
 * Route parameters (dynamic route segments)
 */
export type RouteParams = Record<string, string | undefined>;

/**
 * Query parameters
 */
export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Route location state
 */
export type LocationState = Record<string, unknown>;

/**
 * Route object
 */
export interface Route {
	/** Route path */
	path: string;
	/** Route name/identifier */
	name?: string;
	/** Route metadata */
	meta?: RouteMeta;
	/** Route parameters */
	params?: RouteParams;
	/** Query parameters */
	query?: QueryParams;
	/** Route component */
	component?: unknown;
	/** Child routes */
	children?: Route[];
}

/**
 * Route metadata
 */
export interface RouteMeta {
	/** Route title */
	title?: string;
	/** Route description */
	description?: string;
	/** Whether authentication is required */
	requiresAuth?: boolean;
	/** Required permissions */
	permissions?: string[];
	/** Required roles */
	roles?: string[];
	/** Whether route should be indexed by search engines */
	indexable?: boolean;
	/** Custom metadata */
	[key: string]: unknown;
}

/**
 * Navigation options
 */
export interface NavigationOptions {
	/** Whether to replace current history entry */
	replace?: boolean;
	/** State to pass to the route */
	state?: LocationState;
	/** Whether to reload the page */
	reload?: boolean;
}

/**
 * Navigation result
 */
export interface NavigationResult {
	/** Whether navigation was successful */
	success: boolean;
	/** Error if navigation failed */
	error?: Error;
}

/**
 * Router link props (base props for navigation links in router context)
 *
 * Note: For UI component Link, use LinkProps from @src-types/ui/navigation
 * This type is for router-level link configuration.
 */
export interface RouterLinkProps {
	/** Link destination */
	to: string;
	/** Link text */
	children?: ReactNode;
	/** Whether link is active */
	isActive?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Navigation options */
	navigationOptions?: NavigationOptions;
}

/**
 * Router context value
 */
export interface RouterContextValue {
	/** Current route */
	currentRoute?: Route;
	/** Current route path */
	pathname: string;
	/** Query parameters */
	query: QueryParams;
	/** Route parameters */
	params: RouteParams;
	/** Navigate to a route */
	navigate: (to: string, options?: NavigationOptions) => Promise<NavigationResult>;
	/** Navigate back in history */
	goBack: () => void;
	/** Navigate forward in history */
	goForward: () => void;
	/** Check if a route is active */
	isActive: (path: string) => boolean;
}

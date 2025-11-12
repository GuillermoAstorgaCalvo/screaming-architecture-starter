/**
 * AnalyticsPort - Interface for application analytics tracking
 *
 * Hexagonal architecture port: defines the contract for analytics operations.
 * Infrastructure adapters implement this interface, while domains/app code
 * depend only on the port. This enables swapping analytics providers without
 * touching feature code and keeps tracking logic testable.
 */

/**
 * Analytics initialization configuration
 */
export interface AnalyticsInitOptions {
	/**
	 * Unique analytics write key or measurement ID (service-specific)
	 */
	writeKey?: string;

	/**
	 * Data layer name used by tag managers (if applicable)
	 */
	dataLayerName?: string;

	/**
	 * Enable additional debugging output (implementation-specific)
	 */
	debug?: boolean;
}

/**
 * Analytics event payload
 */
export type AnalyticsEventPayload = Record<string, unknown>;

/**
 * Analytics event definition
 */
export interface AnalyticsEvent {
	name: string;
	params?: AnalyticsEventPayload;
}

/**
 * Analytics page view payload
 */
export interface AnalyticsPageView {
	path: string;
	title?: string;
	location?: string;
}

/**
 * Analytics user identity information
 */
export interface AnalyticsIdentity {
	userId?: string;
	traits?: Record<string, unknown>;
}

/**
 * Analytics user properties
 */
export type AnalyticsUserProperties = Record<string, unknown>;

/**
 * AnalyticsPort - Contract for analytics tracking adapters
 */
export interface AnalyticsPort {
	/**
	 * Initialize analytics provider
	 */
	initialize?(options: AnalyticsInitOptions): Promise<void> | void;

	/**
	 * Track a page view
	 */
	trackPageView(page: AnalyticsPageView): void;

	/**
	 * Track a custom event
	 */
	trackEvent(event: AnalyticsEvent): void;

	/**
	 * Identify a user
	 */
	identify(identity: AnalyticsIdentity): void;

	/**
	 * Set user-level properties
	 */
	setUserProperties(properties: AnalyticsUserProperties): void;

	/**
	 * Reset analytics state (e.g., on logout)
	 */
	reset?(options?: Record<string, unknown>): void;
}

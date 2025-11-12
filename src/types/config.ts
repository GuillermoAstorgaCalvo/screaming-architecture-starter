/**
 * Configuration types
 *
 * Types for application configuration, environment variables, runtime config,
 * and feature flags used across the application.
 */

/**
 * Feature flag definition
 */
export interface FeatureFlag {
	/** Feature flag key/identifier */
	key: string;
	/** Feature flag description */
	description?: string;
	/** Default value if not set */
	defaultValue?: boolean;
	/** Whether the feature flag is enabled */
	enabled: boolean;
}

/**
 * Feature flags configuration
 */
export type FeatureFlags = Record<string, boolean | FeatureFlag>;

/**
 * Configuration option with default value
 */
export interface ConfigOption<T> {
	/** Configuration key */
	key: string;
	/** Default value */
	defaultValue: T;
	/** Whether the option is required */
	required?: boolean;
	/** Configuration description */
	description?: string;
}

/**
 * Configuration validation error
 */
export interface ConfigValidationError {
	/** Configuration key that failed validation */
	key: string;
	/** Error message */
	message: string;
	/** Expected type or value */
	expected?: string;
	/** Actual value that failed validation */
	actual?: unknown;
}

/**
 * Configuration loader options
 */
export interface ConfigLoaderOptions {
	/** Whether to validate configuration */
	validate?: boolean;
	/** Whether to throw on validation errors */
	throwOnError?: boolean;
	/** Custom validation function */
	validator?: (config: unknown) => ConfigValidationError[] | null;
}

/**
 * Environment variable type
 */
export type EnvVar = string | number | boolean | undefined;

/**
 * Environment variables record
 */
export type EnvVars = Record<string, EnvVar>;

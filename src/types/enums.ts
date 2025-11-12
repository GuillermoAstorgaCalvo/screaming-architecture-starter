/**
 * Common enums used across the application
 *
 * Centralized enum-like definitions using const objects for values that are used
 * across multiple domains or are part of the core application structure.
 *
 * Using const objects instead of enums for better tree-shaking and compatibility
 * with 'erasableSyntaxOnly' TypeScript setting.
 */

/**
 * Application environment
 */
export const AppEnvironment = {
	Development: 'development',
	Staging: 'staging',
	Production: 'production',
	Test: 'test',
} as const;

export type AppEnvironmentType = (typeof AppEnvironment)[keyof typeof AppEnvironment];

/**
 * Theme mode
 */
export const ThemeMode = {
	Light: 'light',
	Dark: 'dark',
	System: 'system',
} as const;

export type ThemeModeType = (typeof ThemeMode)[keyof typeof ThemeMode];

/**
 * HTTP status code categories
 * Note: LogLevel is exported from @core/ports/LoggerPort
 */
export const HttpStatusCategory = {
	Success: 'success',
	ClientError: 'clientError',
	ServerError: 'serverError',
	Unknown: 'unknown',
} as const;

export type HttpStatusCategoryType = (typeof HttpStatusCategory)[keyof typeof HttpStatusCategory];

/**
 * Storage type
 */
export const StorageType = {
	LocalStorage: 'localStorage',
	SessionStorage: 'sessionStorage',
	Cookie: 'cookie',
	Memory: 'memory',
} as const;

export type StorageTypeType = (typeof StorageType)[keyof typeof StorageType];

/**
 * Async operation status
 */
export const AsyncStatus = {
	Idle: 'idle',
	Loading: 'loading',
	Success: 'success',
	Error: 'error',
} as const;

export type AsyncStatusType = (typeof AsyncStatus)[keyof typeof AsyncStatus];

/**
 * Form validation status
 */
export const ValidationStatus = {
	Valid: 'valid',
	Invalid: 'invalid',
	Pending: 'pending',
} as const;

export type ValidationStatusType = (typeof ValidationStatus)[keyof typeof ValidationStatus];

/**
 * UI component state
 */
export const ComponentState = {
	Default: 'default',
	Loading: 'loading',
	Disabled: 'disabled',
	Error: 'error',
	Success: 'success',
} as const;

export type ComponentStateType = (typeof ComponentState)[keyof typeof ComponentState];

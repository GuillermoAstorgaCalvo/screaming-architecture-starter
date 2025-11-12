/**
 * Hook-related types
 *
 * Centralized type definitions for custom hooks used across the application.
 */

/**
 * Generic hook return type with loading state
 */
export interface UseLoadingState<T> {
	/** The data, or null if not yet loaded or on error */
	data: T | null;
	/** The error, or null if no error */
	error: Error | string | null;
	/** Whether the operation is currently loading */
	loading: boolean;
	/** Reset the hook state */
	reset: () => void;
}

/**
 * Generic hook return type with async operation
 */
export interface UseAsyncOperation<T> {
	/** Execute the async operation */
	execute: () => Promise<void> | Promise<T>;
	/** Reset the hook state */
	reset: () => void;
}

/**
 * Combined async hook return type
 */
export interface UseAsyncState<T> extends UseLoadingState<T>, UseAsyncOperation<T> {}

/**
 * Hook options with dependency tracking
 */
export interface UseDependenciesOptions {
	/**
	 * Dependencies array that triggers re-execution when changed
	 * Similar to useEffect dependencies
	 */
	dependencies?: unknown[];
}

/**
 * Hook options with immediate execution
 */
export interface UseImmediateOptions {
	/**
	 * Whether to execute immediately on mount
	 * @default false
	 */
	immediate?: boolean;
}

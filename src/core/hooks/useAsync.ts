import { useLogger } from '@core/providers/useLogger';
import { getDependenciesKey } from '@core/utils/hookUtils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Async function type
 */
type AsyncFunction<T> = () => Promise<T>;

/**
 * Options for useAsync hook
 */
export interface UseAsyncOptions<T> {
	/**
	 * Whether to execute the async function immediately on mount
	 * @default false
	 */
	immediate?: boolean;
	/**
	 * Dependencies array that triggers a re-execution when changed
	 * Similar to useEffect dependencies
	 */
	dependencies?: unknown[];
	/**
	 * Callback invoked when the async function resolves successfully
	 */
	onSuccess?: (data: T) => void;
	/**
	 * Callback invoked when the async function rejects
	 */
	onError?: (error: Error) => void;
	/**
	 * Callback invoked when the async function completes (success or error)
	 */
	onComplete?: () => void;
}

/**
 * Return type for useAsync hook
 */
export interface UseAsyncReturn<T> {
	/**
	 * The result data, or null if not yet executed or on error
	 */
	data: T | null;
	/**
	 * The error, or null if no error
	 */
	error: Error | null;
	/**
	 * Whether the async function is currently executing
	 */
	loading: boolean;
	/**
	 * Manually execute the async function
	 */
	execute: () => Promise<void>;
	/**
	 * Reset the hook state (clear data and error)
	 */
	reset: () => void;
}

/**
 * Convert unknown error to Error instance
 */
function normalizeError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}

/**
 * Check if component is still mounted and execute callback if true
 */
function ifMounted(isMountedRef: { current: boolean }, callback: () => void): void {
	if (isMountedRef.current) {
		callback();
	}
}

/**
 * Internal hook state management
 */
function useAsyncState<T>() {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);
	const reset = useCallback((): void => {
		setData(null);
		setError(null);
		setLoading(false);
	}, []);
	return { data, setData, error, setError, loading, setLoading, reset };
}

/**
 * Setup mount tracking effect
 */
function useMountTracking(isMountedRef: { current: boolean }): void {
	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, [isMountedRef]);
}

/**
 * Options for immediate execution
 */
interface ImmediateExecutionOptions {
	immediate: boolean;
	execute: () => Promise<void>;
	dependenciesKey: string;
	logger: ReturnType<typeof useLogger>;
}

/**
 * Setup immediate execution effect
 */
function useImmediateExecution(options: ImmediateExecutionOptions): void {
	const { immediate, execute, dependenciesKey, logger } = options;
	useEffect(() => {
		if (immediate) {
			execute().catch(error_ =>
				logger.error('useAsync: Unhandled error in immediate execution', { error: error_ })
			);
		}
	}, [immediate, execute, dependenciesKey, logger]);
}

/**
 * Generic async execution hook
 *
 * Provides flexible async function execution with state management.
 * More flexible than useFetch as it accepts any async function.
 *
 * @example
 * ```tsx
 * const { data, loading, execute } = useAsync(async () => {
 *   return await http.get('/api/user').then(r => r.data);
 * }, { immediate: true });
 * ```
 *
 * @template T - The return type of the async function
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns An object with data, error, loading, execute, and reset functions
 */
export function useAsync<T>(
	asyncFunction: AsyncFunction<T>,
	options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
	const logger = useLogger();
	const { immediate = false, dependencies = [], onSuccess, onError, onComplete } = options;
	const { data, setData, error, setError, loading, setLoading, reset } = useAsyncState<T>();
	const isMountedRef = useRef(true);
	const dependenciesKey = useMemo(() => getDependenciesKey(dependencies), [dependencies]);
	const execute = useCallback(async (): Promise<void> => {
		if (!isMountedRef.current) return;
		setLoading(true);
		setError(null);
		try {
			const result = await asyncFunction();
			ifMounted(isMountedRef, () => {
				setData(result);
				onSuccess?.(result);
			});
		} catch (error_) {
			ifMounted(isMountedRef, () => {
				const errorObj = normalizeError(error_);
				setError(errorObj);
				setData(null);
				onError?.(errorObj);
			});
		} finally {
			ifMounted(isMountedRef, () => {
				setLoading(false);
				onComplete?.();
			});
		}
	}, [asyncFunction, onSuccess, onError, onComplete, setData, setError, setLoading]);
	useMountTracking(isMountedRef);
	useImmediateExecution({ immediate, execute, dependenciesKey, logger });
	return { data, error, loading, execute, reset };
}

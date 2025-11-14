import { useLogger } from '@core/providers/logger/useLogger';
import { getDependenciesKey } from '@core/utils/hookUtils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
	/**
	 * AbortSignal for cancellation support
	 * If provided, the async function should respect this signal for cancellation
	 * @example
	 * ```tsx
	 * const { execute, cancel } = useAsync(async (signal) => {
	 *   const response = await fetch('/api/data', { signal });
	 *   return response.json();
	 * });
	 * ```
	 */
	signal?: AbortSignal;
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
	 * Cancel the current execution (if abort controller is available)
	 */
	cancel: () => void;
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
		// eslint-disable-next-line react-hooks/exhaustive-deps -- ref object doesn't need to be in deps
	}, []);
}

/**
 * Options for immediate execution
 */
interface ImmediateExecutionOptions {
	immediate: boolean;
	execute: () => Promise<void>;
	dependenciesKey: string;
	logger: ReturnType<typeof useLogger>;
	abortControllerRef: { current: AbortController | null };
}

/**
 * Setup immediate execution effect
 */
function useImmediateExecution(options: ImmediateExecutionOptions): void {
	const { immediate, execute, dependenciesKey, logger, abortControllerRef } = options;
	useEffect(() => {
		if (immediate) {
			execute().catch(error_ =>
				logger.error('useAsync: Unhandled error in immediate execution', error_)
			);
		}
		return (): void => {
			// Cleanup: abort any pending requests on unmount or dependency change
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				abortControllerRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- abortControllerRef is a ref, doesn't need to be in deps
	}, [immediate, execute, dependenciesKey, logger]);
}

/**
 * Create and setup abort controller for async execution
 */
function setupAbortController(
	ref: { current: AbortController | null },
	providedSignal?: AbortSignal
): AbortController | undefined {
	// If signal provided in options, use it directly (no internal controller needed)
	if (providedSignal) {
		return undefined;
	}

	// Create internal abort controller for cancellation support
	if (ref.current) {
		ref.current.abort();
	}
	const controller = new AbortController();
	ref.current = controller;
	return controller;
}

/**
 * Cleanup abort controller
 */
function cleanupAbortController(ref: { current: AbortController | null }): void {
	ref.current?.abort();
	ref.current = null;
}

/**
 * Check if execution should be aborted
 */
function isAborted(signal?: AbortSignal): boolean {
	return signal?.aborted ?? false;
}

/**
 * Handler options
 */
interface HandlerOptions<T> {
	isMountedRef: { current: boolean };
	setData: (data: T | null) => void;
	setError: (error: Error | null) => void;
	setLoading: (loading: boolean) => void;
	onSuccess: ((data: T) => void) | undefined;
	onError: ((error: Error) => void) | undefined;
	onComplete: (() => void) | undefined;
}

/**
 * Handle successful execution result
 */
function handleSuccess<T>(opts: HandlerOptions<T>, result: T): void {
	const { isMountedRef, setData, onSuccess } = opts;
	ifMounted(isMountedRef, () => {
		setData(result);
		onSuccess?.(result);
	});
}

/**
 * Handle execution error
 */
function handleError<T>(opts: HandlerOptions<T>, error_: unknown): void {
	const { isMountedRef, setError, setData, onError } = opts;
	ifMounted(isMountedRef, () => {
		const errorObj = normalizeError(error_);
		setError(errorObj);
		setData(null);
		onError?.(errorObj);
	});
}

/**
 * Handle execution completion
 */
function handleComplete<T>(opts: HandlerOptions<T>): void {
	const { isMountedRef, setLoading, onComplete } = opts;
	ifMounted(isMountedRef, () => {
		setLoading(false);
		onComplete?.();
	});
}

/**
 * Generic async execution hook
 *
 * Provides flexible async function execution with state management.
 * More flexible than useFetch as it accepts any async function.
 *
 * Supports cancellation via AbortSignal. If you need cancellation, pass a signal
 * or use the cancel function returned by the hook.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, loading, execute } = useAsync(async () => {
 *   return await http.get('/api/user').then(r => r.data);
 * }, { immediate: true });
 * ```
 *
 * @example
 * ```tsx
 * // With cancellation support
 * const { data, loading, execute, cancel } = useAsync(async (signal) => {
 *   const response = await fetch('/api/data', { signal });
 *   return response.json();
 * });
 *
 * // Cancel execution
 * cancel();
 * ```
 *
 * @template T - The return type of the async function
 * @param asyncFunction - The async function to execute (optionally accepts AbortSignal)
 * @param options - Configuration options
 * @returns An object with data, error, loading, execute, cancel, and reset functions
 */
export function useAsync<T>(
	asyncFunction: (signal?: AbortSignal) => Promise<T>,
	options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T> {
	const logger = useLogger();
	const { immediate = false, dependencies = [], onSuccess, onError, onComplete, signal } = options;
	const { data, setData, error, setError, loading, setLoading, reset } = useAsyncState<T>();
	const isMountedRef = useRef(true);
	const abortControllerRef = useRef<AbortController | null>(null);
	const dependenciesKey = useMemo(() => getDependenciesKey(dependencies), [dependencies]);

	const handlerOpts = useMemo<HandlerOptions<T>>(
		() => ({ isMountedRef, setData, setError, setLoading, onSuccess, onError, onComplete }),
		[setData, setError, setLoading, onSuccess, onError, onComplete]
	);

	const execute = useCallback(async (): Promise<void> => {
		if (!isMountedRef.current) return;
		const internalController = setupAbortController(abortControllerRef, signal);
		const executionSignal = signal ?? internalController?.signal;
		if (isAborted(executionSignal)) return;
		setLoading(true);
		setError(null);
		try {
			const result = await asyncFunction(executionSignal);
			if (isAborted(executionSignal)) return;
			handleSuccess(handlerOpts, result);
		} catch (error_) {
			if (isAborted(executionSignal)) return;
			handleError(handlerOpts, error_);
		} finally {
			if (!isAborted(executionSignal)) {
				handleComplete(handlerOpts);
			}
		}
	}, [asyncFunction, handlerOpts, setLoading, setError, signal]);

	const cancel = useCallback((): void => {
		cleanupAbortController(abortControllerRef);
	}, []);

	const resetWithCleanup = useCallback((): void => {
		cleanupAbortController(abortControllerRef);
		reset();
	}, [reset]);

	useMountTracking(isMountedRef);
	useImmediateExecution({ immediate, execute, dependenciesKey, logger, abortControllerRef });
	return { data, error, loading, execute, cancel, reset: resetWithCleanup };
}

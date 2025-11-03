import type { HttpClientConfig, HttpClientResponse } from '@core/lib/httpClient';
import type { HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { useHttp } from '@core/providers/useHttp';
import { useLogger } from '@core/providers/useLogger';
import { getDependenciesKey } from '@core/utils/hookUtils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Options for the useFetch hook
 */
export interface UseFetchOptions extends Omit<HttpClientConfig, 'body' | 'method'> {
	/**
	 * Whether to automatically fetch when the component mounts or when dependencies change
	 * @default false
	 */
	autoFetch?: boolean;
	/**
	 * Dependencies array that triggers a refetch when changed
	 * Similar to useEffect dependencies
	 */
	dependencies?: unknown[];
}

/**
 * Return type for the useFetch hook
 */
export interface UseFetchReturn<T> {
	/**
	 * The fetched data, or null if not yet fetched or on error
	 */
	data: T | null;
	/**
	 * The error message, or null if no error
	 */
	error: string | null;
	/**
	 * Whether a fetch is currently in progress
	 */
	loading: boolean;
	/**
	 * Manually trigger a fetch
	 */
	fetch: () => Promise<void>;
	/**
	 * Reset the hook state (clear data and error)
	 */
	reset: () => void;
}

interface FetchContext<T> {
	abortController: AbortController;
	setData: (data: T | null) => void;
	logger: LoggerPort;
	url: string;
}

/**
 * Handle successful fetch response
 */
function handleFetchSuccess<T>(context: FetchContext<T>, response: HttpClientResponse<T>): void {
	const { abortController, setData, logger, url } = context;
	if (abortController.signal.aborted) {
		return;
	}
	setData(response.data);
	logger.info('useFetch: Successfully fetched data', { url, data: response.data });
}

interface ErrorContext {
	abortController: AbortController;
	setError: (error: string | null) => void;
	logger: LoggerPort;
	url: string;
}

/**
 * Handle fetch error
 */
function handleFetchError(context: ErrorContext, error_: unknown): void {
	const { abortController, setError, logger, url } = context;
	if (abortController.signal.aborted) {
		return;
	}
	const errorMessage = error_ instanceof Error ? error_.message : 'An unknown error occurred';
	setError(errorMessage);
	logger.error('useFetch: Error fetching data', { url, error: error_ });
}

interface PerformFetchContext<T> {
	url: string;
	httpConfig: Omit<HttpClientConfig, 'body' | 'method'>;
	abortController: AbortController;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setData: (data: T | null) => void;
	logger: LoggerPort;
	http: HttpPort;
}

/**
 * Perform the actual fetch operation
 */
async function performFetch<T>(context: PerformFetchContext<T>): Promise<void> {
	const { url, httpConfig, abortController, setLoading, setError, setData, logger, http } = context;
	setLoading(true);
	setError(null);

	try {
		const response: HttpClientResponse<T> = await http.get<T>(url, {
			...httpConfig,
			signal: abortController.signal,
		});
		handleFetchSuccess({ abortController, setData, logger, url }, response);
	} catch (error_) {
		handleFetchError({ abortController, setError, logger, url }, error_);
	} finally {
		if (!abortController.signal.aborted) {
			setLoading(false);
		}
	}
}

/**
 * Create abort controller and cancel previous request
 */
function setupAbortController<T extends { current: AbortController | null }>(
	ref: T
): AbortController {
	if (ref.current) {
		ref.current.abort();
	}
	const controller = new AbortController();
	ref.current = controller;
	return controller;
}

/**
 * Memoize http config by serializing to key
 */
function memoizeHttpConfig<T>(config: T): [string, T] {
	let key: string;
	try {
		key = JSON.stringify(config);
	} catch {
		key = '';
	}
	return [key, config];
}

/**
 * Cleanup abort controller from ref
 */
function cleanupAbortController(ref: { current: AbortController | null }): void {
	ref.current?.abort();
	ref.current = null;
}

interface AutoFetchOptions {
	autoFetch: boolean;
	fetchData: () => Promise<void>;
	dependenciesKey: string;
	abortControllerRef: { current: AbortController | null };
	logger: LoggerPort;
}

/**
 * Setup auto-fetch effect
 */
function useAutoFetchEffect(options: AutoFetchOptions): void {
	const { autoFetch, fetchData, abortControllerRef, logger } = options;
	useEffect(() => {
		if (!autoFetch) return;
		fetchData().catch(error_ =>
			logger.error('useFetch: Unhandled error in auto-fetch', { error: error_ })
		);
		return (): void => {
			cleanupAbortController(abortControllerRef);
		};
	}, [abortControllerRef, autoFetch, fetchData, logger]);
}

/**
 * Generic data fetching hook
 *
 * Provides a convenient way to fetch data using the httpClient with
 * automatic loading and error state management.
 *
 * @example
 * ```tsx
 * // Manual fetch
 * const { data, loading, error, fetch } = useFetch<ApiResponse>('https://api.example.com/users');
 *
 * useEffect(() => {
 *   fetch();
 * }, []);
 *
 * // Auto-fetch on mount
 * const { data, loading, error } = useFetch<ApiResponse>('https://api.example.com/users', {
 *   autoFetch: true
 * });
 *
 * // Auto-fetch with dependencies
 * const { data, loading, error } = useFetch<ApiResponse>(`https://api.example.com/users/${userId}`, {
 *   autoFetch: true,
 *   dependencies: [userId]
 * });
 * ```
 *
 * @template T - The type of the response data
 * @param url - The URL to fetch from
 * @param options - Fetch options and configuration
 * @returns An object with data, loading, error, fetch, and reset functions
 */
export function useFetch<T = unknown>(
	url: string,
	options: UseFetchOptions = {}
): UseFetchReturn<T> {
	const logger = useLogger();
	const http = useHttp();
	const { autoFetch = false, dependencies = [], ...httpConfigRest } = options;
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const dependenciesKey = useMemo(() => getDependenciesKey(dependencies), [dependencies]);
	const [_httpConfigKey, httpConfig] = useMemo(
		() => memoizeHttpConfig(httpConfigRest),
		[httpConfigRest]
	);
	const fetchData = useCallback(async (): Promise<void> => {
		const abortController = setupAbortController(abortControllerRef);
		await performFetch({
			url,
			httpConfig,
			abortController,
			setLoading,
			setError,
			setData,
			logger,
			http,
		});
	}, [url, httpConfig, logger, http]);
	const reset = useCallback((): void => {
		cleanupAbortController(abortControllerRef);
		setData(null);
		setError(null);
		setLoading(false);
	}, []);
	useAutoFetchEffect({ autoFetch, fetchData, dependenciesKey, abortControllerRef, logger });
	return { data, error, loading, fetch: fetchData, reset };
}

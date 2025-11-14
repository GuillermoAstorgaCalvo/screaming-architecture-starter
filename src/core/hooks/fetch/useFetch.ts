import { useHttp } from '@core/providers/useHttp';
import { useLogger } from '@core/providers/useLogger';
import { getDependenciesKey } from '@core/utils/hookUtils';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useAutoFetchEffect } from './useFetch.effects';
import {
	cleanupAbortController,
	memoizeHttpConfig,
	performFetch,
	setupAbortController,
} from './useFetch.helpers';
import type { UseFetchOptions, UseFetchReturn } from './useFetch.types';

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

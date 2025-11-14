import { cleanupAbortController } from '@core/hooks/fetch/useFetch.helpers';
import type { AutoFetchOptions } from '@core/hooks/fetch/useFetch.types';
import { useEffect, useRef } from 'react';

/**
 * Setup auto-fetch effect
 */
export function useAutoFetchEffect(options: AutoFetchOptions): void {
	const { autoFetch, fetchData, dependenciesKey, abortControllerRef, logger } = options;
	const fetchDataRef = useRef(fetchData);
	fetchDataRef.current = fetchData;

	useEffect(() => {
		if (!autoFetch) return;
		fetchDataRef
			.current()
			.catch(error_ => logger.error('useFetch: Unhandled error in auto-fetch', error_));
		return (): void => {
			cleanupAbortController(abortControllerRef);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- dependenciesKey is sufficient, fetchData accessed via ref, logger is stable from provider
	}, [dependenciesKey, autoFetch, logger]);
}

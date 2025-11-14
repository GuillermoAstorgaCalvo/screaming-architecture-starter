import type { ErrorContext, FetchContext, PerformFetchContext } from '@core/hooks/fetch/useFetch.types';
import type { HttpClientResponse } from '@core/ports/HttpPort';

/**
 * Handle successful fetch response
 */
export function handleFetchSuccess<T>(
	context: FetchContext<T>,
	response: HttpClientResponse<T>
): void {
	const { abortController, setData, logger, url } = context;
	if (abortController.signal.aborted) {
		return;
	}
	setData(response.data);
	logger.info('useFetch: Successfully fetched data', { url, data: response.data });
}

/**
 * Handle fetch error
 */
export function handleFetchError(context: ErrorContext, error_: unknown): void {
	const { abortController, setError, logger, url } = context;
	if (abortController.signal.aborted) {
		return;
	}
	let errorMessage: string;
	if (error_ instanceof Error) {
		errorMessage = error_.message;
	} else if (typeof error_ === 'string') {
		errorMessage = error_;
	} else {
		errorMessage = 'An unknown error occurred';
	}
	setError(errorMessage);
	logger.error('useFetch: Error fetching data', error_, { url });
}

/**
 * Perform the actual fetch operation
 */
export async function performFetch<T>(context: PerformFetchContext<T>): Promise<void> {
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
export function setupAbortController<T extends { current: AbortController | null }>(
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
export function memoizeHttpConfig<T>(config: T): [string, T] {
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
export function cleanupAbortController(ref: { current: AbortController | null }): void {
	ref.current?.abort();
	ref.current = null;
}

import type { HttpClientConfig, HttpPort } from '@core/ports/HttpPort';
import type { LoggerPort } from '@core/ports/LoggerPort';

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

/**
 * Context for handling successful fetch response
 */
export interface FetchContext<T> {
	abortController: AbortController;
	setData: (data: T | null) => void;
	logger: LoggerPort;
	url: string;
}

/**
 * Context for handling fetch errors
 */
export interface ErrorContext {
	abortController: AbortController;
	setError: (error: string | null) => void;
	logger: LoggerPort;
	url: string;
}

/**
 * Context for performing fetch operation
 */
export interface PerformFetchContext<T> {
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
 * Options for auto-fetch effect
 */
export interface AutoFetchOptions {
	autoFetch: boolean;
	fetchData: () => Promise<void>;
	dependenciesKey: string;
	abortControllerRef: { current: AbortController | null };
	logger: LoggerPort;
}

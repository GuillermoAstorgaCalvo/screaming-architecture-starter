import { env } from '@core/config/env.client';
import type { QueryProviderProps } from '@src-types/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

// React Query configuration constants
const STALE_TIME_SECONDS = 30;
const CACHE_TIME_MINUTES = 5;
const SECONDS_TO_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_TO_MS = SECONDS_PER_MINUTE * SECONDS_TO_MS;
const MAX_RETRY_DELAY_MS = 30_000;
const MUTATION_RETRY_DELAY_MS = SECONDS_TO_MS;

/**
 * Query Provider
 * Provides React Query client with sensible defaults for data fetching
 * Creates a new QueryClient instance on mount with optimized settings
 */
export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
	const queryClient = useMemo(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Stale time: data is considered fresh for 30 seconds
						// Prevents unnecessary refetches
						staleTime: STALE_TIME_SECONDS * SECONDS_TO_MS,
						// Cache time: unused data stays in cache for 5 minutes
						gcTime: CACHE_TIME_MINUTES * MINUTES_TO_MS,
						// Retry failed requests with exponential backoff
						retry: 3,
						retryDelay: (attemptIndex: number) =>
							Math.min(SECONDS_TO_MS * 2 ** attemptIndex, MAX_RETRY_DELAY_MS),
						// Refetch on window focus in production (helps keep data fresh)
						refetchOnWindowFocus: env.PROD,
						// Refetch on reconnect
						refetchOnReconnect: true,
						// Don't refetch on mount if data exists
						refetchOnMount: true,
					},
					mutations: {
						// Retry failed mutations once
						retry: 1,
						retryDelay: MUTATION_RETRY_DELAY_MS,
					},
				},
			}),
		[]
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

QueryProvider.displayName = 'QueryProvider';
